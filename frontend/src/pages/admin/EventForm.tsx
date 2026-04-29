import { useEffect, useRef, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";
import {
  Upload, X, CalendarDays, MapPin, Ticket, Type, AlignLeft, Tag,
  Coins, Building2, ChevronDown
} from "lucide-react";

const CATEGORIES = ["EVENT", "MOVIE", "SPORT", "FOOD", "HOLIDAY", "OTHER"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<Category, string> = {
  EVENT: "Event", MOVIE: "Movie", SPORT: "Sport",
  FOOD: "Food", HOLIDAY: "Holiday", OTHER: "Other",
};

// ✅ Fully synced with backend SubCategory enum
const SUBCATEGORIES: Record<Category, string[]> = {
  EVENT: [
    "CONCERT", "LIONEL_WENDT_THEATRE", "DINNER_DANCE", "EDM", "CLASSICAL",
    "EDUCATIONAL", "EXHIBITION", "EVENT_FESTIVAL", "ORCHESTRAL", "SEMINAR",
    "CONFERENCE", "MUSICAL_FESTIVAL", "TECH", "FREE", "ONLINE", "DJ", "OTHER_EVENT",
  ],
  MOVIE: [
    "MOVIE_FESTIVAL", "ACTION_MOVIE", "ADVENTURE_MOVIE", "ANIMATION", "ART",
    "BIOGRAPHY", "CHILDREN_MOVIE", "COMEDY_MOVIE", "CRIME", "DOCUMENTARY",
    "DRAMA_MOVIE", "EPIC", "FANTASY", "FICTION", "HISTORICAL", "HORROR",
    "MUSICAL", "MYSTERY", "ROMANCE", "SCIENCE_FICTION", "SPORTS_MOVIE",
    "THRILLER", "WESTERN", "ADULT_18_PLUS",
  ],
  SPORT: [
    "CRICKET", "RUGBY", "FOOTBALL", "MOTOR_SPORT", "CHILDREN_SPORT",
    "BASKETBALL", "SPORT_FESTIVAL", "GOLF", "BOXING", "VOLLEYBALL",
  ],
  FOOD: [
    "FOOD_FESTIVAL", "TABLE_RESERVATION", "FOOD_ORDER", "RESTAURANT",
    "PUB_AND_BAR", "HOTELS",
  ],
  HOLIDAY: [
    "AMUSEMENT_PARK", "ADVENTURE_TRAVEL", "CARTING", "SURFING", "DIVING",
    "TRAVELING", "WHALE_WATCHING", "ATTRACTIONS", "RIDES", "ACTIVITIES",
    "CHILDREN_ACTIVITY", "HOTEL_BOOKING", "VILLA_BOOKING", "ROOM_RESERVATION",
    "HOLIDAY_FESTIVAL", "VOUCHERS", "WATER_RAFTING", "CAMPING", "HIKING",
    "NATIONAL_PARK", "OTHER_HOLIDAY",
  ],
  OTHER: [
    "CULTURAL_FESTIVAL", "E_VOUCHERS",
  ],
};

// ─── Reusable field wrapper ───────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
      {label}
    </label>
    <div className="relative flex items-center">
      {Icon && (
        <span className="pointer-events-none absolute left-3 text-slate-400">
          <Icon size={14} />
        </span>
      )}
      {children}
    </div>
  </div>
);

const baseCls =
  "w-full rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 " +
  "transition-colors placeholder:text-slate-400 " +
  "focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100";

const inputCls = `${baseCls} py-2.5 pl-9 pr-3`;
const selectCls = `${baseCls} py-2.5 pl-9 pr-8 appearance-none cursor-pointer`;

// ─── Section header ───────────────────────────────────────────────────────────
const Section = ({ title, children }: any) => (
  <div className="space-y-3">
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400
                  border-b border-slate-100 pb-1.5">
      {title}
    </p>
    {children}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const EventForm = ({ isEdit = false, existingEvent, onClose }: any) => {
  const [data, setData] = useState({
    title: "",
    location: "",
    venue: "",
    description: "",
    price: 0,
    totalTickets: 0,
    eventDateTime: "",
    category: "EVENT" as Category,
    subCategory: "CONCERT",
  });

  const [images, setImages]     = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!existingEvent) return;
    setData({
      title:         existingEvent.title                    || "",
      location:      existingEvent.location                 || "",
      venue:         existingEvent.venue                    || "",
      description:   existingEvent.description              || "",
      price:         existingEvent.price                    || 0,
      totalTickets:  existingEvent.totalTickets             || 0,
      eventDateTime: existingEvent.eventDateTime?.slice(0, 16) || "",
      category:      existingEvent.category                 || "EVENT",
      subCategory:   existingEvent.subCategory              || "CONCERT",
    });
    if (existingEvent.imageUrls) setPreviews(existingEvent.imageUrls);
  }, [existingEvent]);

  const set = (key: string) => (e: any) =>
    setData((p) => ({ ...p, [key]: e.target.value }));

  const handleCategoryChange = (cat: Category) => {
    setData((p) => ({ ...p, category: cat, subCategory: SUBCATEGORIES[cat][0] }));
  };

  const handleFile = (files: FileList | File[]) => {
    let newFiles = Array.from(files);
    if (images.length + newFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      newFiles = newFiles.slice(0, 5 - images.length);
    }
    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("event", JSON.stringify(data));
    images.forEach((img) => fd.append("images", img));
    try {
      if (isEdit) {
        await Axios({ ...SummaryApi.update_event(existingEvent.id), data: fd });
        toast.success("Event updated!");
      } else {
        await Axios({ ...SummaryApi.create_event, data: fd });
        toast.success("Event created!");
      }
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-1">

      {/* ── BASIC INFO ─────────────────────────────────────── */}
      <Section title="Basic info">
        <Field label="Title" icon={Type}>
          <input
            className={inputCls}
            value={data.title}
            onChange={set("title")}
            placeholder="e.g. Summer Music Festival"
            required
          />
        </Field>

        {/* Category pills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCategoryChange(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  data.category === c
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-category — uses a select because lists can be long (e.g. MOVIE has 24 items) */}
        <Field label="Sub-category" icon={Tag}>
          <select
            className={selectCls}
            value={data.subCategory}
            onChange={set("subCategory")}
          >
            {SUBCATEGORIES[data.category].map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" />
        </Field>

        <Field label="Description" icon={AlignLeft}>
          <textarea
            className={`${baseCls} resize-none py-2.5 pl-9 pr-3`}
            rows={3}
            value={data.description}
            onChange={set("description")}
            placeholder="Describe your event…"
          />
        </Field>
      </Section>

      {/* ── LOCATION & TIME ────────────────────────────────── */}
      <Section title="Location & time">
        <div className="grid grid-cols-2 gap-3">
          <Field label="City / Country" icon={MapPin}>
            <input className={inputCls} value={data.location} onChange={set("location")} placeholder="Colombo, LK" />
          </Field>
          <Field label="Venue" icon={Building2}>
            <input className={inputCls} value={data.venue} onChange={set("venue")} placeholder="Venue name" />
          </Field>
        </div>
        <Field label="Date & time" icon={CalendarDays}>
          <input
            type="datetime-local"
            className={inputCls}
            value={data.eventDateTime}
            onChange={set("eventDateTime")}
            required
          />
        </Field>
      </Section>

      {/* ── TICKETS & PRICING ──────────────────────────────── */}
      <Section title="Tickets & pricing">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (LKR)" icon={Coins}>
            <input type="number" min={0} className={inputCls} value={data.price} onChange={set("price")} />
          </Field>
          <Field label="Total tickets" icon={Ticket}>
            <input type="number" min={1} className={inputCls} value={data.totalTickets} onChange={set("totalTickets")} />
          </Field>
        </div>
      </Section>

      {/* ── IMAGES ─────────────────────────────────────────── */}
      <Section title={`Images (${previews.length}/5)`}>
        {previews.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square flex items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-violet-400 hover:text-violet-500 transition-colors"
              >
                <Upload size={16} />
              </button>
            )}
          </div>
        )}

        {previews.length === 0 && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragging ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <Upload size={20} className="text-slate-400" />
            <p className="text-sm text-slate-500">
              Drag & drop or <span className="font-medium text-violet-600">browse files</span>
            </p>
            <span className="text-xs text-slate-400">PNG, JPG up to 10 MB each · max 5 images</span>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files)}
        />
      </Section>

      {/* ── SUBMIT ─────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
      >
        {loading ? "Saving…" : isEdit ? "Update event" : "Create event"}
      </button>

    </form>
  );
};

export default EventForm;