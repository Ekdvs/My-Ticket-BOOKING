import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Home, ArrowLeft, Search, Compass } from "lucide-react";

const QUICK_LINKS = [
  { label: "Events",   path: "/events?category=EVENT",   emoji: "🎵" },
  { label: "Movies",   path: "/events?category=MOVIE",   emoji: "🎬" },
  { label: "Sports",   path: "/events?category=SPORT",   emoji: "🏆" },
  { label: "Theatre",  path: "/events?category=THEATRE", emoji: "🎭" },
];

export default function NotFound() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Floating particles on the canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const SYMBOLS = ["🎫", "🎟", "🎵", "🎬", "🏆", "🎭", "★", "✦"];
    const particles = Array.from({ length: 22 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      size: Math.random() * 16 + 10,
      opacity: Math.random() * 0.15 + 0.05,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    }));

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.symbol, p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -30)  p.y = canvas.height + 30;
        if (p.x < -30)  p.x = canvas.width  + 30;
        if (p.x > canvas.width + 30)  p.x = -30;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden flex flex-col">

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Navbar strip ── */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/5">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Ticket size={15} className="text-white" />
          </span>
          <span className="font-black text-white text-base tracking-tight hidden sm:block">
            My<span className="text-orange-400">Tickets</span>
          </span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      </nav>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">

        {/* Giant 404 */}
        <div className="relative select-none mb-6">
          <span
            className="text-[clamp(120px,20vw,220px)] font-black leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ef4444 40%, #ff6b35 70%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 60px rgba(249,115,22,0.25))",
            }}
          >
            404
          </span>
          {/* Floating ticket badge */}
          <div
            className="absolute -top-3 -right-3 sm:-right-6 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ animation: "floatBadge 3s ease-in-out infinite" }}
          >
            <Ticket size={22} className="text-white" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
          This ticket doesn't exist
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-sm mb-10 leading-relaxed">
          The page you're looking for has either been moved, removed, or never existed.
          Let's get you back to the show.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-14 w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold text-sm rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-900/30"
          >
            <Home size={15} />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/events")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm rounded-2xl transition-all active:scale-95"
          >
            <Compass size={15} />
            Browse Events
          </button>
        </div>

        {/* Quick links */}
        <div className="w-full max-w-md">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">
            Or jump straight to
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {QUICK_LINKS.map(({ label, path, emoji }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1.5 px-3 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/30 rounded-2xl transition-all group active:scale-95"
              >
                <span className="text-2xl leading-none">{emoji}</span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search hint */}
        <button
          onClick={() => navigate("/")}
          className="mt-10 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 hover:border-white/15 rounded-xl text-xs text-gray-500 hover:text-gray-300 transition-all"
        >
          <Search size={12} />
          Search for events on the homepage
        </button>
      </main>

      {/* ── Bottom bar ── */}
      <footer className="relative z-10 text-center pb-6">
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()}{" "}
          <span className="text-orange-500 font-semibold">MyTickets</span> · Sri Lanka's trusted ticket platform
        </p>
      </footer>

      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50%       { transform: translateY(-10px) rotate(4deg); }
        }
      `}</style>
    </div>
  );
}