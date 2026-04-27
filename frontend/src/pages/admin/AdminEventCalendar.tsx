import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

import { Search, Plus, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import EventModal from "../components/EventModal";
import EventFormModal from "../components/EventFormModal";

const AdminEventCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [raw, setRaw] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [viewModal, setViewModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      // Use the /calendar endpoint which returns all events (no pagination)
      const res = await Axios(SummaryApi.get_all_events_calendar);
      const payload = res.data?.data ?? res.data ?? [];
      setRaw(Array.isArray(payload) ? payload : Object.values(payload));
    } catch {
      // Fallback: try paginated endpoint with large size
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

  useEffect(() => {
    const filtered = raw
      .filter((e: any) =>
        (e?.title ?? "").toLowerCase().includes((search ?? "").toLowerCase())
      )
      .map((e: any) => ({
        title: e?.title ?? "Untitled Event",
        start: e?.eventDateTime,
        backgroundColor: e?.active ? "#7c3aed" : "#94a3b8",
        borderColor: e?.active ? "#6d28d9" : "#64748b",
        textColor: "#ffffff",
        extendedProps: e,
      }));
    setEvents(filtered);
  }, [search, raw]);

  const total = raw.length;
  const active = raw.filter((e) => e.active).length;
  const inactive = total - active;

  const stats = [
    { label: "Total Events", value: total, icon: CalendarDays, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Active", value: active, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Inactive", value: inactive, icon: XCircle, color: "text-slate-400", bg: "bg-slate-100" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700
                focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400
                placeholder:text-slate-300 transition-all"
            />
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl
              shadow-lg shadow-violet-200 transition-all shrink-0"
          >
            <Plus size={16} />
            New Event
          </button>
        </div>

        {/* Calendar Body */}
        <div className="p-5">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
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
            height={580}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-violet-600 inline-block" />
          Active event
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" />
          Inactive event
        </div>
      </div>

      {/* View/Edit Modal */}
      <EventModal
        open={viewModal}
        onClose={() => { setViewModal(false); fetchEvents(); }}
        event={selected}
      />

      {/* Create Modal */}
      <EventFormModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default AdminEventCalendar;