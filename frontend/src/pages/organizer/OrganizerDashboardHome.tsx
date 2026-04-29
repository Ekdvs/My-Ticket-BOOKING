import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import {
  TrendingUp, Ticket, ScanLine, DollarSign,
  BarChart2, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const OrganizerDashboardHome = () => {
  const [stats, setStats] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, chartRes] = await Promise.all([
        Axios({ method: SummaryApi.organizer_stats.method, url: SummaryApi.organizer_stats.url }),
        Axios({ method: SummaryApi.organizer_event_chart.method, url: SummaryApi.organizer_event_chart.url }),
      ]);
      setStats(statsRes.data.data ?? {});
      setChartData(chartRes.data.data ?? []);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: `Rs ${Number(stats.totalRevenue ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "+12% this month",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings ?? 0,
      icon: Ticket,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      trend: "All time",
    },
    {
      label: "Total Scans",
      value: stats.totalScans ?? 0,
      icon: ScanLine,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      trend: "Entry validations",
    },
    {
      label: "Earning Records",
      value: stats.totalEarningsRecords ?? 0,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
      trend: "Transactions",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-40 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse h-28" />
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-72 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <BarChart2 size={48} className="text-slate-200" />
        <p className="text-slate-400 font-medium">{error}</p>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back! Here's your performance summary.</p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border, trend }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl p-5 shadow-sm border ${border} flex flex-col gap-3 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                {trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Event Performance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Event Performance</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tickets sold vs used per event</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <BarChart2 size={36} className="text-slate-200" />
            <p className="text-sm text-slate-400">No event data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="totalTickets" name="Tickets Sold" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="usedTickets" name="Tickets Used" radius={[6, 6, 0, 0]} fill="#e2e8f0" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardHome;