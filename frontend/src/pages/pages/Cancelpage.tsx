import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CancelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id");

  return (
    <><Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center space-y-6">

        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Payment Cancelled</h1>
          <p className="text-gray-500 text-sm">
            Your payment was cancelled. No charges have been made.
            You can try again whenever you're ready.
          </p>
        </div>

        {/* Order ID if present */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
            <p className="font-mono text-sm text-gray-700 break-all">{orderId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                       hover:bg-blue-700 active:scale-95 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold
                       hover:bg-gray-200 active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Need help?{" "}
          <Link to="mailto:support@ekdvs.xyz" className="underline">
            Contact support
          </Link>
        </p>

      </div>
    </div>
    <Footer/>
    </>
  );
}