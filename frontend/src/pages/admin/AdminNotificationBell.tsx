"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const AdminNotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        method:SummaryApi.admin_notifications.method,
        url:SummaryApi.admin_notifications.url,
      });
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Notification fetch error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const res = await Axios({
        method:SummaryApi.admin_unread_count.method,
        url:SummaryApi.admin_unread_count.url,
      });
      if (res.data.success) {
        setUnreadCount(res.data.data.count);
      }
    } catch (err) {
      console.error("Unread count error");
    }
  };

  // 🔹 Mark as read
  const markAsRead = async (id: string) => {
    try {
      await Axios({
        method:SummaryApi.mark_notification_read(id).method,
        url:SummaryApi.mark_notification_read(id).url,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error("Mark read failed");
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // 🔹 Auto refresh unread count
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-slate-100 relative"
      >
        <Bell className="w-5 h-5 text-slate-600" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border z-50 max-h-96 overflow-y-auto">

          <div className="p-3 border-b font-semibold flex justify-between">
            <span>Notifications</span>
            <button
              onClick={fetchNotifications}
              className="text-xs text-indigo-500"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="p-4 text-sm text-gray-400">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 border-b cursor-pointer transition ${
                  !n.read ? "bg-indigo-50" : "hover:bg-slate-50"
                }`}
              >
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-gray-500">{n.message}</p>

                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell;