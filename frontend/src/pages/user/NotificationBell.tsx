// components/NotificationBell.tsx
import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface Props {
  role: "ADMIN" | "ORGANIZER" | "USER";
}

const NotificationBell = ({ role }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const url =
        role === "ADMIN"
          ? SummaryApi.admin_notifications.url
          : SummaryApi.my_notifications.url;

      const countUrl =
        role === "ADMIN"
          ? SummaryApi.admin_unread_count.url
          : SummaryApi.my_unread_count.url;

      const [nRes, cRes] = await Promise.all([
        Axios.get(url),
        Axios.get(countUrl),
      ]);

      setNotifications(nRes.data.data || []);
      setUnread(cRes.data.data?.count || 0);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [role]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id: string) => {
    await Axios.patch(SummaryApi.mark_notification_read(id).url);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const typeIcon: Record<string, string> = {
    BOOKING_PAID: "💳",
    WITHDRAW_REQUEST: "💰",
    WITHDRAW_APPROVED: "✅",
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition"
      >
        <Bell size={20} className="text-slate-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              {unread > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && markRead(n.id)}
                    className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition ${
                      !n.read ? "bg-indigo-50/60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">
                        {typeIcon[n.type] || "🔔"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;