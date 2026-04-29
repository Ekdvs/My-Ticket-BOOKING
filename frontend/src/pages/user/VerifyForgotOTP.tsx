import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { FaEnvelope, FaKey } from "react-icons/fa";
import  Navbar from "../components/Navbar";
import  Footer from "../components/Footer";

const VerifyForgotOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromPrev = location.state?.email;

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!emailFromPrev) {
      toast.error("No email found. Please request OTP again.");
      navigate("/forgot-password");
    } else {
      setEmail(emailFromPrev);
    }
  }, [emailFromPrev, navigate]);

  // VERIFY OTP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await Axios({
        method: SummaryApi.verify_forgot_otp.method,
        url: SummaryApi.verify_forgot_otp.url,
        params: {
          email,
          otp,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);

        navigate("/reset-password", {
          state: { email},
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    try {
      setResending(true);

      const res = await Axios({
        method: SummaryApi.forgot_password(email).method,
        url: SummaryApi.forgot_password(email).url,
        data: { email },
      });

      if (res.data?.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(res.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (

    <><Navbar/>
    <div className="w-full h-screen bg-[url('/bglogin.png')] bg-cover flex items-center justify-center">

      {/* LEFT */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-8 bg-purple-600/50 p-10">
        <img src="/logo.png" alt="logo" className="w-[160px]" />

        <h1 className="text-5xl font-bold text-[#FFD700] text-center">
          Verify OTP Securely
        </h1>

        <p className="text-gray-200 text-lg w-[420px] text-center italic">
          Enter the OTP sent to your email to continue resetting your password.
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
            Verify OTP
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

            {/* OTP */}
            <div className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg text-white focus-within:ring-2 focus-within:ring-[#FFD700]">
              <FaKey />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit OTP"
                className="bg-transparent flex-1 outline-none tracking-widest text-lg"
              />
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black hover:scale-105"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* RESEND */}
          <p className="text-gray-300 text-sm">
            Didn’t receive OTP?{" "}
            <span
              onClick={handleResend}
              className="text-[#FFD700] cursor-pointer hover:underline"
            >
              {resending ? "Resending..." : "Resend"}
            </span>
          </p>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default VerifyForgotOTP;