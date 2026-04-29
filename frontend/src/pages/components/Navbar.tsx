import { useState, useEffect, useRef } from "react";
import {
  Ticket,
  Search,
  X,
  Film,
  Drama,
  Trophy,
  Palmtree,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
  LogIn,
  UserPlus,
  Menu,
  ArrowRight,
} from "lucide-react";

/* ─── Static category data (replace with API fetch as needed) ─── */
const CATEGORIES_DATA: Record<string, string[]> = {
  EVENT: ["CONCERT","DINNER_DANCE","EDM","CLASSICAL","EDUCATIONAL","EXHIBITION","SEMINAR","CONFERENCE","TECH","FREE","ONLINE","DJ"],
  MOVIE: ["ACTION_MOVIE","ADVENTURE_MOVIE","ANIMATION","BIOGRAPHY","COMEDY_MOVIE","CRIME","DOCUMENTARY","DRAMA_MOVIE","FANTASY","HORROR","ROMANCE","SCIENCE_FICTION","THRILLER"],
  SPORT: ["CRICKET","RUGBY","FOOTBALL","MOTOR_SPORT","BASKETBALL","GOLF","BOXING","VOLLEYBALL"],
  FOOD: ["FOOD_FESTIVAL","TABLE_RESERVATION","RESTAURANT","PUB_AND_BAR","HOTELS"],
  HOLIDAY: ["AMUSEMENT_PARK","ADVENTURE_TRAVEL","SURFING","DIVING","WHALE_WATCHING","CAMPING","HIKING","NATIONAL_PARK"],
  OTHER: ["CULTURAL_FESTIVAL","E_VOUCHERS"],
};

const ICON_MAP: Record<string, React.ElementType> = {
  EVENT: Sparkles,
  MOVIE: Film,
  THEATRE: Drama,
  SPORT: Trophy,
  HOLIDAY: Palmtree,
  FOOD: UtensilsCrossed,
  OTHER: Ticket,
};

const COLOR_MAP: Record<string, string> = {
  EVENT: "#f97316",
  MOVIE: "#ef4444",
  THEATRE: "#a855f7",
  SPORT: "#22c55e",
  HOLIDAY: "#06b6d4",
  FOOD: "#eab308",
  OTHER: "#ec4899",
};

interface Category {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  sub: string[];
}

interface NavbarProps {
  activeCategory?: string;
  onCategory?: (key: string, sub?: string) => void;
  onSearch?: (q: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
}

function formatLabel(raw: string) {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Navbar({
  activeCategory = "ALL",
  onCategory,
  onSearch,
  isLoggedIn = false,
  userName = "",
}: NavbarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Build categories from static data (swap for API fetch) ─── */
  useEffect(() => {
    const mapped = Object.entries(CATEGORIES_DATA).map(([key, sub]) => ({
      key,
      label: formatLabel(key),
      icon: ICON_MAP[key] || Ticket,
      color: COLOR_MAP[key] || "#64748b",
      sub,
    }));
    setCategories(mapped);
  }, []);

  /* ─── Scroll shadow ─── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Lock body scroll when mobile drawer open ─── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ─── Focus search input ─── */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleCategory = (key: string, sub?: string) => {
    onCategory?.(key, sub);
    setMobileOpen(false);
    setOpenDropdown(null);
    setExpandedMobile(null);
  };

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(key);
  };
  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-2">

            {/* ── LOGO ── */}
            <a href="/" className="flex items-center gap-2 shrink-0 group">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500 group-hover:bg-orange-600 transition-colors duration-200">
                <Ticket size={16} className="text-white" />
              </span>
              <span className="font-black text-gray-900 text-lg tracking-tight hidden sm:block">
                My<span className="text-orange-500">Tickets</span>
              </span>
            </a>

            {/* ── DESKTOP CATEGORIES ── */}
            <div className="hidden lg:flex items-center gap-0.5 ml-4 flex-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;
                const isOpen = openDropdown === cat.key;

                return (
                  <div
                    key={cat.key}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(cat.key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => handleCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                        isActive
                          ? "text-orange-600 bg-orange-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      style={isActive ? { color: cat.color } : {}}
                    >
                      <Icon size={14} />
                      {cat.label}
                      {cat.sub.length > 0 && (
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {/* Dropdown */}
                    {cat.sub.length > 0 && (
                      <div
                        className={`absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-left ${
                          isOpen
                            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                        }`}
                        onMouseEnter={() => handleDropdownEnter(cat.key)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="p-1.5 max-h-72 overflow-y-auto">
                          {cat.sub.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleCategory(cat.key, s)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-100 flex items-center justify-between group/item"
                            >
                              <span>{formatLabel(s)}</span>
                              <ArrowRight
                                size={12}
                                className="opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0 duration-150"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── RIGHT ACTIONS ── */}
            <div className="ml-auto flex items-center gap-1">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen((p) => !p)}
                aria-label="Toggle search"
                className={`p-2 rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  searchOpen
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              {/* Auth */}
              {!isLoggedIn ? (
                <>
                  <a
                    href="/login"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-150"
                  >
                    <LogIn size={15} />
                    Login
                  </a>
                  <a
                    href="/register"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors duration-150"
                  >
                    <UserPlus size={15} />
                    Register
                  </a>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {userName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{userName}</span>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* ── SEARCH BAR (slide down) ── */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              searchOpen ? "max-h-16 opacity-100 pb-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                ref={searchRef}
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch?.(searchQ);
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search events, movies, sports…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-150"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE BACKDROP
      ══════════════════════════════════════════ */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <div
        className={`fixed top-0 right-0 h-full w-[88vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500">
              <Ticket size={14} className="text-white" />
            </span>
            <span className="font-black text-gray-900 tracking-tight">
              My<span className="text-orange-500">Tickets</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expandedMobile === cat.key;
            const isActive = activeCategory === cat.key;

            return (
              <div key={cat.key} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    if (cat.sub.length > 0) {
                      setExpandedMobile(isExpanded ? null : cat.key);
                    } else {
                      handleCategory(cat.key);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ background: `${cat.color}18` }}
                  >
                    <Icon size={15} style={{ color: cat.color }} />
                  </span>
                  <span className="flex-1 text-left">{cat.label}</span>
                  {cat.sub.length > 0 && (
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Subcategories — smooth height animation */}
                {cat.sub.length > 0 && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-4 pr-2 pb-2 space-y-0.5">
                      {cat.sub.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleCategory(cat.key, s)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-100 group/sub"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover/sub:scale-150"
                            style={{ background: cat.color }}
                          />
                          {formatLabel(s)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer — Auth */}
        <div className="px-4 pb-6 pt-3 border-t border-gray-100 space-y-2 shrink-0">
          {!isLoggedIn ? (
            <>
              <a
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150"
              >
                <LogIn size={15} />
                Login
              </a>
              <a
                href="/register"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors duration-150"
              >
                <UserPlus size={15} />
                Create Account
              </a>
            </>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {userName?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-400">Logged in</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer so page content clears the fixed navbar */}
      <div className="h-16" />
    </>
  );
}