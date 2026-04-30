import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import EventCard from "./Eventcard";
import type { AppEvent } from "../../type/type";


interface EventSectionProps {
  title: string;
  emoji?: string;
  accentColor?: string;
  events: AppEvent[];
  loading?: boolean;
  onEventClick: (e: AppEvent) => void;
  onViewAll?: () => void;
}

const SkeletonCard = () => (
  <div className="shrink-0 w-52 sm:w-56 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-100" />
    <div className="p-3.5 bg-white border border-gray-100 rounded-b-2xl">
      <div className="h-3 bg-gray-100 rounded-full mb-2 w-4/5" />
      <div className="h-2.5 bg-gray-100 rounded-full mb-1.5 w-3/5" />
      <div className="h-2.5 bg-gray-100 rounded-full mb-4 w-2/5" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-100 rounded-full w-16" />
        <div className="h-7 w-20 bg-gray-100 rounded-xl" />
      </div>
    </div>
  </div>
);

const EventSection = ({
  title,
  emoji = "🎫",
  accentColor = "#f97316",
  events,
  loading = false,
  onEventClick,
  onViewAll,
}: EventSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "l" | "r") => {
    scrollRef.current?.scrollBy({
      left: dir === "r" ? 280 : -280,
      behavior: "smooth",
    });
  };

  if (!loading && events.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: accentColor }}
          />
          <span className="text-base">{emoji}</span>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          {!loading && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: accentColor + "15", color: accentColor }}
            >
              {events.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors mr-1"
            >
              View all <ArrowRight size={12} />
            </button>
          )}
          <button
            onClick={() => scroll("l")}
            className="w-8 h-8 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center
              justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("r")}
            className="w-8 h-8 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center
              justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto pb-3 px-4 sm:px-0 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading
          ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          : events.map((e, i) => (
              <div
                key={e.id}
                className="shrink-0 w-52 sm:w-56 snap-start"
                style={{
                  animation: `cardFadeIn 0.4s ease-out both`,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <EventCard event={e} onClick={() => onEventClick(e)} />
              </div>
            ))}
      </div>

      {/* Mobile view all */}
      {onViewAll && !loading && (
        <div className="flex sm:hidden justify-center mt-3">
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            View all {title} <ArrowRight size={12} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateX(16px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </section>
  );
};

export default EventSection;