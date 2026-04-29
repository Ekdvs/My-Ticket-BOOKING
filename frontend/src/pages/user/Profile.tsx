import { useState, useMemo, useRef } from "react";
import { User, Camera, Mail, Phone, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { toast } from "react-hot-toast";

interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  avatar?: string;
  role?: string;
}

interface Props {
  user: UserType;
}

export default function Profile({ user }: Props) {
  const [firstName, setFirstName]   = useState(user.firstName);
  const [lastName,  setLastName]    = useState(user.lastName);
  const [mobile,    setMobile]      = useState(user.mobile || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview,   setPreview]     = useState<string | null>(user.avatar || null);
  const [loading,   setLoading]     = useState(false);
  const [saved,     setSaved]       = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isChanged = useMemo(() => (
    firstName !== user.firstName ||
    lastName  !== user.lastName  ||
    mobile    !== (user.mobile || "") ||
    avatarFile !== null
  ), [firstName, lastName, mobile, avatarFile, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify({ firstName, lastName, mobile }));
      if (avatarFile) formData.append("avatarFile", avatarFile);

      const res = await Axios({
        method: SummaryApi.update_profile.method,
        url:    SummaryApi.update_profile.url,
        data:   formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully");
        setSaved(true);
        setAvatarFile(null);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-5 max-w-2xl">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">My Profile</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your personal information</p>
      </div>

      {/* ── Avatar Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
              {preview
                ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-black text-indigo-600">{initials || <User size={32} />}</span>
              }
            </div>

            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Camera size={14} className="text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* User info summary */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-black text-slate-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-indigo-500 font-semibold capitalize">{user.role || "User"}</p>
            <p className="text-sm text-slate-400 mt-1">{user.email}</p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
            >
              Change Photo
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
      >
        <h3 className="text-sm font-bold text-slate-700 mb-5 uppercase tracking-wider">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Email address cannot be changed</p>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
              Mobile Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Your mobile number"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <AnimatePresence>
            {isChanged && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 pt-1"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Updating…</>
                    : saved
                    ? <><CheckCircle size={15} /> Saved!</>
                    : "Save Changes"
                  }
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setMobile(user.mobile || "");
                    setPreview(user.avatar || null);
                    setAvatarFile(null);
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Discard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </motion.div>

      {/* ── Account Info Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5"
      >
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Account Details</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Account ID", value: user.id?.slice(-8)?.toUpperCase() ?? "—" },
            { label: "Role",       value: user.role ?? "User" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-indigo-400 font-bold uppercase">{label}</p>
              <p className="text-sm font-bold text-indigo-800 mt-0.5 capitalize">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}