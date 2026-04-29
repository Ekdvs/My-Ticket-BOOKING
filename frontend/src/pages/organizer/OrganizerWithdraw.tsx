import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";
import {
  CreditCard, Wallet2, ArrowDownCircle, Clock,
  CheckCircle2, XCircle, RefreshCw, AlertCircle
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  APPROVED: { label: "Approved", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-500", bg: "bg-red-50", icon: XCircle },
};

const OrganizerWithdraw = () => {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [wRes, wdRes] = await Promise.all([
        Axios({ method: SummaryApi.organizer_wallet.method, url: SummaryApi.organizer_wallet.url }),
        Axios({ method: SummaryApi.withdraw_list.method, url: SummaryApi.withdraw_list.url }),
      ]);
      setWallet(wRes.data.data ?? {});
      setWithdrawals(wdRes.data.data ?? []);
    } catch {
      setError("Failed to load withdrawal data.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (parsed > (wallet?.availableBalance ?? 0)) {
      toast.error("Insufficient balance");
      return;
    }
    setSubmitting(true);
    try {
      await Axios({
        method: SummaryApi.withdraw_request.method,
        url: SummaryApi.withdraw_request.url,
        data: { amount: parsed },
      });
      toast.success("Withdrawal request submitted!");
      setAmount("");
      fetchAll();
    } catch {
      toast.error("Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    `Rs ${Number(val ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-7 w-36 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 h-72 animate-pulse" />
          <div className="bg-white rounded-2xl p-6 border border-slate-100 h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <CreditCard size={48} className="text-slate-200" />
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

  const available = wallet?.availableBalance ?? 0;
  const enteredAmount = Number(amount);
  const isInsufficient = enteredAmount > available;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={22} className="text-indigo-600" />
            Withdrawals
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Request payouts and track withdrawal history</p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Withdrawal Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <h2 className="text-base font-bold text-slate-800">Request Withdrawal</h2>

          {/* Balance Info */}
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Wallet2 size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-500 font-medium">Available Balance</p>
              <p className="text-lg font-black text-slate-800">{formatCurrency(available)}</p>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Withdrawal Amount (LKR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rs</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                max={available}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-semibold text-slate-800
                  focus:outline-none focus:ring-2 transition-all
                  ${isInsufficient && amount
                    ? "border-red-300 bg-red-50 focus:ring-red-300/40"
                    : "border-slate-200 bg-slate-50 focus:ring-indigo-400/40 focus:border-indigo-400"}`}
              />
            </div>
            {isInsufficient && amount && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5 font-medium">
                <AlertCircle size={12} /> Exceeds available balance
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Quick select</p>
            <div className="flex flex-wrap gap-2">
              {[1000, 5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(String(Math.min(amt, available)))}
                  disabled={available < amt}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600
                    rounded-lg hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50
                    disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Rs {amt.toLocaleString()}
                </button>
              ))}
              <button
                onClick={() => setAmount(String(available))}
                disabled={available <= 0}
                className="px-3 py-1.5 text-xs font-semibold border border-indigo-200 text-indigo-600
                  rounded-lg bg-indigo-50 hover:bg-indigo-100
                  disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Max
              </button>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={submitting || !amount || isInsufficient || available <= 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600
              hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold rounded-xl
              shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed
              disabled:shadow-none transition-all"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <ArrowDownCircle size={16} />
                Request Withdrawal
              </>
            )}
          </button>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-base font-bold text-slate-800">Withdrawal History</h2>
            <p className="text-xs text-slate-400 mt-0.5">{withdrawals.length} requests total</p>
          </div>

          {withdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <ArrowDownCircle size={36} className="text-slate-200" />
              <p className="text-sm text-slate-400">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {withdrawals
                .slice()
                .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
                .map((w: any, i: number) => {
                  const cfg = STATUS_CONFIG[w.status] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                          <StatusIcon size={15} className={cfg.color} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</p>
                          <p className="text-[10px] text-slate-400">
                            {w.createdAt
                              ? new Date(w.createdAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-slate-800">
                        {formatCurrency(w.amount ?? 0)}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerWithdraw;