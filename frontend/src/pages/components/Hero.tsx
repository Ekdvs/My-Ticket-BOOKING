import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMusic, FaFilm, FaTrophy, FaTheaterMasks, FaTree , FaUtensils,
  FaBolt,  FaStar, FaTicketAlt, FaSearch, FaChevronLeft,
  FaChevronRight,  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";

/* ─────────────────────────────── types ─────────────────────────────── */
interface HeroProps {
  onSearch: (q: string) => void;
  onCategory?: (cat: string) => void;
}

/* ─────────────────────────────── data ──────────────────────────────── */
const ROTATING_WORDS = ["Concert", "Movie", "Theatre", "Sport", "Holiday", "Festival"];

const QUICK_TAGS = [
  { label: "Concerts",  q: "concert",  icon: FaMusic       },
  { label: "Movies",    q: "movie",    icon: FaFilm        },
  { label: "Sports",    q: "cricket",  icon: FaTrophy      },
  { label: "Theatre",   q: "theatre",  icon: FaTheaterMasks},
  { label: "Holidays",  q: "safari",   icon: FaTree        },
];

const EVENT_CARDS = [
  { emoji: "🎵", icon: FaMusic,        title: "Live Concert",   sub: "Colombo Arena",   grad: "from-orange-500 to-orange-700" },
  { emoji: "🎬", icon: FaFilm,         title: "New Releases",   sub: "12 cinemas",      grad: "from-red-500 to-red-700"    },
  { emoji: "🏆", icon: FaTrophy,       title: "Cricket Finals", sub: "R. Premadasa",    grad: "from-green-500 to-green-700" },
  { emoji: "🌴", icon: FaTree,         title: "Beach Holiday",  sub: "Mirissa, SL",     grad: "from-purple-500 to-purple-700"},
];

const CATS = [
  { label: "Events",   cat: "EVENT",   icon: FaBolt          },
  { label: "Movies",   cat: "MOVIE",   icon: FaFilm          },
  { label: "Sports",   cat: "SPORT",   icon: FaTrophy        },
  { label: "Theatre",  cat: "THEATRE", icon: FaTheaterMasks  },
  { label: "Holidays", cat: "HOLIDAY", icon: FaTree          },
  { label: "Food",     cat: "FOOD",    icon: FaUtensils      },
];

const STATS = [
  { value: "500+", label: "Events Live",  icon: FaBolt   },
  { value: "50K+", label: "Tickets Sold", icon: FaTicketAlt },
  { value: "4.9",  label: "User Rating",  icon: FaStar   },
];

const TOTAL = 3;
const AUTO_MS = 5500;

