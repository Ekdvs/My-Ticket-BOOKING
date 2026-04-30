import { Calendar, MapPin } from "lucide-react";
import type { AppEvent } from "../../type/type";



const PLACEHOLDER = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80";

export const fmtDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " • " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
    " IST"
  );
};

export const fmtPrice = (p: number) =>
  p === 0 ? "Free" : `${p.toLocaleString()} LKR`;

const CAT_COLORS: Record<string, string> = {
  EVENT: "#f97316", MOVIE: "#ef4444", THEATRE: "#a855f7",
  SPORT: "#22c55e", HOLIDAY: "#06b6d4", FOOD: "#eab308", OTHER: "#ec4899",
};

interface EventCardProps {
  event: AppEvent;
  onClick: () => void;
  size?: "sm" | "md";
}

const EventCard = ({ event, onClick, size = "md" }: EventCardProps) => {
  const img    = event.imageUrls?.[0] || PLACEHOLDER;
  const sold   = event.availableTickets === 0;
  const color  = CAT_COLORS[event.category] || "#f97316";
  const imgH   = size === "sm" ? "h-36" : "h-44";

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col
        shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100
        hover:shadow-[0_10px_40px_rgba(0,0,0,0.13)] hover:-translate-y-1.5
        transition-all duration-300 ease-out`}
    >
      {/* Image */}
      <div className={`relative ${imgH} overflow-hidden bg-gray-100 shrink-0`}>
        <img
          src={img}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500 ease-out"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Sold out overlay */}
        {sold && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Category chip */}
        <div
          className="absolute top-2.5 left-2.5 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: color + "cc", backdropFilter: "blur(4px)" }}
        >
          {event.category}
        </div>

        {/* Coming soon badge */}
        {!sold && !event.active && (
          <div className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
            Coming Soon
          </div>
        )}

        {/* Sub-cat on image bottom */}
        <span className="absolute bottom-2 left-3 text-white/80 text-[10px] font-medium">
          {event.subCategory?.replace(/_/g, " ")}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-1 text-[11px] text-orange-500 font-semibold mb-1">
          <Calendar size={10} className="shrink-0" />
          <span className="line-clamp-1">{fmtDate(event.eventDateTime)}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
          <MapPin size={10} className="shrink-0" />
          <span className="line-clamp-1">{event.venue || event.location}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">From</p>
            <p className="text-sm font-extrabold text-gray-900">{fmtPrice(event.price)}</p>
          </div>
          <button
            disabled={sold || !event.active}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0
              ${sold
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : !event.active
                  ? "bg-amber-50 text-amber-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-100 hover:shadow-orange-200 hover:from-orange-600 hover:to-red-600"
              }`}
          >
            {sold ? "Sold Out" : !event.active ? "Soon" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;