import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromPrev = location.state?.email;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!emailFromPrev) {
      toast.error("No email found. Please restart the process.");
      navigate("/forgot-password");
    } else {
      setEmail(emailFromPrev);
    }
  }, [emailFromPrev, navigate]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) return "At least 6 characters required";
    if (!/[A-Z]/.test(pwd)) return "One uppercase letter required";
    if (!/[0-9]/.test(pwd)) return "One number required";
    if (!/[!@#$%^&*]/.test(pwd)) return "One special character required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await Axios({
        method: SummaryApi.reset_password.method,
        url: SummaryApi.reset_password.url,
        params: {
          email,
          newPassword: password,
        },
      });

      if (res.data.success) {
        toast.success("Password reset successfully");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(res.data.message || "Reset failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[url('/bglogin.png')] bg-cover flex items-center justify-center">

      {/* LEFT */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-8 bg-purple-600/50 p-10">
        <img src="/logo.png" alt="logo" className="w-[160px]" />

        <h1 className="text-5xl font-bold text-[#FFD700] text-center">
          Reset Password Securely
        </h1>

        <p className="text-gray-200 text-lg w-[420px] text-center italic">
          Create a strong password to secure your account.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold"
        >
          Back to Login
        </button>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[50%] h-full flex items-center justify-center bg-purple-600/50">
        <div className="w-[90%] max-w-[500px] bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">

          <h1 className="text-3xl text-[#FFD700] font-semibold">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

            {/* EMAIL */}
            <div className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg text-white">
              <FaEnvelope />
              <input
                type="email"
                value={email}
                readOnly
                className="bg-transparent flex-1 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg text-white focus-within:ring-2 focus-within:ring-[#FFD700]">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="bg-transparent flex-1 outline-none pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFD700]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg text-white focus-within:ring-2 focus-within:ring-[#FFD700]">
              <FaLock />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="bg-transparent flex-1 outline-none pr-8"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFD700]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="text-gray-300 text-xs">
              At least 6 chars, 1 uppercase, 1 number, 1 special character
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;