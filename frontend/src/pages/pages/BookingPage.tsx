import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { toast} from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiCalendar,
  FiMapPin,
  FiTag,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
   FiShoppingCart,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
  FiClock,
} from "react-icons/fi";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);



  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await Axios({
          method: SummaryApi.geteventbyid(id!).method,
          url: SummaryApi.geteventbyid(id!).url,
        });
        setEvent(res.data.data);
      } catch {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
  const token = localStorage.getItem("accessToken");

  // 🔥 NOT LOGGED IN → SAVE REDIRECT + GO LOGIN
  if (!token) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      JSON.stringify({
        path: `/booking/${id}`,
        state: { qty },
      })
    );

    toast.error("Please login to continue");
    navigate("/login");
    return;
  }

  // ✅ LOGGED IN → CONTINUE BOOKING
  setSubmitting(true);

  try {
    const res = await Axios({
      method: SummaryApi.createBooking.method,
      url: SummaryApi.createBooking.url,
      data: { eventId: id, quantity: qty },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const bookingId = res.data.data.bookingId;
    console.log("Booking created with ID:", res.data);

    toast.success("Booking confirmed! Redirecting to payment…");

    setTimeout(() => {
      navigate(`/payment/${bookingId}`);
    }, 1200);

  } catch {
    toast.error("Booking failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading booking details…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Not Found ── */
  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <FiAlertCircle className="text-red-400 text-5xl mx-auto" />
            <p className="text-xl font-semibold text-gray-700">Event not found</p>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:underline text-sm flex items-center gap-1 mx-auto"
            >
              <FiArrowLeft /> Go back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalPrice = qty * event.price;
  const serviceFee = Math.round(totalPrice * 0.02);
  const grandTotal = totalPrice + serviceFee;
  const soldPercent = Math.round(
    ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100
  );

  return (
    <>
      

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8 lg:py-12">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium mb-8 transition-colors duration-200 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Event
          </button>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-500 mt-1 text-sm">Review the details and select your tickets below</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* ── LEFT: Event Info + Ticket Selector ── */}
            <div className="lg:col-span-3 space-y-5">

              {/* Event Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Event image strip */}
                {event.imageUrls?.[0] && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={event.imageUrls[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* Category badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                    <FiTag className="text-xs" />
                    {event.category}
                  </span>

                  <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>

                  {/* Meta details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                      <FiCalendar className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Date & Time</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(event.eventDateTime).toLocaleDateString("en-US", {
                            weekday: "short", month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.eventDateTime).toLocaleTimeString("en-US", {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                      <FiMapPin className="text-rose-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Venue</p>
                        <p className="text-sm font-semibold text-gray-800">{event.venue}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Availability bar */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        < FiShoppingCart className="text-purple-500" /> Ticket Availability
                      </span>
                      <span className={`text-xs font-semibold ${soldPercent > 80 ? "text-red-500" : "text-green-600"}`}>
                        {event.availableTickets} left
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          soldPercent > 80 ? "bg-red-400" : soldPercent > 50 ? "bg-amber-400" : "bg-green-400"
                        }`}
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{soldPercent}% of tickets sold</p>
                  </div>
                </div>
              </div>

              {/* Ticket Quantity Selector */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  < FiShoppingCart className="text-blue-500" /> Select Tickets
                </h3>
                <p className="text-xs text-gray-400 mb-5">Choose how many tickets you'd like to book</p>

                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                  {/* Decrease */}
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                      qty <= 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 shadow hover:shadow-md hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                    }`}
                  >
                    <FiMinus />
                  </button>

                  {/* Count Display */}
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-gray-900">{qty}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{qty === 1 ? "ticket" : "tickets"}</p>
                  </div>

                  {/* Increase */}
                  <button
                    onClick={() => setQty((q) => Math.min(event.availableTickets, q + 1))}
                    disabled={qty >= event.availableTickets}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                      qty >= event.availableTickets
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white shadow hover:bg-blue-700 hover:shadow-md active:scale-95"
                    }`}
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Max notice */}
                {qty === event.availableTickets && (
                  <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <FiAlertCircle className="flex-shrink-0" />
                    You've selected the maximum available tickets
                  </p>
                )}

                {/* Quick select chips */}
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Quick select</p>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].filter((n) => n <= event.availableTickets).map((n) => (
                      <button
                        key={n}
                        onClick={() => setQty(n)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                          qty === n
                            ? "bg-blue-600 text-white border-blue-600 shadow"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-6 space-y-4">

                {/* Summary Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-4">
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Order Summary</p>
                    <p className="text-white text-2xl font-extrabold mt-1">Rs. {grandTotal.toLocaleString()}</p>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Line items */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Ticket price</span>
                        <span className="font-medium text-gray-800">Rs. {Number(event.price).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Quantity</span>
                        <span className="font-medium text-gray-800">× {qty}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-800">Rs. {totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>Service fee (2%)</span>
                        <span>Rs. {serviceFee.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-extrabold text-blue-600 text-lg">Rs. {grandTotal.toLocaleString()}</span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleBooking}
                      disabled={submitting || event.availableTickets === 0}
                      className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 mt-1 ${
                        submitting || event.availableTickets === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <FiArrowRight className="text-lg" />
                        </>
                      )}
                    </button>

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-2">
                        <FiShield className="text-green-500 flex-shrink-0" />
                        Secure payment
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-2">
                        <FiCheckCircle className="text-blue-500 flex-shrink-0" />
                        Instant confirm
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-2 col-span-2">
                        <FiClock className="text-amber-500 flex-shrink-0" />
                        Tickets valid for event date only
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low stock warning */}
                {event.availableTickets <= 10 && event.availableTickets > 0 && (
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0 text-amber-500" />
                    <p>
                      <strong>Almost gone!</strong> Only {event.availableTickets} tickets remaining. Book now before they sell out.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}