import { useEffect, useRef, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";
import {
  Upload, X, CalendarDays, MapPin, Ticket, Type, AlignLeft, Tag, Layers,
  Coins
} from "lucide-react";

const CATEGORIES = ["EVENT", "MOVIE", "SPORT", "FOOD", "HOLIDAY", "OTHER"];

const SUBCATEGORIES: Record<string, string[]> = {
  EVENT: ["CONCERT", "DINNER_DANCE", "EDM", "CLASSICAL", "EDUCATIONAL", "EXHIBITION",
    "EVENT_FESTIVAL", "SEMINAR", "CONFERENCE", "MUSICAL_FESTIVAL", "TECH", "FREE", "ONLINE", "DJ", "OTHER_EVENT"],
  MOVIE: ["MOVIE_FESTIVAL", "ACTION_MOVIE", "ADVENTURE_MOVIE", "ANIMATION", "COMEDY_MOVIE",
    "DOCUMENTARY", "DRAMA_MOVIE", "HORROR", "ROMANCE", "THRILLER", "SCIENCE_FICTION"],
  SPORT: ["CRICKET", "RUGBY", "FOOTBALL", "MOTOR_SPORT", "BASKETBALL", "SPORT_FESTIVAL",
    "GOLF", "BOXING", "VOLLEYBALL"],
  FOOD: ["FOOD_FESTIVAL", "TABLE_RESERVATION", "RESTAURANT", "PUB_AND_BAR", "HOTELS"],
  HOLIDAY: ["AMUSEMENT_PARK", "ADVENTURE_TRAVEL", "SURFING", "DIVING", "TRAVELING",
    "WHALE_WATCHING", "HOTEL_BOOKING", "CAMPING", "HIKING", "NATIONAL_PARK"],
  OTHER: ["CULTURAL_FESTIVAL", "E_VOUCHERS"],
};

const Field = ({ icon: Icon, label, children }: any) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
      {label}
    </label>
    <div className="relative flex items-center group">
      <span className="absolute left-3.5 text-slate-400 group-focus-within:text-violet-500 transition-colors z-10">
        <Icon size={15} />
      </span>
      {children}
    </div>
  </div>
);

const inputCls =
  "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 " +
  "focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 " +
  "placeholder:text-slate-300 transition-all shadow-sm";

const selectCls =
  "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 " +
  "focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 " +
  "transition-all shadow-sm appearance-none cursor-pointer";

const EventForm = ({ isEdit = false, existingEvent, onClose }: any) => {
  const [data, setData] = useState({
    title: "",
    location: "",
    venue: "",
    description: "",
    price: 0,
    totalTickets: 0,
    eventDateTime: "",
    category: "EVENT",
    subCategory: "CONCERT",
  });
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingEvent) {
      setData({
        title: existingEvent.title ?? "",
        location: existingEvent.location ?? "",
        venue: existingEvent.venue ?? "",
        description: existingEvent.description ?? "",
        price: existingEvent.price ?? 0,
        totalTickets: existingEvent.totalTickets ?? 0,
        eventDateTime: existingEvent.eventDateTime?.slice(0, 16) ?? "",
        category: existingEvent.category ?? "EVENT",
        subCategory: existingEvent.subCategory ?? "CONCERT",
      });
      setPreview(existingEvent.imageUrls?.[0] ?? null);
    }
  }, [existingEvent]);

  const handleFile = (files: FileList | File[]) => {
    const arr = Array.from(files) as File[];
    if (!arr.length) return;
    setImages(arr);
    setPreview(URL.createObjectURL(arr[0]));
  };

  const set = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData((p) => ({ ...p, [key]: e.target.value }));

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    const firstSub = SUBCATEGORIES[cat]?.[0] ?? "";
    setData((p) => ({ ...p, category: cat, subCategory: firstSub }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Field icon={Type} label="Event Title">
        <input className={inputCls} placeholder="Summer Music Festival 2025"
          value={data.title} onChange={set("title")} required />
      </Field>

      {/* Category + SubCategory */}
      <div className="grid grid-cols-2 gap-3">
        <Field icon={Tag} label="Category">
          <select className={selectCls} value={data.category} onChange={handleCategoryChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field icon={Layers} label="Sub Category">
          <select className={selectCls} value={data.subCategory} onChange={set("subCategory")}>
            {(SUBCATEGORIES[data.category] ?? []).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Location + Venue */}
      <div className="grid grid-cols-2 gap-3">
        <Field icon={MapPin} label="Location">
          <input className={inputCls} placeholder="Colombo, Sri Lanka"
            value={data.location} onChange={set("location")} required />
        </Field>
        <Field icon={MapPin} label="Venue">
          <input className={inputCls} placeholder="City Arena"
            value={data.venue} onChange={set("venue")} />
        </Field>
      </div>

      {/* Price + Tickets */}
      <div className="grid grid-cols-2 gap-3">
        <Field icon={Coins} label="Price (LKR)">
          <input className={inputCls} type="number" min={0} placeholder="0.00"
            value={data.price} onChange={set("price")} />
        </Field>
        <Field icon={Ticket} label="Total Tickets">
          <input className={inputCls} type="number" min={1} placeholder="500"
            value={data.totalTickets} onChange={set("totalTickets")} />
        </Field>
      </div>

      {/* Date & Time */}
      <Field icon={CalendarDays} label="Date & Time">
        <input className={inputCls} type="datetime-local"
          value={data.eventDateTime} onChange={set("eventDateTime")} required />
      </Field>

      {/* Description */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
          Description
        </label>
        <div className="relative group">
          <span className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <AlignLeft size={15} />
          </span>
          <textarea rows={3} placeholder="Tell attendees what this event is about…"
            value={data.description} onChange={set("description")}
            className={`${inputCls} pl-10 resize-none`} />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
          Event Banner
        </label>
        {preview ? (
          <div className="relative rounded-xl overflow-hidden h-40 group shadow-sm border border-slate-100">
            <img src={preview} className="w-full h-full object-cover" alt="preview" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button"
                onClick={() => { setPreview(null); setImages([]); }}
                className="bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow transition-all">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${dragging ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/40"}`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${dragging ? "bg-violet-100" : "bg-white shadow-sm"}`}>
                <Upload size={18} className={dragging ? "text-violet-500" : "text-slate-400"} />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {dragging ? "Release to upload" : "Drag & drop or click to browse"}
              </p>
              <p className="text-xs text-slate-400">PNG, JPG up to 10 MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files)} />
          </div>
        )}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm text-white
          bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-700 hover:to-indigo-700
          shadow-lg shadow-violet-200 transition-all
          disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {isEdit ? "Updating…" : "Creating…"}
          </>
        ) : (
          isEdit ? "Update Event" : "Create Event"
        )}
      </button>
    </form>
  );
};

export default EventForm;