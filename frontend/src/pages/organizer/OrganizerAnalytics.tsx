import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import {
  TrendingUp, BarChart2, RefreshCw,
  Calendar, CalendarDays, CheckCircle2, XCircle, Coins
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell
} from "recharts";

const OrganizerAnalytics = () => {
  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [eventChart, setEventChart] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [d, m, ec, s] = await Promise.all([
        Axios({ method: SummaryApi.organizer_daily_revenue.method, url: SummaryApi.organizer_daily_revenue.url }),
        Axios({ method: SummaryApi.organizer_monthly_revenue.method, url: SummaryApi.organizer_monthly_revenue.url }),
        Axios({ method: SummaryApi.organizer_event_chart.method, url: SummaryApi.organizer_event_chart.url }),
        Axios({ method: SummaryApi.organizer_summary.method, url: SummaryApi.organizer_summary.url }),
      ]);
      setDaily(d.data.data ?? []);
      setMonthly(m.data.data ?? []);
      setEventChart(ec.data.data ?? []);
      setSummary(s.data.data ?? {});
    } catch {
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) =>
    `Rs ${Number(val ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

  const revenueData = activeTab === "daily" ? daily : monthly;

  const EVENT_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#f59e0b", "#10b981"];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-7 w-40 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 h-64 animate-pulse" />
          ))}
        </div>
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={22} className="text-indigo-600" />
            Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Revenue trends and event performance</p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Earning Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Paid Out</p>
            <p className="text-xl font-black text-slate-800">{formatCurrency(summary.paid ?? 0)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Coins size={22} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Payout</p>
            <p className="text-xl font-black text-slate-800">{formatCurrency(summary.pending ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Revenue Line Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Revenue Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5">Your earnings over time</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("daily")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${activeTab === "daily" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Calendar size={12} /> Daily
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${activeTab === "monthly" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800"}`}
            >
              <CalendarDays size={12} /> Monthly
            </button>
          </div>
        </div>

        {revenueData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 gap-2">
            <TrendingUp size={36} className="text-slate-200" />
            <p className="text-sm text-slate-400">No revenue data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `Rs ${v}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v: any) => [`Rs ${Number(v).toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#6366f1" }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Event Performance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-800">Event Performance</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tickets sold vs used per event</p>
        </div>

        {eventChart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 gap-2">
            <BarChart2 size={36} className="text-slate-200" />
            <p className="text-sm text-slate-400">No event data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventChart} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="totalTickets" name="Sold" radius={[6, 6, 0, 0]} maxBarSize={36}>
                {eventChart.map((_: any, i: number) => (
                  <Cell key={i} fill={EVENT_COLORS[i % EVENT_COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="usedTickets" name="Used" fill="#e2e8f0" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue Table */}
      {revenueData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-800">
              {activeTab === "daily" ? "Daily" : "Monthly"} Revenue Breakdown
            </h2>
          </div>
          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
            {revenueData.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                <span className="text-sm font-bold text-indigo-600">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerAnalytics;