import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

import {
  Search,
  Plus,
  CalendarDays,
  CheckCircle2,
  XCircle,
  X,
  Menu,
} from "lucide-react";
import EventModal from "../components/EventModal";
import EventFormModal from "../components/EventFormModal";

const OraganizerEventCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [raw, setRaw] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [viewModal, setViewModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<"dayGridMonth" | "dayGridWeek">(
    "dayGridMonth"
  );

  /* ─────────────── Fetch ─────────────── */
  const fetchEvents = async () => {
    try {
      // Primary endpoint: /my  → returns List<Event> under data
      const res = await Axios(SummaryApi.get_all_my_events);

      // Handle both shapes: { data: [...] }  or  { data: { data: [...] } }
      const raw =
        res.data?.data?.content ??   // paginated fallback
        res.data?.data ??            // { data: [...] }
        res.data ??                  // bare array
        [];

      setRaw(Array.isArray(raw) ? raw : Object.values(raw));
    } catch {
      // Fallback to paginated organizer events
      try {
        const res2 = await Axios({
          ...SummaryApi.get_all_events,
          params: { page: 0, size: 1000 },
        });
        const content = res2.data?.data?.content ?? [];
        setRaw(content);
      } catch {
        setRaw([]);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ─────────────── Filter → FC events ─────────────── */
  useEffect(() => {
    const q = (search ?? "").toLowerCase();
    const mapped = raw
      .filter((e: any) => (e?.title ?? "").toLowerCase().includes(q))
      .map((e: any) => ({
        id: e?.id,
        title: e?.title ?? "Untitled Event",
        // eventDateTime comes as ISO string from Spring (LocalDateTime serialised)
        start: e?.eventDateTime,
        backgroundColor: e?.active ? "#7c3aed" : "#94a3b8",
        borderColor: e?.active ? "#6d28d9" : "#64748b",
        textColor: "#ffffff",
        extendedProps: e,
      }));
    setEvents(mapped);
  }, [search, raw]);

  /* ─────────────── Stats ─────────────── */
  const total = raw.length;
  const active = raw.filter((e) => e.active).length;
  const inactive = total - active;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: CalendarDays,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Inactive",
      value: inactive,
      icon: XCircle,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
  ];

  /* ─────────────── Render ─────────────── */
  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
            >
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Calendar card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Toolbar – Desktop */}
        <div className="hidden sm:flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-xs">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm
                text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400/40
                focus:border-violet-400 placeholder:text-slate-300 transition-all"
            />
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600
              to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm
              font-semibold rounded-xl shadow-lg shadow-violet-200 transition-all shrink-0"
          >
            <Plus size={16} />
            New Event
          </button>
        </div>

        {/* Toolbar – Mobile */}
        <div className="flex sm:hidden items-center justify-between gap-2 px-3 py-3 border-b border-slate-100">
          {searchOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  autoFocus
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl
                    text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400/40
                    focus:border-violet-400 placeholder:text-slate-300 transition-all"
                />
              </div>
              <button
                onClick={() => { setSearchOpen(false); setSearch(""); }}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm font-semibold text-slate-700">My Events</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500"
                >
                  <Search size={15} />
                </button>
                <button
                  onClick={() => setCreateModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-600
                    to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md
                    shadow-violet-200 transition-all"
                >
                  <Plus size={14} />
                  New
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile view switcher */}
        <div className="flex sm:hidden items-center gap-2 px-3 pt-3">
          <button
            onClick={() => setCalendarView("dayGridMonth")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              calendarView === "dayGridMonth"
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setCalendarView("dayGridWeek")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              calendarView === "dayGridWeek"
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            Week
          </button>
        </div>

        {/* Calendar body */}
        <div className="p-2 sm:p-5 fc-mobile-wrap">
          <style>{`
            /* ── FullCalendar mobile overrides ── */
            .fc-mobile-wrap .fc-toolbar {
              flex-wrap: wrap;
              gap: 6px;
            }
            .fc-mobile-wrap .fc-toolbar-title {
              font-size: clamp(0.85rem, 3vw, 1.1rem);
              font-weight: 700;
              color: #1e293b;
            }
            .fc-mobile-wrap .fc-button {
              padding: 4px 10px;
              font-size: 0.7rem;
              border-radius: 8px;
              background: #f1f5f9;
              border-color: #e2e8f0;
              color: #475569;
              font-weight: 600;
            }
            .fc-mobile-wrap .fc-button-primary:not(.fc-button-active):hover {
              background: #e2e8f0;
              border-color: #cbd5e1;
              color: #334155;
            }
            .fc-mobile-wrap .fc-button-primary.fc-button-active,
            .fc-mobile-wrap .fc-button-primary:focus {
              background: #7c3aed !important;
              border-color: #6d28d9 !important;
              color: #fff !important;
              box-shadow: none !important;
            }
            .fc-mobile-wrap .fc-daygrid-day-number {
              font-size: clamp(0.65rem, 2vw, 0.85rem);
              padding: 2px 4px;
            }
            .fc-mobile-wrap .fc-col-header-cell-cushion {
              font-size: clamp(0.6rem, 2vw, 0.8rem);
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              color: #64748b;
              text-decoration: none;
            }
            .fc-mobile-wrap .fc-event {
              border-radius: 5px;
              font-size: clamp(0.55rem, 1.8vw, 0.75rem);
              padding: 1px 4px;
              cursor: pointer;
            }
            .fc-mobile-wrap .fc-daygrid-day.fc-day-today {
              background: #f5f3ff;
            }
            .fc-mobile-wrap .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
              background: #7c3aed;
              color: #fff;
              border-radius: 50%;
              width: 22px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            /* Hide desktop view buttons on mobile (we use custom switcher) */
            @media (max-width: 639px) {
              .fc-mobile-wrap .fc-toolbar-chunk:last-child {
                display: none;
              }
            }
          `}</style>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={calendarView}
            key={calendarView}           /* force remount on view change */
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            eventClick={(e) => {
              setSelected(e.event.extendedProps);
              setViewModal(true);
            }}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.5}
            fixedWeekCount={false}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-400 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-violet-600 inline-block" />
          Active event
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" />
          Inactive event
        </div>
      </div>

      {/* Modals */}
      <EventModal
        open={viewModal}
        onClose={() => {
          setViewModal(false);
          fetchEvents();
        }}
        event={selected}
      />
      <EventFormModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default OraganizerEventCalendar;