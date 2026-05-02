import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { toast} from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiCalendar,
  FiMapPin,
  FiTag,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiClock,
  FiShoppingCart,
} from "react-icons/fi";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await Axios({
          method: SummaryApi.geteventbyid(id!).method,
          url: SummaryApi.geteventbyid(id!).url,
        });

        if (res.data?.success) {
          setEvent(res.data.data);
          toast.success(res.data.message || "Event details loaded");
        } else {
          toast.error(res.data.message || "Event not found");
        }
      } catch (err: any) {
        toast.error(err.message || "Error fetching event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  /* ─── Loading Skeleton ─── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium tracking-wide">Loading event details…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Not Found ─── */
  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <FiAlertCircle className="text-red-400 text-5xl mx-auto" />
            <p className="text-xl font-semibold text-gray-700">Event Not Found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 text-blue-600 hover:underline text-sm flex items-center gap-1 mx-auto"
            >
              <FiArrowLeft /> Go back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isSoldOut = event.availableTickets === 0;
  const soldPercent = Math.round(
    ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100
  );

  return (
    <>
      
      

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8 lg:py-12">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium mb-6 transition-colors duration-200 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Events
          </button>

          {/* Image Slider */}
          <ImageSlider images={event.imageUrls || []} />

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mt-8">

            {/* ─── LEFT: Event Info ─── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Title + Category */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase">
                    <FiTag className="text-xs" />
                    {event.category}
                  </span>
                  {isSoldOut ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                      <FiAlertCircle className="text-xs" /> Sold Out
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <FiCheckCircle className="text-xs" /> Available
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">About this Event</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">{event.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <DetailCard
                  icon={<FiCalendar className="text-blue-500 text-lg" />}
                  label="Date & Time"
                  value={new Date(event.eventDateTime).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  sub={new Date(event.eventDateTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />

                <DetailCard
                  icon={<FiMapPin className="text-rose-500 text-lg" />}
                  label="Venue"
                  value={event.venue}
                  sub={event.location}
                />

                <DetailCard
                  icon={<FiUsers className="text-purple-500 text-lg" />}
                  label="Ticket Availability"
                  value={`${event.availableTickets} / ${event.totalTickets} remaining`}
                  sub={
                    <div className="mt-1.5">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            soldPercent > 80 ? "bg-red-400" : soldPercent > 50 ? "bg-amber-400" : "bg-green-400"
                          }`}
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{soldPercent}% sold</p>
                    </div>
                  }
                />

                <DetailCard
                  icon={<FiClock className="text-amber-500 text-lg" />}
                  label="Event ID"
                  value={`#${event.id}`}
                  sub="Reference number"
                />
              </div>
            </div>

            {/* ─── RIGHT: Booking Card ─── */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Card Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-5">
                  <p className="text-blue-100 text-sm font-medium">Price per ticket</p>
                  <p className="text-white text-4xl font-extrabold mt-1">
                    Rs. {Number(event.price).toLocaleString()}
                  </p>
                </div>

                {/* Card Body */}
                <div className="px-6 py-5 space-y-4">

                  {/* Availability status */}
                  <div className={`flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-3 ${
                    isSoldOut
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-green-50 text-green-700 border border-green-100"
                  }`}>
                    {isSoldOut ? (
                      <>
                        <FiAlertCircle className="text-base flex-shrink-0" />
                        <span>This event is fully booked</span>
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="text-base flex-shrink-0" />
                        <span><strong>{event.availableTickets}</strong> tickets still available</span>
                      </>
                    )}
                  </div>

                  {/* Book Button */}
                  <button
                    disabled={isSoldOut}
                    onClick={() => {
                      if (!isSoldOut) navigate("/booking/" + event.id);
                    }}
                    className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                      isSoldOut
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    <FiShoppingCart className="text-lg" />
                    {isSoldOut ? "Sold Out" : "Book Now"}
                  </button>

                  {/* Trust indicators */}
                  {!isSoldOut && (
                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                      <FiCheckCircle className="text-green-400" />
                      Secure &amp; instant booking confirmation
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ─── Reusable Detail Card ─── */
function DetailCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-3 items-start hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0 bg-gray-50 rounded-xl p-2.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
        {typeof sub === "string" ? (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{sub}</p>
        ) : (
          sub
        )}
      </div>
    </div>
  );
}