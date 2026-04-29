import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

import {
  Search, Plus, CalendarDays, CheckCircle2, XCircle,
  MapPin,  Ticket, Filter, LayoutGrid,
  Coins
} from "lucide-react";
import EventModal from "../components/EventModal";
import EventFormModal from "../components/EventFormModal";

const CATEGORY_COLORS: Record<string, string> = {
  EVENT: "bg-violet-100 text-violet-700",
  MOVIE: "bg-blue-100 text-blue-700",
  SPORT: "bg-emerald-100 text-emerald-700",
  FOOD: "bg-orange-100 text-orange-700",
  HOLIDAY: "bg-cyan-100 text-cyan-700",
  OTHER: "bg-slate-100 text-slate-600",
};

const OrganizerEventCards = () => {
  const [raw, setRaw] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [viewModal, setViewModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const fetchEvents = async (page = 0) => {
  setLoading(true);
  try {
    const res = await Axios({
      ...SummaryApi.get_all_my_events,
      params: { page, size: pageSize },
    });

    //console.log("Fetched events:", res.data);

    const apiData = res.data?.data;

    let content: any[] = [];
    let pages = 1;

    // ✅ Case 1: Paginated response
    if (apiData?.content) {
      content = apiData.content;
      pages = apiData.totalPages ?? 1;
    }
    // ✅ Case 2: Normal array response
    else if (Array.isArray(apiData)) {
      content = apiData;
      pages = 1;
    }

    setRaw(content);
    setTotalPages(pages);
  } catch (err) {
    console.error(err);
    setRaw([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let result = [...raw];
    if (search) result = result.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== "ALL") result = result.filter((e) => e.category === categoryFilter);
    if (statusFilter === "ACTIVE") result = result.filter((e) => e.active);
    if (statusFilter === "INACTIVE") result = result.filter((e) => !e.active);
    setFiltered(result);
  }, [search, categoryFilter, statusFilter, raw]);

  const total = raw.length;
  const active = raw.filter((e) => e.active).length;
  const inactive = total - active;

  const stats = [
    { label: "Total Events", value: total, icon: CalendarDays, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "Active", value: active, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Inactive", value: inactive, icon: XCircle, color: "text-slate-400", bg: "bg-slate-100", border: "border-slate-200" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid size={22} className="text-violet-600" />
            Event Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage all events from here</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl
            shadow-lg shadow-violet-200 transition-all"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-4 shadow-sm border ${border} flex items-center gap-3`}>
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

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
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

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700
              focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {["EVENT", "MOVIE", "SPORT", "FOOD", "HOLIDAY", "OTHER"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <span className="text-xs text-slate-400 ml-auto">{filtered.length} events</span>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-20 flex flex-col items-center gap-3">
          <CalendarDays size={40} className="text-slate-200" />
          <p className="text-slate-400 font-medium">No events found</p>
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition"
          >
            <Plus size={14} /> Create First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => { setSelected(event); setViewModal(true); }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600
              hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600
              hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* Event Detail Modal */}
      <EventModal
        open={viewModal}
        onClose={() => { setViewModal(false); fetchEvents(currentPage); }}
        event={selected}
      />

      {/* Create Modal */}
      <EventFormModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={() => fetchEvents(currentPage)}
      />
    </div>
  );
};

/* ── Event Card ─────────────────────────────── */
const EventCard = ({ event, onClick }: { event: any; onClick: () => void }) => {
  const date = event.eventDateTime
    ? new Date(event.eventDateTime).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "TBD";

  const catColor = CATEGORY_COLORS[event.category] ?? "bg-slate-100 text-slate-600";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-violet-50 to-indigo-100 overflow-hidden">
        {event.imageUrls?.[0] ? (
          <img
            src={event.imageUrls[0]}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarDays size={36} className="text-violet-300" />
          </div>
        )}

        {/* Status pill */}
        <div className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold
          ${event.active ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
          {event.active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {event.active ? "Active" : "Inactive"}
        </div>

        {/* Category */}
        <div className={`absolute top-2.5 left-2.5 px-2 py-1 rounded-full text-[10px] font-bold ${catColor}`}>
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1 group-hover:text-violet-700 transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={11} className="text-slate-400 shrink-0" />
            <span className="text-xs truncate">{event.location || "Location TBD"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <CalendarDays size={11} className="text-slate-400 shrink-0" />
            <span className="text-xs">{date}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
          <div className="flex items-center gap-1">
            <Coins size={12} className="text-violet-500" />
            <span className="text-sm font-bold text-slate-800">{event.price === 0 ? "Free" : `LKR ${event.price}`}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Ticket size={11} />
            <span className="text-xs">{event.availableTickets ?? event.totalTickets ?? 0} left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCards;