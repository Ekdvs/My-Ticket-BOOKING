import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../../api/SummaryApi";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      setLoading(true);
      const api = SummaryApi.forgot_password(email);

      const res = await Axios({
        method: api.method,
        url: api.url,
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify-forgot-otp", { state: { email } });
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[url('/bglogin.png')] bg-cover flex items-center justify-center">

      {/* LEFT SECTION (same as login) */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-8 bg-purple-600/50 p-10">

        <img
          src="/logo.png"
          alt="logo"
          className="w-[160px] h-[160px] object-contain opacity-95 drop-shadow-lg"
        />

        <h1 className="text-5xl font-bold text-[#FFD700] text-center leading-tight">
          Reset Your Password Securely
        </h1>

        <p className="text-gray-200 text-lg w-[420px] text-center italic">
          Enter your email to receive a one-time OTP and regain access to your account quickly.
        </p>

        <div className="flex flex-col gap-3 text-gray-100 text-sm text-center">
          <p>✔ Fast OTP delivery</p>
          <p>✔ Secure verification process</p>
          <p>✔ Easy password reset</p>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold shadow-lg transition"
        >
          Back to Login
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-[50%] h-full bg-purple-600/50 flex items-center justify-center">
        
        <div className="w-[90%] max-w-[550px] bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-8 p-8">

          <h1 className="text-3xl font-semibold text-[#FFD700] text-center">
            Forgot Password
          </h1>

          <p className="text-gray-300 text-sm text-center w-[80%]">
            Enter your email address and we’ll send you an OTP to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">

            {/* Email */}
            <div className="flex items-center gap-3 w-[80%] h-[50px] rounded-lg px-3 bg-gray-800 text-white focus-within:ring-2 focus-within:ring-[#FFD700]">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none placeholder-gray-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 w-[80%] py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>

          </form>

          <p className="text-gray-300 text-sm">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#FFD700] hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;