import { useState, useEffect } from "react";
import { Search, Zap, TrendingUp, Star } from "lucide-react";

const ROTATING_WORDS = ["Concert", "Movie", "Theatre", "Sports", "Holiday", "Festival"];

const QUICK_SEARCHES = [
  { label: "🎵 Concerts",   q: "concert" },
  { label: "🎭 Theatre",    q: "theatre" },
  { label: "🏆 Sports",     q: "cricket" },
  { label: "🎬 Movies",     q: "movie"   },
  { label: "🌴 Holidays",   q: "safari"  },
];

const STATS = [
  { icon: Zap,        value: "500+",  label: "Events Live"   },
  { icon: TrendingUp, value: "50K+",  label: "Tickets Sold"  },
  { icon: Star,       value: "4.9",   label: "User Rating"   },
];

interface HeroProps {
  onSearch: (q: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [searchQ, setSearchQ]       = useState("");
  const [wordIdx, setWordIdx]       = useState(0);
  const [fadeWord, setFadeWord]     = useState(true);
  const [mounted, setMounted]       = useState(false);

  /* mount animation */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* rotating word */
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setFadeWord(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQ.trim()) onSearch(searchQ.trim());
  };

  return (
    <div className="relative overflow-hidden rounded-none sm:rounded-3xl mb-8 mx-0 sm:mx-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950" />

      {/* Mesh blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl translate-x-32 -translate-y-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl -translate-x-16 translate-y-16 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-5 sm:px-10 py-14 sm:py-20 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 mb-6
            transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-300 font-semibold tracking-wide">Sri Lanka's #1 Ticket Platform</span>
        </div>

        {/* Headline */}
        <h1
          className={`text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 tracking-tight
            transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          Book Your Next
          <span className="block mt-1">
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#f97316,#ef4444,#ec4899)" }}
            >
              <span
                className="inline-block transition-all duration-300"
                style={{ opacity: fadeWord ? 1 : 0, transform: fadeWord ? "translateY(0)" : "translateY(-8px)" }}
              >
                {ROTATING_WORDS[wordIdx]}
              </span>
            </span>
            {" "}Experience
          </span>
        </h1>

        <p
          className={`text-sm sm:text-base text-gray-400 mb-8 max-w-md mx-auto
            transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          Discover entertainment events across Sri Lanka — concerts, theatre, sports, holidays & more.
        </p>

        {/* Search bar */}
        <div
          className={`flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl max-w-xl mx-auto mb-5
            transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
        >
          <Search size={18} className="text-gray-400 ml-2 shrink-0" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by Artist, Event or Venue…"
            className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none py-1.5 bg-transparent"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-5 py-2.5
              rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-200 shrink-0"
          >
            Search
          </button>
        </div>

        {/* Quick searches */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 mb-10
            transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="text-xs text-gray-600 font-medium">Popular:</span>
          {QUICK_SEARCHES.map(({ label, q }) => (
            <button
              key={q}
              onClick={() => onSearch(q)}
              className="text-xs text-gray-400 bg-white/6 border border-white/10 px-3 py-1.5 rounded-full
                hover:bg-white/12 hover:text-white hover:border-white/20 transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div
          className={`flex items-center justify-center gap-6 sm:gap-10
            transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Icon size={13} className="text-orange-400" />
                <p className="text-xl font-black text-white">{value}</p>
              </div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;