import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Trash2, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role?: string;
}

interface Props {
  user: User;
}

/* ── Inline Confirm Modal (no external dependency) ── */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  loading: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>

            <h3 className="text-base font-black text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Setting Row Card ── */
function SettingCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  action,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="flex-shrink-0">{action}</div>
    </div>
  );
}

export default function Setting({ user }: Props) {
  const navigate = useNavigate();
  const [deleting, setDeleting]         = useState(false);
  const [isModalOpen, setIsModalOpen]   = useState(false);

  const handleResetPassword = () => {
    navigate("/reset-password", { state: { email: user.email } });
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const res = await Axios({
        method: SummaryApi.delete_user.method,
        url:    SummaryApi.delete_user.url,
      });
      toast.success(res.data.message || "Account deleted successfully");
      localStorage.clear();
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account preferences and security</p>
      </div>

      {/* ── Account Info Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">
            {user.firstName} {user.lastName ?? ""}
          </p>
          <p className="text-xs text-indigo-500 font-semibold">{user.email}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5 capitalize">
            {user.role ?? "User"}
          </p>
        </div>
      </motion.div>

      {/* ── Security Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Security</p>
        <SettingCard
          icon={KeyRound}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          title="Reset Password"
          description="Change your account password. We recommend using a strong, unique password."
          action={
            <button
              onClick={handleResetPassword}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 whitespace-nowrap"
            >
              Reset Password
            </button>
          }
        />
      </motion.div>

      {/* ── Danger Zone ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Danger Zone</p>

        <div className="border border-red-100 rounded-2xl overflow-hidden">
          <div className="bg-red-50 px-5 py-3 border-b border-red-100">
            <p className="text-xs text-red-500 font-semibold">
              These actions are permanent and cannot be undone.
            </p>
          </div>

          <div className="bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Delete Account</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Permanently remove your account, tickets, and all data.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={deleting}
              className="flex-shrink-0 flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
              {deleting ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── App Info ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center pt-2"
      >
        <p className="text-xs text-slate-300 font-medium">
          Account ID: {user.id?.slice(-10)?.toUpperCase() ?? "—"}
        </p>
      </motion.div>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete your account?"
        message="This will permanently delete your account and all associated data including your tickets and history. This action cannot be undone."
        confirmLabel="Yes, Delete Account"
        loading={deleting}
      />
    </div>
  );
}