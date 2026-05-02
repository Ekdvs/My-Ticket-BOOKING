import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";

// ❌ NO payhere SDK — it fires XHR that CORS blocks on every origin not whitelisted by PayHere
// ❌ NO declare global { interface Window { payhere: any } }

// Swap to "https://www.payhere.lk/pay/checkout" for production
const PAYHERE_URL = "https://sandbox.payhere.lk/pay/checkout";

export default function PaymentPage() {
  const { bookingId } = useParams();

  const [loading,     setLoading]     = useState(true);
  const [paying,      setPaying]      = useState(false);
  const [paymentData, setPaymentData] = useState<Record<string, string> | null>(null);

  // ================= FETCH PAYMENT DATA FROM BACKEND =================
  useEffect(() => {
    if (!bookingId) return;

    const loadPayment = async () => {
      try {
        const res = await Axios({
          method: SummaryApi.createPayment.method,
          url: `${SummaryApi.createPayment.url}?bookingId=${bookingId}`,
        });
        console.log("Payment data received:", res.data);
        setPaymentData(res.data);
      } catch (err: any) {
        console.error("Failed to fetch payment data:", err);
        toast.error("Failed to prepare payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [bookingId]);

  // ================= PAY: hidden form POST → redirect to PayHere =================
  // PayHere's JS SDK fires XHR to checkoutJ which gets CORS-blocked on every
  // non-whitelisted origin (including localhost). The fix is a plain HTML form
  // POST — the browser follows it as a full-page redirect, no XHR involved.
  const startPayment = () => {
    if (!paymentData) {
      toast.error("Payment data is not ready.");
      return;
    }

    const required = ["merchant_id", "order_id", "amount", "currency", "hash"];
    const missing  = required.filter((k) => !paymentData[k]);
    if (missing.length > 0) {
      toast.error(`Payment setup error — missing: ${missing.join(", ")}`);
      console.error("Missing fields:", missing, paymentData);
      return;
    }

    setPaying(true);

    const form    = document.createElement("form");
    form.method   = "POST";
    form.action   = PAYHERE_URL;

    Object.entries(paymentData).forEach(([key, value]) => {
      if (value == null) return;           // skip null / undefined fields
      const input  = document.createElement("input");
      input.type   = "hidden";
      input.name   = key;
      input.value  = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();                         // browser navigates away — no cleanup needed
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm animate-pulse">Preparing secure payment…</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (!paymentData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <p className="text-3xl">⚠️</p>
          <p className="text-red-500 font-semibold">Failed to load payment details</p>
          <p className="text-gray-400 text-sm">Please go back and try again.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-2 text-blue-600 underline text-sm"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  // ================= PAYMENT PAGE =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 text-center space-y-6">

        <div className="text-5xl">🔐</div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Secure Payment</h1>
          <p className="text-gray-500 text-sm">
            You'll be redirected to PayHere's secure checkout page
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Booking ID</span>
            <span className="font-mono text-xs text-gray-600 truncate max-w-[200px]">
              {paymentData.order_id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Items</span>
            <span className="text-gray-700">{paymentData.items}</span>
          </div>
          <div className="border-t border-gray-100 my-1" />
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total</span>
            <span className="text-blue-700 font-bold text-base">
              {paymentData.currency} {paymentData.amount}
            </span>
          </div>
        </div>

        {/* Pay button */}
        <button
          onClick={startPayment}
          disabled={paying}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                     hover:bg-blue-700 active:scale-95 transition-all
                     disabled:opacity-60 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {paying ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to PayHere…
            </>
          ) : (
            "Pay Now →"
          )}
        </button>

        <p className="text-xs text-gray-400">
          Powered by{" "}
          <a href="https://www.payhere.lk" target="_blank" rel="noreferrer" className="underline">
            PayHere
          </a>{" "}
          — Central Bank approved secure gateway
        </p>
      </div>
    </div>
  );
}