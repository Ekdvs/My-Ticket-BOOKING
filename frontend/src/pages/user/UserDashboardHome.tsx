import { useEffect, useState } from "react";
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Activity,
  Star,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

/* ── Types matching your actual API response ── */
interface Booking {
  id: string;
  bookingId: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  paymentId: string;
  paymentStatus: "SUCCESS" | "PENDING" | "FAILED";
  ticketStatus: "ISSUED" | "USED" | "CANCELLED" | "PENDING";
  ticketUsed: boolean;
  ticketUrl: string;
  createdAt: string | null;
  scannedAt: string | null;
  scannedBy: string | null;
}

interface Summary {
  total: number;
  issued: number;
  used: number;
  cancelled: number;
}

interface Props {
  user?: any;
  onNavigate?: (section: string) => void;
}

/* ── Status configs mapped to your ticketStatus / paymentStatus fields ── */
const ticketStatusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  ISSUED:    { label: "Issued",    color: "text-indigo-600",  bg: "bg-indigo-50",  icon: Ticket      },
  USED:      { label: "Used",      color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "text-red-500",     bg: "bg-red-50",     icon: AlertCircle },
  PENDING:   { label: "Pending",   color: "text-amber-600",   bg: "bg-amber-50",   icon: Clock       },
};

const paymentStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  SUCCESS: { label: "Paid",    color: "text-emerald-700", bg: "bg-emerald-50" },
  PENDING: { label: "Pending", color: "text-amber-700",   bg: "bg-amber-50"   },
  FAILED:  { label: "Failed",  color: "text-red-600",     bg: "bg-red-50"     },
};

/* ── Format currency ── */
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(price);

/* ── Stat Card ── */
const StatCard = ({
  label, value, icon: Icon, color, bg, delay,
}: {
  label: string; value: number; icon: any; color: string; bg: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={22} className={color} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{label}</p>
      <p className="text-2xl font-black text-slate-800 mt-0.5">{value}</p>
    </div>
  </motion.div>
);

export default function UserDashboardHome({ user, onNavigate }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary,  setSummary]  = useState<Summary>({ total: 0, issued: 0, used: 0, cancelled: 0 });
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios({
          method: SummaryApi.get_my_tickets.method,
          url:    SummaryApi.get_my_tickets.url,
        });

        if (res.data.success) {
          const data: Booking[] = res.data.data || [];

          setSummary({
            total:     data.length,
            issued:    data.filter((b) => b.ticketStatus === "ISSUED").length,
            used:      data.filter((b) => b.ticketUsed || b.ticketStatus === "USED").length,
            cancelled: data.filter((b) => b.ticketStatus === "CANCELLED").length,
          });

          // Sort newest first (null createdAt goes last)
          const sorted = [...data].sort((a, b) => {
            if (!a.createdAt && !b.createdAt) return 0;
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setBookings(sorted.slice(0, 5));
        }
      } catch {
        // silently fail — stats remain 0
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Total Bookings", value: summary.total,     icon: Ticket,       color: "text-indigo-600",  bg: "bg-indigo-50",  delay: 0.1  },
    { label: "Issued",         value: summary.issued,    icon: Activity,     color: "text-violet-600",  bg: "bg-violet-50",  delay: 0.15 },
    { label: "Used",           value: summary.used,      icon: CheckCircle,  color: "text-emerald-600", bg: "bg-emerald-50", delay: 0.2  },
    { label: "Cancelled",      value: summary.cancelled, icon: AlertCircle,  color: "text-red-500",     bg: "bg-red-50",     delay: 0.25 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-semibold mb-1">Good day 👋</p>
          <h1 className="text-2xl font-black text-white mb-1">
            Welcome back{user ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-indigo-200 text-sm">
            Here's an overview of your ticket booking activity.
          </p>
        </div>

        {/* Mini stats bar */}
        <div className="relative z-10 mt-5 flex flex-wrap gap-6">
          {[
            { label: "Total Bookings", value: summary.total    },
            { label: "Issued",         value: summary.issued   },
            { label: "Used",           value: summary.used     },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-white font-black text-xl">{value}</span>
              <span className="text-indigo-200 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Recent Bookings + Quick Tips ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              <h2 className="font-bold text-slate-800 text-sm">Recent Bookings</h2>
            </div>
            <button
              onClick={() => onNavigate?.("tickets")}
              className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                <Ticket size={22} className="text-indigo-400" />
              </div>
              <p className="text-slate-700 font-semibold text-sm">No bookings yet</p>
              <p className="text-slate-400 text-xs mt-1">Your ticket bookings will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 px-2 pb-3">
              {bookings.map((booking, i) => {
                const ticketCfg  = ticketStatusConfig[booking.ticketStatus]   ?? ticketStatusConfig.PENDING;
                const paymentCfg = paymentStatusConfig[booking.paymentStatus] ?? paymentStatusConfig.PENDING;
                const TicketIcon = ticketCfg.icon;

                return (
                  <motion.li
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg ${ticketCfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <TicketIcon size={16} className={ticketCfg.color} />
                    </div>

                    {/* Booking info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Hash size={10} className="text-slate-300 flex-shrink-0" />
                        <p className="text-xs font-mono font-bold text-slate-600 truncate">
                          {booking.bookingId.slice(0, 20)}…
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">
                          Qty: <span className="font-bold text-slate-600">{booking.quantity}</span>
                        </span>
                        <span className="text-slate-200">·</span>
                        <span className="text-xs font-bold text-slate-700">
                          {formatPrice(booking.totalPrice)}
                        </span>
                        {booking.createdAt && (
                          <>
                            <span className="text-slate-200">·</span>
                            <span className="text-xs text-slate-400">
                              {new Date(booking.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticketCfg.bg} ${ticketCfg.color}`}>
                        {ticketCfg.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paymentCfg.bg} ${paymentCfg.color}`}>
                        {paymentCfg.label}
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>

        {/* Quick Tips Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <Star size={16} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Quick Tips</h2>
          </div>

          {[
            {
              title: "Book Tickets",
              desc: "Browse events and book your tickets. Each booking gets a unique QR code for entry.",
              color: "bg-indigo-50",
              textColor: "text-indigo-700",
            },
            {
              title: "Track Bookings",
              desc: "Check 'My Tickets' to view status, download tickets, or manage bookings.",
              color: "bg-violet-50",
              textColor: "text-violet-700",
            },
            {
              title: "Account Security",
              desc: "Keep your password updated regularly from the Settings section.",
              color: "bg-emerald-50",
              textColor: "text-emerald-700",
            },
          ].map(({ title, desc, color, textColor }) => (
            <div key={title} className={`${color} rounded-xl p-3.5`}>
              <p className={`text-xs font-bold ${textColor} mb-0.5`}>{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}

          {/* Satisfaction widget */}
          <div className="mt-auto pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2 text-center">Rate your experience</p>
            <div className="flex justify-center gap-2">
              {["😞", "😐", "😊", "😍"].map((emoji) => (
                <button key={emoji} className="text-xl hover:scale-125 transition-transform active:scale-110">
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}