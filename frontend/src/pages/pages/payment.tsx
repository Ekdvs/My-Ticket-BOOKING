import {  useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiLock,
  FiShield,
  FiArrowLeft,
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiHash,
  FiPackage,
  FiArrowRight,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";

const PAYHERE_URL = "https://sandbox.payhere.lk/pay/checkout";

export default function PaymentPage() {
  const { bookingId } = useParams();

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentData, setPaymentData] = useState<Record<string, string> | null>(null);
  const Navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) return;

    const loadPayment = async () => {

      const token = localStorage.getItem("accessToken");

      // 🔥 NOT LOGGED IN → SAVE REDIRECT + GO LOGIN
      if (!token) {
        sessionStorage.setItem(
          "redirectAfterLogin",
          JSON.stringify({
            path: `/payment/${bookingId}`,

          })
        );

        toast.error("Please login to continue");
        Navigate("/login");
        return;
      }
      try {
        const res = await Axios({
          method: SummaryApi.createPayment.method,
          url: `${SummaryApi.createPayment.url}?bookingId=${bookingId}`,
        });
        
        setPaymentData(res.data);
      } catch (err: any) {
        toast.error("Failed to prepare payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [bookingId]);

  const startPayment = () => {
    if (!paymentData) {
      toast.error("Payment data is not ready.");
      return;
    }

    const required = ["merchant_id", "order_id", "amount", "currency", "hash"];
    const missing = required.filter((k) => !paymentData[k]);
    if (missing.length > 0) {
      toast.error(`Payment setup error — missing: ${missing.join(", ")}`);
      return;
    }

    setPaying(true);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = PAYHERE_URL;

    Object.entries(paymentData).forEach(([key, value]) => {
      if (value == null) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
              <FiLock className="absolute inset-0 m-auto text-blue-600 text-xl" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold">Preparing Secure Payment</p>
              <p className="text-gray-400 text-sm mt-1 animate-pulse">Please wait a moment…</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Error ── */
  if (!paymentData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <FiAlertTriangle className="text-red-500 text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Payment Setup Failed</h2>
              <p className="text-gray-500 text-sm mt-1">
                We couldn't load your payment details. Please go back and try again.
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mx-auto transition-colors"
            >
              <FiArrowLeft /> Go back to booking
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const amount = parseFloat(paymentData.amount || "0");
  const currency = paymentData.currency || "LKR";

  return (
    <>


      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10 px-4">
        <div className="max-w-lg mx-auto space-y-5">

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Booking
          </button>

          {/* Header Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <FiLock className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">Secure Checkout</h1>
                <p className="text-blue-100 text-sm mt-0.5">
                  You'll be redirected to PayHere's verified payment gateway
                </p>
              </div>
            </div>

            {/* SSL indicators */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { icon: <FiShield className="text-green-300" />, label: "SSL Encrypted" },
                { icon: <FiCheckCircle className="text-green-300" />, label: "PCI Compliant" },
                { icon: <FiLock className="text-green-300" />, label: "Central Bank Approved" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {icon} {label}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FiPackage className="text-blue-500" />
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Order Summary</h2>
            </div>

            <div className="p-5 space-y-3">
              {/* Booking ID */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <FiHash className="text-gray-400" /> Booking ID
                </span>
                <span className="font-mono text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 max-w-[180px] truncate">
                  {paymentData.order_id}
                </span>
              </div>

              {/* Items */}
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCreditCard className="text-gray-400" /> Item(s)
                </span>
                <span className="text-sm font-medium text-gray-700 text-right max-w-[200px]">
                  {paymentData.items}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 my-1" />

              {/* Total */}
              <div className="flex items-center justify-between px-1">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-blue-600">
                    {currency} {amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">What happens next?</h3>
            <div className="space-y-3">
              {[
                { step: "1", title: "Click Pay Now", desc: "You'll be securely redirected to PayHere", color: "bg-blue-100 text-blue-700" },
                { step: "2", title: "Complete Payment", desc: "Enter your card or use mobile payment options", color: "bg-indigo-100 text-indigo-700" },
                { step: "3", title: "Instant Confirmation", desc: "Your ticket booking is confirmed immediately", color: "bg-green-100 text-green-700" },
              ].map(({ step, title, desc, color }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${color}`}>
                    {step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={startPayment}
            disabled={paying}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-200 shadow-lg ${paying
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
              }`}
          >
            {paying ? (
              <>
                <FiRefreshCw className="text-lg animate-spin" />
                Redirecting to PayHere…
              </>
            ) : (
              <>
                <FiLock className="text-lg" />
                Pay {currency} {amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })} Securely
                <FiArrowRight className="text-lg" />
              </>
            )}
          </button>

          {/* Footer note */}
          <div className="text-center space-y-2 pb-4">
            <p className="text-xs text-gray-400">
              By proceeding, you agree to PayHere's{" "}
              <a
                href="https://www.payhere.lk/terms"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center gap-0.5"
              >
                Terms of Service <FiExternalLink className="text-[10px]" />
              </a>
            </p>
            <p className="text-xs text-gray-400">
              Powered by{" "}
              <Link
                to="https://www.payhere.lk"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline font-medium"
              >
                PayHere
              </Link>{" "}
              — Central Bank of Sri Lanka approved payment gateway
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}