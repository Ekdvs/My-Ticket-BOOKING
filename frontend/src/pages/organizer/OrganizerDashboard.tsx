import {
  Calendar, LogOut, Menu, User, X, LayoutGrid,
  Users2, PlusCircle, Home,
  QrCode,
  Wallet2,
  BarChart3,
  CreditCard,
  Settings
} from "lucide-react";
import { cacheSignal, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import EventForm from "../admin/EventForm";
import QrScannerPremium from "../components/QrScannerPremium";
import OrganizerEventCards from "./OrganizerEventCards";
import OrganizerDashboardHome from "./OrganizerDashboardHome";
import OrganizerWallet from "./OrganizerWallet";
import OrganizerAnalytics from "./OrganizerAnalytics";
import OrganizerWithdraw from "./OrganizerWithdraw";
import OrganizerNotificationBell from "./OrganizerNotificationBell"; // ✅ ADD THIS
import Setting from "../user/Setting";
import Profile from "../user/Profile";
import OraganizerEventCalendar from "./OraganizerEventCalander";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "events", label: "All Events", icon: LayoutGrid },
  { key: "addevent", label: "Add Event", icon: PlusCircle },
  { key: "eventcalendar", label: "Event Calendar", icon: Calendar },
  { key: "qr", label: "Qr Scan", icon: QrCode },
  { key: "wallet", label: "Wallet", icon: Wallet2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "withdrawal", label: "Withdrawals", icon: CreditCard },
  { key: "profile",   label: "Profile",     icon: User },
  { key: "settings",  label: "Settings",    icon: Settings },
];

const OrganizerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) { navigate("/login"); return; }
      try {
        const res = await Axios({
          method: SummaryApi.login_user.method,
          url: SummaryApi.login_user.url,
          withCredentials: true,
        });
        if (res.data.success) {
          if (res.data.data.role !== "ORGANIZER") navigate("/login");
          setUser(res.data.data);
        } else {
          toast.error("Failed to load admin user");
        }
      } catch {
        toast.error("Server error");
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await Axios({
        method: SummaryApi.logout.method,
        url: SummaryApi.logout.url,
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.clear();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <OrganizerDashboardHome />;
      case "events": return <OrganizerEventCards />;
      case "addevent": return <EventForm />;
      case "qr": return <QrScannerPremium />;
      case "wallet": return <OrganizerWallet />;
      case "analytics": return <OrganizerAnalytics />;
      case "withdrawal": return <OrganizerWithdraw />;
      case "profile": return <Profile user={user} />;
      case "settings": return <Setting user={user} />;
      case "eventcalendar": return <OraganizerEventCalendar />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-50 mt-[64px] overflow-hidden">

      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white shadow-sm border-b border-slate-100 flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="font-bold text-slate-800">Organizer Dashboard</h2>

        {/* ✅ Bell + avatar */}
        <div className="flex items-center gap-2">
          <OrganizerNotificationBell />
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
            <User size={16} className="text-violet-600" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <motion.aside
        initial={false}
        className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100"
      >
        <SidebarContent
          user={user}
          activeSection={activeSection}
          onSelect={(key: string) => { setActiveSection(key); setSidebarOpen(false); }}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
          isMobile={false}
        />
      </motion.aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed z-50 w-64 h-full bg-white border-r border-slate-100 md:hidden"
          >
            <SidebarContent
              user={user}
              activeSection={activeSection}
              onSelect={(key: string) => { setActiveSection(key); setSidebarOpen(false); }}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
              isMobile
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-full">
        <div className="p-4 md:p-6 mt-12 md:mt-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

/* ───────── Sidebar ───────── */
const SidebarContent = ({
  user, activeSection, onSelect, onLogout, onClose, isMobile
}: any) => (
  <div className="flex flex-col h-full p-5">

    {/* Top */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-lg font-black text-slate-900">Organizer Panel</h1>
        <p className="text-xs text-indigo-500 font-semibold">
          {sidebarItems.find(item => item.key === activeSection)?.label}
        </p>
      </div>

      {/* ✅ Bell + close button */}
      <div className="flex items-center gap-1">
        <OrganizerNotificationBell />
        {isMobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <X size={18} className="text-slate-600" />
          </button>
        )}
      </div>
    </div>

    {/* User */}
    {user && (
      <div className="flex items-center gap-3 px-3 py-3 bg-indigo-50 rounded-xl mb-6 border border-indigo-100">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-200 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-indigo-700" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
          <p className="text-[10px] text-indigo-500 uppercase tracking-wide">{user.role}</p>
        </div>
      </div>
    )}

    {/* Menu */}
    <nav className="flex-1 space-y-1">
      {sidebarItems.map(({ key, label, icon: Icon }) => {
        const isActive = activeSection === key;
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelect(key)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative
              ${isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeIndicator"
                className="absolute left-0 top-0 h-full w-1 bg-white/80 rounded-r"
              />
            )}
            <motion.div animate={{ rotate: isActive ? 360 : 0 }} transition={{ duration: 0.4 }}>
              <Icon size={17} />
            </motion.div>
            {label}
          </motion.button>
        );
      })}
    </nav>

    {/* Logout */}
    <motion.button
      whileHover={{ scale: 1.03 }}
      onClick={onLogout}
      className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 mt-4 transition"
    >
      <LogOut size={17} />
      Logout
    </motion.button>
  </div>
);

export default OrganizerDashboard;