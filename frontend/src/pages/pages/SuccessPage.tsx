import { useSearchParams, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center space-y-6">

        {/* Animated checkmark */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-500 text-sm">
            Your booking has been confirmed. A ticket will be sent to your email shortly.
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
            <p className="font-mono text-sm text-gray-700 break-all">{orderId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                       hover:bg-blue-700 active:scale-95 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold
                       hover:bg-gray-200 active:scale-95 transition-all"
          >
            View My Bookings
          </button>
        </div>

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