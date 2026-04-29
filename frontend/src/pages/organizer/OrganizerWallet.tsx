import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import {
  Wallet2, TrendingUp, ArrowDownCircle, Coins,
  RefreshCw, CheckCircle2, Clock, ChevronRight
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const OrganizerWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [wRes, eRes] = await Promise.all([
        Axios({ method: SummaryApi.organizer_wallet.method, url: SummaryApi.organizer_wallet.url }),
        Axios({ method: SummaryApi.organizer_earnings.method, url: SummaryApi.organizer_earnings.url }),
      ]);
      setWallet(wRes.data.data ?? {});
      setEarnings(eRes.data.data ?? []);
    } catch {
      setError("Failed to load wallet data.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) =>
    `Rs ${Number(val ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

  const pieData = wallet
    ? [
        { name: "Available", value: wallet.availableBalance ?? 0, color: "#6366f1" },
        { name: "Withdrawn", value: wallet.withdrawnAmount ?? 0, color: "#10b981" },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-7 w-36 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 h-32 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-72 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Wallet2 size={48} className="text-slate-200" />
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

  const walletCards = [
    {
      label: "Total Earnings",
      value: formatCurrency(wallet?.totalEarnings ?? 0),
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label: "Available Balance",
      value: formatCurrency(wallet?.availableBalance ?? 0),
      icon: Wallet2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Withdrawn",
      value: formatCurrency(wallet?.withdrawnAmount ?? 0),
      icon: ArrowDownCircle,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet2 size={22} className="text-indigo-600" />
            Wallet
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Your earnings and balance overview</p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {walletCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl p-5 shadow-sm border ${border} flex items-center gap-4 hover:shadow-md transition-shadow`}
          >
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-xl font-black text-slate-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart + Earnings Table */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-5">Balance Distribution</h2>
          {(wallet?.totalEarnings ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <Coins size={36} className="text-slate-200" />
              <p className="text-sm text-slate-400">No earnings yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v: any) => [`Rs ${Number(v).toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-base font-bold text-slate-800">Recent Earnings</h2>
          </div>
          {earnings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Coins size={32} className="text-slate-200" />
              <p className="text-sm text-slate-400">No earnings records</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 max-h-56 overflow-y-auto">
              {earnings.slice(0, 15).map((e: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                        ${e.payoutStatus === "PAID" ? "bg-emerald-50" : "bg-amber-50"}`}
                    >
                      {e.payoutStatus === "PAID"
                        ? <CheckCircle2 size={14} className="text-emerald-500" />
                        : <Clock size={14} className="text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {e.payoutStatus === "PAID" ? "Paid" : "Pending"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">
                    Rs {Number(e.organizerAmount ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          {earnings.length > 15 && (
            <div className="px-5 py-3 border-t border-slate-50">
              <p className="text-xs text-slate-400 text-center">{earnings.length - 15} more records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerWallet;