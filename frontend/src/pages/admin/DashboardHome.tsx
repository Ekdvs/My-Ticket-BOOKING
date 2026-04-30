import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import {
   Ticket,  ScanLine,
  LayoutGrid, PlusCircle, Calendar, Users2,
  TrendingUp, ArrowRight,
  Coins
} from "lucide-react";

const DashboardHome = ({ user, onNavigate }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [eventChart, setEventChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, chartRes] = await Promise.all([
          Axios(SummaryApi.admin_stats),
          Axios(SummaryApi.admin_event_chart),
        ]);
        setStats(statsRes.data?.data);
        setEventChart(chartRes.data?.data ?? []);
      } catch {
        // silently fail, show fallback UI
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? `LKR ${Number(stats.totalRevenue ?? 0).toLocaleString("en", { minimumFractionDigits: 2 })}` : "—",
      icon: Coins,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? "—",
      icon: Ticket,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      label: "Tickets Used",
      value: stats?.usedTickets ?? "—",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Total Scans",
      value: stats?.totalScans ?? "—",
      icon: ScanLine,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  const quickActions = [
    { label: "View All Events", icon: LayoutGrid, key: "events", color: "bg-violet-600 hover:bg-violet-700" },
    { label: "Create Event", icon: PlusCircle, key: "addevent", color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "Event Calendar", icon: Calendar, key: "eventcalendar", color: "bg-cyan-600 hover:bg-cyan-700" },
    { label: "Manage Users", icon: Users2, key: "allusers", color: "bg-slate-700 hover:bg-slate-800" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-200">
        <p className="text-violet-200 text-sm font-medium mb-1">Welcome back,</p>
        <h1 className="text-2xl font-black">
          {user ? `${user.firstName} ${user.lastName}` : "Admin"}
        </h1>
        <p className="text-violet-200 text-sm mt-1">Here's what's happening with your events today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-4 shadow-sm border ${border} flex flex-col gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              {loading ? (
                <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse mb-1" />
              ) : (
                <p className="text-2xl font-black text-slate-800">{value}</p>
              )}
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, key, color }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`${color} text-white rounded-2xl p-4 flex flex-col items-start gap-3 transition-all
                hover:shadow-lg hover:-translate-y-0.5 group`}
            >
              <Icon size={20} />
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold">{label}</span>
                <ArrowRight size={14} className="opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Event Chart Table */}
      {eventChart.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Events Overview</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Event</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Bookings</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Used</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {eventChart.slice(0, 8).map((row: any) => (
                  <tr key={row.eventId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800 max-w-[180px] truncate">{row.eventTitle ?? row.eventId}</td>
                    <td className="px-5 py-3 text-right text-slate-600">{row.totalTickets}</td>
                    <td className="px-5 py-3 text-right text-slate-600">{row.usedTickets}</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-600">
                      ${Number(row.revenue ?? 0).toLocaleString("en", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;