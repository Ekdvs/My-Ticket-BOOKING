import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


import {
  X,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Calendar,
  DollarSign,
  Filter,
  Loader2,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import type { AppEvent } from "../../type/type";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import Navbar from "../components/Navbar";
import EventCard from "../components/Eventcard";
import Footer from "../components/Footer";


/* ─── Constants ─── */
const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  EVENT:   { label: "Events",   emoji: "🎵", color: "#f97316" },
  MOVIE:   { label: "Movies",   emoji: "🎬", color: "#ef4444" },
  THEATRE: { label: "Theatre",  emoji: "🎭", color: "#a855f7" },
  SPORT:   { label: "Sports",   emoji: "🏆", color: "#22c55e" },
  HOLIDAY: { label: "Holidays", emoji: "🌴", color: "#06b6d4" },
  FOOD:    { label: "Food",     emoji: "🍽️", color: "#eab308" },
  OTHER:   { label: "Other",    emoji: "🎪", color: "#ec4899" },
};

const SORT_OPTIONS = [
  { value: "date_asc",    label: "Date: Soonest First" },
  { value: "date_desc",   label: "Date: Latest First" },
  { value: "price_asc",   label: "Price: Low → High" },
  { value: "price_desc",  label: "Price: High → Low" },
];

const PAGE_SIZE = 12;

/* ─── Types ─── */
interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
  sort: string;
  search: string;
}

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-3.5 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      <div className="h-3 bg-gray-200 rounded-full w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-200 rounded-full w-16" />
        <div className="h-7 bg-gray-200 rounded-xl w-20" />
      </div>
    </div>
  </div>
);

/* ─── Filter Panel ─── */
interface FilterPanelProps {
  filters: Filters;
  onChange: (key: keyof Filters, val: string) => void;
  onApply: () => void;
  onReset: () => void;
  resultCount: number;
  loading: boolean;
}

