import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

import { X, SlidersHorizontal } from "lucide-react";
import EventCard from "../components/Eventcard";
import EventSection from "../components/Eventsection";

const SECTIONS = [
  { cat: "EVENT",   label: "Events",   emoji: "🎵", color: "#f97316" },
  { cat: "MOVIE",   label: "Movies",   emoji: "🎬", color: "#ef4444" },
  { cat: "THEATRE", label: "Theatre",  emoji: "🎭", color: "#a855f7" },
  { cat: "SPORT",   label: "Sports",   emoji: "🏆", color: "#22c55e" },
  { cat: "HOLIDAY", label: "Holidays", emoji: "🌴", color: "#06b6d4" },
  { cat: "FOOD",    label: "Foods",    emoji: "🍽️", color: "#eab308" },
  { cat: "OTHER",   label: "Other",    emoji: "🎪", color: "#ec4899" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadMore, setLoadMore]     = useState(false);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortOpen, setSortOpen]             = useState(false);
  const [sort, setSort]                     = useState("date");

  const fetchEvents = useCallback(async (pg = 0, replace = true) => {
    try {
      replace ? setLoading(true) : setLoadMore(true);
      const res = await Axios({ ...SummaryApi.get_all_events, params: { page: pg, size: 50 } });
      let content = [];
      let pages = 1;
      if (res.data?.data?.content) { content = res.data.data.content; pages = res.data.data.totalPages ?? 1; }
      else if (Array.isArray(res.data?.data)) { content = res.data.data; }
      else if (Array.isArray(res.data)) { content = res.data; }
      setAllEvents((prev) => replace ? content : [...prev, ...content]);
      setTotalPages(pages);
      setPage(pg);
    } catch { setAllEvents([]); }
    finally { setLoading(false); setLoadMore(false); }
  }, []);

  useEffect(() => { fetchEvents(0, true); }, [fetchEvents]);

  const filtered = allEvents
    .filter((e) => {
      const matchCat = activeCategory === "ALL" || e.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchQ = !q || e.title.toLowerCase().includes(q) || (e.venue||"").toLowerCase().includes(q) || (e.location||"").toLowerCase().includes(q);
      return matchCat && matchQ;
    })
    .sort((a, b) => {
      if (sort === "price_asc")  return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime();
    });

  const byCategory = (cat) => allEvents.filter((e) => e.category === cat && e.active);
  const featured   = allEvents.filter((e) => e.active).slice(0, 10);
  const isFiltered = Boolean(searchQuery) || activeCategory !== "ALL";

  const handleEventClick = (event) => navigate(`/event/${event.id}`);
  const handleSearch = (q) => { setSearchQuery(q); if (q) setActiveCategory("ALL"); window.scrollTo({ top: 220, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-[#f8f8fa]">
      <Navbar
  activeCategory={activeCategory}
  onCategory={(key, sub) => {
    setActiveCategory(key);

    if (sub) {
      setSearchQuery(sub); // 🔥 subcategory triggers search
    } else {
      setSearchQuery("");
    }
  }}
  onSearch={handleSearch}
/>
      <main className="max-w-7xl mx-auto px-0 sm:px-4 pb-10">
        {!isFiltered && <Hero onSearch={handleSearch} />}
        {isFiltered && (
          <div className="px-4 sm:px-0 pt-6">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : SECTIONS.find((s) => s.cat === activeCategory)?.label ?? "Events"}
              </h2>
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{filtered.length}</span>
              <div className="relative ml-auto">
                <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:border-gray-300 shadow-sm transition-all">
                  <SlidersHorizontal size={13} />
                  {sort === "date" ? "Date" : sort === "price_asc" ? "Price ↑" : "Price ↓"}
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-1.5">
                    {[["date","By Date"],["price_asc","Price: Low→High"],["price_desc","Price: High→Low"]].map(([v, l]) => (
                      <button key={v} onClick={() => { setSort(v); setSortOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${sort === v ? "text-orange-600 bg-orange-50" : "text-gray-600 hover:bg-gray-50"}`}>{l}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"><X size={13} /> Clear</button>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {[...Array(10)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <span className="text-5xl">🎭</span>
                <p className="text-gray-600 font-bold">No events found</p>
                <p className="text-gray-400 text-xs">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {filtered.map((e, i) => (
                  <div key={e.id} style={{ animation: "cardFadeIn 0.35s ease-out both", animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                    <EventCard event={e} onClick={() => handleEventClick(e)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!isFiltered && (
          <div className="pt-2">
            <EventSection title="Featured Events" emoji="✨" accentColor="#f97316" events={featured} loading={loading} onEventClick={handleEventClick} />
            {SECTIONS.map(({ cat, label, emoji, color }) => (
              <EventSection key={cat} title={label} emoji={emoji} accentColor={color} events={byCategory(cat)} loading={loading} onEventClick={handleEventClick} onViewAll={() => setActiveCategory(cat)} />
            ))}
            {page < totalPages - 1 && (
              <div className="flex justify-center mt-4 mb-6">
                <button onClick={() => fetchEvents(page + 1, false)} disabled={loadMore} className="px-8 py-3 border-2 border-orange-500 text-orange-500 font-bold text-sm rounded-2xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50">
                  {loadMore ? "Loading…" : "Load More Events"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <style>{`
        @keyframes cardFadeIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeSlideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default HomePage;