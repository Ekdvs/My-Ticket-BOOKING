import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";
import {
  CreditCard, Clock, CheckCircle2, XCircle,
  RefreshCw, ArrowDownCircle, Users2, Coins
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  PENDING:  { label: "Pending",  color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock },
  APPROVED: { label: "Approved", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-500",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle },
};

const WithdrawAdmin = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await Axios({
        method: SummaryApi.admin_withdraw_list.method,
        url: SummaryApi.admin_withdraw_list.url,
      });
      setData(res.data.data ?? []);
    } catch {
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id: string) => {
    setApprovingId(id);
    try {
      await Axios({
        method: SummaryApi.admin_approve_withdraw(id).method,
        url: SummaryApi.admin_approve_withdraw(id).url,
      });
      toast.success("Withdrawal approved!");
      fetchData();
    } catch {
      toast.error("Failed to approve withdrawal");
    } finally {
      setApprovingId(null);
    }
  };

  const filtered = filter === "ALL" ? data : data.filter((w) => w.status === filter);

  const totalPending  = data.filter((w) => w.status === "PENDING").length;
  const totalApproved = data.filter((w) => w.status === "APPROVED").length;
  const totalAmount   = data.reduce((acc, w) => acc + (w.amount ?? 0), 0);

  const statCards = [
    { label: "Total Requests", value: data.length,     icon: CreditCard,    color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-100" },
    { label: "Pending",        value: totalPending,    icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-100"  },
    { label: "Approved",       value: totalApproved,   icon: CheckCircle2,  color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-100"},
    { label: "Total Volume",   value: `Rs ${Number(totalAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
      icon: Coins, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  ];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowDownCircle size={22} className="text-indigo-600" />
            Withdrawal Requests
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Review and approve organizer withdrawal requests</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm border ${border} flex items-center gap-3 hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3 flex items-center gap-2 flex-wrap">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
              ${filter === tab
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
          >
            {tab === "ALL" ? `All (${data.length})` : tab === "PENDING" ? `Pending (${totalPending})` : tab === "APPROVED" ? `Approved (${totalApproved})` : "Rejected"}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} results</span>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center gap-3">
          <ArrowDownCircle size={40} className="text-slate-200" />
          <p className="text-slate-400 font-medium">No {filter !== "ALL" ? filter.toLowerCase() : ""} withdrawal requests</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Organizer ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered
                  .slice()
                  .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
                  .map((w) => {
                    const cfg = STATUS_CONFIG[w.status] ?? STATUS_CONFIG.PENDING;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={w.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                              <Users2 size={13} className="text-indigo-600" />
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{w.organizerId ?? w.id ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-black text-slate-800">
                            Rs {Number(w.amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-500">
                            {w.createdAt
                              ? new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                              : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                            <StatusIcon size={11} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {w.status === "PENDING" ? (
                            <button
                              onClick={() => approve(w.id)}
                              disabled={approvingId === w.id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500
                                hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl
                                shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              {approvingId === w.id ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              {approvingId === w.id ? "Approving…" : "Approve"}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-300 font-medium">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered
              .slice()
              .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
              .map((w) => {
                const cfg = STATUS_CONFIG[w.status] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <div key={w.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {w.createdAt ? new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-800 mb-1">
                      Rs {Number(w.amount ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mb-3">{w.organizerId ?? w.id}</p>
                    {w.status === "PENDING" && (
                      <button
                        onClick={() => approve(w.id)}
                        disabled={approvingId === w.id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                          bg-gradient-to-r from-emerald-500 to-teal-500
                          hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold
                          rounded-xl shadow-sm shadow-emerald-200 disabled:opacity-50 transition-all"
                      >
                        {approvingId === w.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        {approvingId === w.id ? "Approving…" : "Approve"}
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default WithdrawAdmin;