const FilterPanel = ({ filters, onChange, onApply, onReset, resultCount, loading }: FilterPanelProps) => {
  const [priceOpen, setPriceOpen] = useState(false);
  const [dateOpen, setDateOpen]   = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasFilters =
    filters.category !== "ALL" ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.startDate ||
    filters.endDate ||
    filters.search;

  return (
    <div
      ref={panelRef}
      className="sticky top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">

          {/* Result count pill */}
          <div className="shrink-0 flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-2">
            {loading
              ? <Loader2 size={13} className="animate-spin text-gray-400" />
              : <span className="text-[11px] font-bold text-gray-600">{resultCount} results</span>
            }
          </div>

          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Category chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            {["ALL", ...Object.keys(CATEGORY_META)].map((cat) => {
              const meta   = CATEGORY_META[cat];
              const active = filters.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { onChange("category", cat); setTimeout(onApply, 0); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-150 ${
                    active
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={active ? { background: meta?.color || "#f97316" } : {}}
                >
                  {cat === "ALL" ? "✨ All" : `${meta.emoji} ${meta.label}`}
                </button>
              );
            })}
          </div>

          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Price filter dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setPriceOpen((p) => !p); setDateOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                filters.minPrice || filters.maxPrice
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <DollarSign size={12} />
              Price
              <ChevronDown size={11} className={`transition-transform ${priceOpen ? "rotate-180" : ""}`} />
            </button>
            {priceOpen && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-40">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Price Range (LKR)</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] font-semibold text-gray-400 uppercase">Min</label>
                    <input
                      type="number"
                      min={0}
                      value={filters.minPrice}
                      onChange={(e) => onChange("minPrice", e.target.value)}
                      placeholder="0"
                      className="w-full mt-1 px-2.5 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-semibold text-gray-400 uppercase">Max</label>
                    <input
                      type="number"
                      min={0}
                      value={filters.maxPrice}
                      onChange={(e) => onChange("maxPrice", e.target.value)}
                      placeholder="Any"
                      className="w-full mt-1 px-2.5 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => { setPriceOpen(false); onApply(); }}
                  className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Date filter dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setDateOpen((p) => !p); setPriceOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                filters.startDate || filters.endDate
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <Calendar size={12} />
              Date
              <ChevronDown size={11} className={`transition-transform ${dateOpen ? "rotate-180" : ""}`} />
            </button>
            {dateOpen && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-40">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Date Range</p>
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] font-semibold text-gray-400 uppercase">From</label>
                    <input
                      type="datetime-local"
                      value={filters.startDate}
                      onChange={(e) => onChange("startDate", e.target.value)}
                      className="w-full mt-1 px-2.5 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-gray-400 uppercase">To</label>
                    <input
                      type="datetime-local"
                      value={filters.endDate}
                      onChange={(e) => onChange("endDate", e.target.value)}
                      className="w-full mt-1 px-2.5 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => { setDateOpen(false); onApply(); }}
                  className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative shrink-0 ml-auto">
            <select
              value={filters.sort}
              onChange={(e) => { onChange("sort", e.target.value); setTimeout(onApply, 0); }}
              className="appearance-none pl-3 pr-8 py-2 text-[11px] font-bold border border-gray-200 rounded-xl bg-white text-gray-600 outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <SlidersHorizontal size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={onReset}
              className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors px-2"
            >
              <X size={12} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const EventsPage = () => {
  const navigate      = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── Derive initial filter state from URL ── */
  const initFilters = (): Filters => ({
    category:  searchParams.get("category")?.toUpperCase()    || "ALL",
    minPrice:  searchParams.get("minPrice")                   || "",
    maxPrice:  searchParams.get("maxPrice")                   || "",
    startDate: searchParams.get("startDate")                  || "",
    endDate:   searchParams.get("endDate")                    || "",
    sort:      searchParams.get("sort")                       || "date_asc",
    search:    searchParams.get("search")                     || "",
  });

  const [filters, setFilters]     = useState<Filters>(initFilters);
  const [events, setEvents]       = useState<AppEvent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [view, setView]           = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(filters.search);
  const abortRef = useRef<AbortController | null>(null);

  /* ── Sync URL → filters when searchParams change externally (e.g. Navbar) ── */
  useEffect(() => {
    const newFilters = initFilters();
    setFilters(newFilters);
    setSearchInput(newFilters.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  /* ── Push filters → URL ── */
  const syncUrl = useCallback((f: Filters, pg: number) => {
    const params: Record<string, string> = {};
    if (f.category && f.category !== "ALL") params.category = f.category;
    if (f.minPrice)  params.minPrice  = f.minPrice;
    if (f.maxPrice)  params.maxPrice  = f.maxPrice;
    if (f.startDate) params.startDate = f.startDate;
    if (f.endDate)   params.endDate   = f.endDate;
    if (f.sort && f.sort !== "date_asc") params.sort = f.sort;
    if (f.search)    params.search    = f.search;
    if (pg > 0)      params.page      = String(pg);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  /* ── API call ── */
  const fetchEvents = useCallback(async (f: Filters, pg: number, append = false) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError(false);

      // Build API params — only send what backend needs
      const params: Record<string, string | number> = { page: pg, size: PAGE_SIZE };

      if (f.category && f.category !== "ALL") params.category = f.category;
      if (f.minPrice)  params.minPrice  = Number(f.minPrice);
      if (f.maxPrice)  params.maxPrice  = Number(f.maxPrice);

      // Backend expects LocalDateTime strings like 2024-01-01T00:00:00
      if (f.startDate) params.startDate = f.startDate.replace("T", "T").replace(/:\d{2}$/, ":00");
      if (f.endDate)   params.endDate   = f.endDate.replace("T", "T").replace(/:\d{2}$/, ":00");

      const res = await Axios({
        ...SummaryApi.search_events,
        params,
      });

      let content: AppEvent[] = [];
      let pages = 1;
      let total = 0;

      if (res.data?.data?.content) {
        content = res.data.data.content;
        pages   = res.data.data.totalPages   ?? 1;
        total   = res.data.data.totalElements ?? content.length;
      } else if (Array.isArray(res.data?.data)) {
        content = res.data.data;
        total   = content.length;
      } else if (Array.isArray(res.data)) {
        content = res.data;
        total   = content.length;
      }

      // Client-side sort (backend search doesn't sort)
      const sorted = clientSort(content, f.sort);

      // Client-side search filter (for title/venue since backend doesn't support text search)
      const finalList = f.search
        ? sorted.filter((e) =>
            e.title.toLowerCase().includes(f.search.toLowerCase()) ||
            (e.venue || "").toLowerCase().includes(f.search.toLowerCase()) ||
            (e.location || "").toLowerCase().includes(f.search.toLowerCase())
          )
        : sorted;

      setEvents((prev) => append ? [...prev, ...finalList] : finalList);
      setTotalPages(pages);
      setTotalElements(total);
      setPage(pg);
    } catch (err: unknown) {
      if ((err as Error)?.name !== "CanceledError") {
        setError(true);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const clientSort = (list: AppEvent[], sort: string) => {
    return [...list].sort((a, b) => {
      switch (sort) {
        case "price_asc":  return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "date_desc":  return new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
        default:           return new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime();
      }
    });
  };

  /* ── Fetch on filters change ── */
  useEffect(() => {
    fetchEvents(filters, 0, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /* ── Handlers ── */
  const handleFilterChange = (key: keyof Filters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    syncUrl(filters, 0);
    fetchEvents(filters, 0, false);
  };

  const handleReset = () => {
    const blank: Filters = { category: "ALL", minPrice: "", maxPrice: "", startDate: "", endDate: "", sort: "date_asc", search: "" };
    setFilters(blank);
    setSearchInput("");
    setSearchParams({}, { replace: true });
    fetchEvents(blank, 0, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    syncUrl(filters, nextPage);
    fetchEvents(filters, nextPage, true);
  };

  const handleEventClick = (event: AppEvent) => navigate(`/event/${event.id}`);

  const handleSearch = (q: string) => {
    const updated = { ...filters, search: q };
    setFilters(updated);
    syncUrl(updated, 0);
  };

  /* ── Derived state ── */
  const activeMeta  = CATEGORY_META[filters.category];
  const pageTitle   = filters.search
    ? `Results for "${filters.search}"`
    : filters.category !== "ALL"
      ? `${activeMeta?.emoji} ${activeMeta?.label}`
      : "All Events";

  const accentColor = activeMeta?.color || "#f97316";

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#f8f8fa]">
      <Navbar />

      {/* ── Page Hero Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accentColor}18 0%, #f8f8fa 60%)` }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: accentColor }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: accentColor }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 mb-2">
                <button
                  onClick={() => navigate("/")}
                  className="text-[11px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  Home
                </button>
                <span className="text-gray-300 text-[11px]">/</span>
                <span className="text-[11px] font-semibold text-gray-600">Events</span>
                {filters.category !== "ALL" && (
                  <>
                    <span className="text-gray-300 text-[11px]">/</span>
                    <span className="text-[11px] font-semibold" style={{ color: accentColor }}>
                      {activeMeta?.label}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {pageTitle}
              </h1>
              {!loading && (
                <p className="mt-1 text-sm text-gray-500 font-medium">
                  {totalElements > 0
                    ? `${totalElements.toLocaleString()} event${totalElements !== 1 ? "s" : ""} found`
                    : "No events match your filters"}
                </p>
              )}
            </div>

            {/* Inline search bar */}
            <div className="relative sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(searchInput);
                }}
                placeholder="Search events, venues…"
                className="w-full pl-8 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(""); handleSearch(""); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        onApply={handleApply}
        onReset={handleReset}
        resultCount={events.length}
        loading={loading}
      />

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">

        {/* View toggle + active filters summary */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Active filter pills */}
            {filters.category !== "ALL" && (
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: accentColor }}
              >
                {activeMeta?.emoji} {activeMeta?.label}
                <button onClick={() => { handleFilterChange("category", "ALL"); setTimeout(handleApply, 0); }}>
                  <X size={10} />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                💰 {filters.minPrice || "0"} – {filters.maxPrice || "∞"} LKR
                <button onClick={() => { handleFilterChange("minPrice", ""); handleFilterChange("maxPrice", ""); setTimeout(handleApply, 0); }}>
                  <X size={10} />
                </button>
              </span>
            )}
            {(filters.startDate || filters.endDate) && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                📅 Date filtered
                <button onClick={() => { handleFilterChange("startDate", ""); handleFilterChange("endDate", ""); setTimeout(handleApply, 0); }}>
                  <X size={10} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                🔍 "{filters.search}"
                <button onClick={() => { setSearchInput(""); handleSearch(""); }}>
                  <X size={10} />
                </button>
              </span>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className={view === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          }>
            {[...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">Something went wrong</p>
              <p className="text-gray-400 text-sm mt-1">Failed to load events. Please try again.</p>
            </div>
            <button
              onClick={() => fetchEvents(filters, 0, false)}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">🎭</div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg">No events found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 border-2 border-orange-500 text-orange-500 font-bold text-sm rounded-xl hover:bg-orange-500 hover:text-white transition-all"
            >
              <Filter size={14} />
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Events grid / list ── */}
        {!loading && !error && events.length > 0 && (
          <>
            <div className={
              view === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
            }>
              {events.map((e, i) => (
                <div
                  key={e.id}
                  style={{
                    animation: "cardFadeIn 0.35s ease-out both",
                    animationDelay: `${Math.min(i * 25, 400)}ms`,
                  }}
                >
                  <EventCard
                    event={e}
                    onClick={() => handleEventClick(e)}
                    size={view === "list" ? "md" : "md"}
                  />
                </div>
              ))}
            </div>

            {/* ── Load more button ── */}
            {page < totalPages - 1 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3.5 border-2 border-orange-500 text-orange-500 font-bold text-sm rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-orange-100"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Load More Events
                      <span className="text-[11px] opacity-70">
                        ({events.length} / {totalElements})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* End of results message */}
            {page >= totalPages - 1 && events.length > 0 && totalElements > PAGE_SIZE && (
              <div className="flex items-center justify-center mt-10 gap-3">
                <div className="h-px bg-gray-200 flex-1 max-w-24" />
                <span className="text-[11px] text-gray-400 font-semibold">All {totalElements} events shown</span>
                <div className="h-px bg-gray-200 flex-1 max-w-24" />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default EventsPage;