import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verify = async () => {
      try {
        await Axios({
          method: SummaryApi.verifyEmail(token!).method,
          url: SummaryApi.verifyEmail(token!).url,
        });
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err) {
        setStatus("error");
        toast.error("Invalid or expired verification link.");
      }
    };

    if (token) verify();
  }, [token]);

  // Auto-redirect countdown on success
  useEffect(() => {
    if (status !== "success") return;
    if (countdown === 0) { navigate("/login"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

        {/* ── LOADING ─────────────────────────────────────────────────── */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Spinner ring */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-white/5" />
              <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail size={28} className="text-orange-400" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-black text-2xl mb-2">Verifying your email…</h2>
              <p className="text-gray-500 text-sm">Please wait a moment</p>
            </div>
            {/* Animated dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SUCCESS ─────────────────────────────────────────────────── */}
        {status === "success" && (
          <div className="max-w-md w-full">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative bg-gray-900 border border-white/5 rounded-3xl p-10 text-center shadow-2xl">
              {/* Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping opacity-30" />
                <div className="relative w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-400" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Verified</span>
              </div>

              <h2 className="text-white font-black text-3xl mb-3">Email Confirmed!</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Your email address has been successfully verified. You can now log in and enjoy full access to MyTickets.
              </p>

              {/* Countdown bar */}
              <div className="bg-gray-800 rounded-2xl p-4 mb-6">
                <p className="text-gray-500 text-xs mb-2">
                  Redirecting to login in{" "}
                  <span className="text-white font-bold">{countdown}s</span>
                </p>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 active:scale-[0.98] text-white py-3.5 rounded-xl font-black transition-all"
              >
                Go to Login
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ───────────────────────────────────────────────────── */}
        {status === "error" && (
          <div className="max-w-md w-full">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative bg-gray-900 border border-white/5 rounded-3xl p-10 text-center shadow-2xl">
              {/* Icon */}
              <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-red-400" />
              </div>

              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Failed</span>
              </div>

              <h2 className="text-white font-black text-3xl mb-3">Verification Failed</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                This verification link is invalid or has expired. Please request a new verification email and try again.
              </p>

              {/* What to do */}
              <div className="bg-gray-800 border border-white/5 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">What to do next</p>
                <div className="space-y-2.5">
                  {[
                    "Check your inbox for a newer verification email",
                    "Make sure you clicked the correct link",
                    "Request a fresh link from your account settings",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                      <p className="text-gray-400 text-xs">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 active:scale-[0.98] text-white py-3 rounded-xl font-bold transition-all"
                >
                  Back to Login
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 py-3 rounded-xl font-bold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  Re-register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}