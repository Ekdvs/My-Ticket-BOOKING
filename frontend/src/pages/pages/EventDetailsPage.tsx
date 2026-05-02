import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import { toast } from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";

export default function EventDetailsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await Axios({
                    method: SummaryApi.geteventbyid(id!).method,
                    url: SummaryApi.geteventbyid(id!).url,
                });

                if (res.data?.success) {
                    // ✅ if backend returns single event
                    setEvent(res.data.data);


                } else {
                    toast.error("Event not found");
                }
            } catch (err: any) {
                toast.error(err.message || "Error fetching event");
            }
        };

        fetchEvent();
    }, [id]);

    if (!event)
        return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">

                <ImageSlider images={event.imageUrls || []} />

                <div className="grid lg:grid-cols-3 gap-8 mt-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-3xl font-bold">{event.title}</h1>

                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {event.category}
                        </span>

                        <p className="text-gray-600">{event.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400">Date</p>
                                <p>{new Date(event.eventDateTime).toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">Venue</p>
                                <p>{event.venue}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">Location</p>
                                <p>{event.location}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">Tickets</p>
                                <p>
                                    {event.availableTickets}/{event.totalTickets}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
                        <h2 className="text-xl font-semibold">Booking</h2>

                        <p className="text-3xl font-bold text-blue-600">
                            Rs. {event.price}
                        </p>

                        <p
                            className={`text-sm ${event.availableTickets > 0
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                        >
                            {event.availableTickets > 0
                                ? `${event.availableTickets} tickets left`
                                : "Sold Out"}
                        </p>

                        <button
                            disabled={event.availableTickets === 0}
                            onClick={() => navigate("/booking/" + event.id)}
                            className={`w-full py-3 rounded-xl text-white ${event.availableTickets > 0
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Book Now
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}