/* ═══════════════════════════════════════════════════════════════════════
   HERO 1 — CINEMATIC DARK
═══════════════════════════════════════════════════════════════════════ */
function Hero1({ onSearch, active }: HeroProps & { active: boolean }) {
  const [searchQ,  setSearchQ]  = useState("");
  const [wordIdx,  setWordIdx]  = useState(0);
  const [fadeWord, setFadeWord] = useState(true);
  const [vis,      setVis]      = useState(false);

  useEffect(() => {
    if (active) { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }
    else setVis(false);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % ROTATING_WORDS.length); setFadeWord(true); }, 300);
    }, 2200);
    return () => clearInterval(id);
  }, [active]);

  const go = () => { if (searchQ.trim()) onSearch(searchQ.trim()); };

  const cls = () =>
    `transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-5 py-20 sm:py-28 overflow-hidden min-h-[520px]">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#0d0600] to-orange-950/60" />
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.6) 40px)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(249,115,22,.35),transparent 70%)", animation: "orbPulse 4s ease-in-out infinite" }} />
      <div className="absolute bottom-0 left-1/4 w-56 h-44 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(239,68,68,.2),transparent 70%)", animation: "orbPulse 5s ease-in-out infinite reverse" }} />

      {/* Badge */}
      <div className={`${cls()} relative z-10 inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5 mb-5`}
        style={{ transitionDelay: "0ms" }}>
        <MdLiveTv className="text-green-400 text-sm" />
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-orange-400">Sri Lanka's #1 Ticket Platform</span>
      </div>

      {/* Title */}
      <h1 className={`${cls()} relative z-10 text-white leading-none mb-4`}
        style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(70px,13vw,130px)", letterSpacing: "0.02em", transitionDelay: "80ms" }}>
        BOOK THE
        <span className="block" style={{
          background: "linear-gradient(135deg,#f97316,#ef4444,#fbbf24)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          opacity: fadeWord ? 1 : 0, transform: fadeWord ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity .3s, transform .3s",
        }}>
          {ROTATING_WORDS[wordIdx]}
        </span>
      </h1>

      <p className={`${cls()} relative z-10 text-gray-400 text-sm max-w-sm mb-8 leading-relaxed`} style={{ transitionDelay: "160ms" }}>
        Concerts, theatre, sports, holidays — every live moment in one place across Sri Lanka.
      </p>

      {/* Search */}
      <div className={`${cls()} relative z-10 flex gap-2 w-full max-w-[500px]`} style={{ transitionDelay: "240ms" }}>
        <div className="flex-1 flex items-center gap-2 bg-white/7 border border-white/12 rounded-xl px-4">
          <FaSearch className="text-white/30 text-xs shrink-0" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
            placeholder="Artist, event or venue…"
            className="flex-1 bg-transparent py-3 text-sm text-white placeholder-white/30 outline-none" />
        </div>
        <button onClick={go}
          className="shrink-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all active:scale-95">
          Search
        </button>
      </div>

      {/* Tags */}
      <div className={`${cls()} relative z-10 flex flex-wrap justify-center gap-2 mt-5`} style={{ transitionDelay: "320ms" }}>
        <span className="text-[11px] text-gray-600 font-medium">Popular:</span>
        {QUICK_TAGS.map(({ label, q, icon: Icon }) => (
          <button key={q} onClick={() => onSearch(q)}
            className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-400 transition-all">
            <Icon className="text-[10px]" />{label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={`${cls()} relative z-10 flex gap-10 mt-10`} style={{ transitionDelay: "400ms" }}>
        {STATS.map(({ value, label, icon: Icon }) => (
          <div key={label} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon className="text-orange-400 text-sm" />
              <p style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 32, background: "linear-gradient(135deg,#f97316,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>{value}</p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO 2 — EDITORIAL SPLIT
═══════════════════════════════════════════════════════════════════════ */
function Hero2({  active, onCategory }: HeroProps & { active: boolean }) {
  const navigate = useNavigate();
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (active) { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }
    else setVis(false);
  }, [active]);

  return (
    <div className="relative overflow-hidden grid md:grid-cols-2" style={{ minHeight: 460 }}>
      {/* LEFT */}
      <div className="bg-[#fff8f4] flex flex-col justify-center px-8 sm:px-14 py-16">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4 flex items-center gap-2 transition-all duration-700 ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          style={{ transitionDelay: "0ms" }}>
          <FaTicketAlt /> Sri Lanka's Ticket Platform
        </p>
        <h1 className={`text-4xl sm:text-5xl font-black leading-[1.05] text-gray-950 mb-5 transition-all duration-700 ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          style={{ fontFamily: "'Playfair Display',Georgia,serif", transitionDelay: "80ms" }}>
          Your next<br />
          <em className="not-italic text-orange-500">unforgettable</em><br />
          experience awaits
        </h1>
        <p className={`text-sm text-gray-500 leading-relaxed max-w-xs mb-8 transition-all duration-700 ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          style={{ transitionDelay: "160ms" }}>
          Discover and book live events across Sri Lanka — from sold-out concerts to weekend getaways.
        </p>
        <div className={`flex flex-wrap gap-3 transition-all duration-700 ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          style={{ transitionDelay: "240ms" }}>
          <button onClick={() => navigate("/events")}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors active:scale-95">
            <FaBolt /> Explore Events
          </button>
          <button onClick={() => navigate("/events?category=MOVIE")}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 hover:border-orange-400 hover:text-orange-500 text-gray-700 font-semibold text-sm rounded-xl transition-colors">
            <FaFilm /> Browse Movies
          </button>
        </div>
        <div className={`flex gap-8 mt-10 transition-all duration-700 ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          style={{ transitionDelay: "320ms" }}>
          {[["500+","Events"],["50K+","Sold"],["4.9★","Rating"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>{v}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative bg-gradient-to-br from-[#0f0a08] via-[#160c04] to-[#1a0d00] flex items-center justify-center p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs relative z-10">
          {EVENT_CARDS.map(({ title, sub, grad, icon: Icon }, i) => (
            <div key={title}
              className={`bg-gradient-to-br ${grad} rounded-2xl p-4 cursor-pointer hover:scale-105 active:scale-100 transition-all duration-700 ${vis ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"}`}
              style={{ transitionDelay: `${200 + i * 90}ms` }}
              onClick={() => onCategory?.(title)}>
              <Icon className="text-white/80 text-xl mb-2" />
              <p className="text-white font-bold text-xs leading-tight">{title}</p>
              <p className="text-white/60 text-[10px] mt-1 flex items-center gap-1">
                <FaMapMarkerAlt className="text-[8px]" />{sub}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
          <MdLiveTv className="text-green-400 text-sm" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Live</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO 3 — NEON ELECTRIC
═══════════════════════════════════════════════════════════════════════ */
function Hero3({ onSearch, onCategory, active }: HeroProps & { active: boolean }) {
  const [searchQ, setSearchQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [vis, setVis]         = useState(false);

  useEffect(() => {
    if (active) { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }
    else setVis(false);
  }, [active]);

  const go = () => { if (searchQ.trim()) onSearch(searchQ.trim()); };

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-5 py-20 sm:py-28 overflow-hidden" style={{ minHeight: 520, background: "#050508" }}>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(249,115,22,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.07) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)",
      }} />
      {/* Rings */}
      {[280, 460, 640].map((s, i) => (
        <div key={s} className="absolute rounded-full border border-orange-500/15 pointer-events-none"
          style={{ width: s, height: s, animation: `ringPulse 4s ${i * 0.7}s ease-in-out infinite` }} />
      ))}
      <div className="absolute pointer-events-none" style={{
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 440, height: 200,
        background: "radial-gradient(ellipse,rgba(249,115,22,.18),transparent 70%)",
        animation: "glowPulse 3s ease-in-out infinite",
      }} />

      {/* Tag */}
      <div className={`relative z-10 inline-flex items-center gap-2 rounded-md px-4 py-1.5 mb-6 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.25)", transitionDelay: "0ms" }}>
        <FaBolt className="text-orange-400 text-xs" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400" style={{ fontFamily: "'Syne',sans-serif" }}>
          Live Now — 500+ Events
        </span>
      </div>

      {/* Title */}
      <h1 className={`relative z-10 leading-none mb-3 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(48px,10vw,96px)", fontWeight: 900, letterSpacing: "-2px", transitionDelay: "80ms" }}>
        <span className="block" style={{ WebkitTextStroke: "2px rgba(249,115,22,.6)", color: "transparent" }}>FIND YOUR</span>
        <span className="block" style={{ color: "#f97316" }}>MOMENT</span>
      </h1>

      <p className={`relative z-10 text-sm leading-relaxed max-w-sm mb-8 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ color: "rgba(255,255,255,.4)", transitionDelay: "160ms" }}>
        Sri Lanka's most electric ticket platform. Book concerts, sports, theatre and holidays instantly.
      </p>

      {/* Search */}
      <div className={`relative z-10 flex w-full max-w-[480px] overflow-hidden transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{
          background: "rgba(255,255,255,.04)",
          border: `1px solid ${focused ? "rgba(249,115,22,.6)" : "rgba(249,115,22,.22)"}`,
          borderRadius: 14,
          boxShadow: focused ? "0 0 0 3px rgba(249,115,22,.1),0 0 28px rgba(249,115,22,.18)" : "none",
          transition: "border-color .3s,box-shadow .3s,opacity .7s,transform .7s",
          transitionDelay: "240ms",
        }}>
        <div className="flex items-center gap-2 px-4 flex-1">
          <FaSearch className="text-orange-400/50 text-xs shrink-0" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Search artists, venues, events…"
            className="flex-1 bg-transparent border-none outline-none py-3.5 text-sm text-white placeholder-white/25" />
        </div>
        <button onClick={go}
          className="shrink-0 px-5 py-3.5 font-black text-[11px] tracking-[0.12em] text-white active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", fontFamily: "'Syne',sans-serif" }}>
          SEARCH
        </button>
      </div>

      {/* Categories */}
      <div className={`relative z-10 flex flex-wrap justify-center gap-2 mt-5 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ transitionDelay: "320ms" }}>
        {CATS.map(({ label, cat, icon: Icon }) => (
          <button key={cat} onClick={() => onCategory?.(cat)}
            className="flex items-center gap-1.5 text-[11px] px-3.5 py-1.5 rounded-lg transition-all active:scale-95 group"
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.45)" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background="rgba(249,115,22,.1)"; b.style.borderColor="rgba(249,115,22,.4)"; b.style.color="#fb923c"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background="rgba(255,255,255,.04)"; b.style.borderColor="rgba(255,255,255,.08)"; b.style.color="rgba(255,255,255,.45)"; }}>
            <Icon className="text-[10px]" />{label}
          </button>
        ))}
      </div>

      {/* Counters */}
      <div className={`relative z-10 flex gap-10 mt-10 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ transitionDelay: "400ms" }}>
        {[["500+","Events",FaBolt],["50K+","Tickets Sold",FaTicketAlt],["4.9★","Rating",FaStar]].map(([val, lbl, Icon]: any) => (
          <div key={lbl} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon className="text-orange-500 text-xs" />
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 900, color: "#f97316", lineHeight: 1 }}>{val}</p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,.3)" }}>{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO CAROUSEL — main export
═══════════════════════════════════════════════════════════════════════ */
export default function Hero({ onSearch, onCategory }: HeroProps) {
  const [current,   setCurrent]   = useState(0);
  const [sliding,   setSliding]   = useState(false);
  const [direction, setDirection] = useState<"left"|"right">("right");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number, dir: "left"|"right" = "right") => {
    if (sliding) return;
    setSliding(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(next);
      setSliding(false);
    }, 480);
  }, [sliding]);

  const prev = () => goTo((current - 1 + TOTAL) % TOTAL, "left");
  const next = useCallback(() => goTo((current + 1) % TOTAL, "right"), [current, goTo]);

  /* auto-play */
  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTO_MS);
  };

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };
  const handleDot  = (i: number) => { goTo(i, i > current ? "right" : "left"); resetTimer(); };

  const slideClass = sliding
    ? direction === "right"
      ? "opacity-0 -translate-x-8 scale-[0.98]"
      : "opacity-0 translate-x-8 scale-[0.98]"
    : "opacity-100 translate-x-0 scale-100";

  return (
    <div className="relative overflow-hidden rounded-none sm:rounded-3xl mb-8 select-none">
      {/* SLIDE WRAPPER */}
      <div className={`transition-all duration-500 ease-in-out ${slideClass}`}>
        {current === 0 && <Hero1 onSearch={onSearch} onCategory={onCategory} active={!sliding} />}
        {current === 1 && <Hero2 onSearch={onSearch} onCategory={onCategory} active={!sliding} />}
        {current === 2 && <Hero3 onSearch={onSearch} onCategory={onCategory} active={!sliding} />}
      </div>

      {/* NAV ARROWS */}
      <button onClick={handlePrev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 border border-white/15 text-white backdrop-blur-sm transition-all active:scale-90">
        <FaChevronLeft className="text-sm" />
      </button>
      <button onClick={handleNext}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 border border-white/15 text-white backdrop-blur-sm transition-all active:scale-90">
        <FaChevronRight className="text-sm" />
      </button>

      {/* DOTS + PROGRESS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => handleDot(i)} className="relative group">
              {i === current ? (
                <div className="w-7 h-2 rounded-full bg-orange-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 rounded-full"
                    style={{ animation: `slideProgress ${AUTO_MS}ms linear forwards`, transformOrigin: "left" }} />
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-colors" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
          {[
            { label: "Cinematic" },
            { label: "Editorial" },
            { label: "Electric"  },
          ].map(({ label }, i) => (
            <button key={i} onClick={() => handleDot(i)}
              className={`text-[10px] font-semibold tracking-wide transition-colors px-1 ${i === current ? "text-orange-400" : "text-white/30 hover:text-white/60"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* SLIDE LABEL (top-right) */}
      <div className="absolute top-4 right-14 sm:right-16 z-30 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
        <span className="text-[10px] font-bold text-white/50">{current + 1} / {TOTAL}</span>
      </div>

      {/* FONTS + KEYFRAMES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@700;900&family=Syne:wght@700;800;900&display=swap');
        @keyframes orbPulse {
          0%,100% { opacity:.7; transform:translateX(-50%) scale(1);   }
          50%      { opacity:1;  transform:translateX(-50%) scale(1.1); }
        }
        @keyframes ringPulse {
          0%,100% { opacity:.3; transform:scale(1);    }
          50%      { opacity:.7; transform:scale(1.04); }
        }
        @keyframes glowPulse {
          0%,100% { opacity:.6; }
          50%      { opacity:1;  }
        }
        @keyframes slideProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}