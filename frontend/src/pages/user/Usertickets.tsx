import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import SummaryApi from "../../api/SummaryApi";

const UserTickets = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ───────── FETCH BOOKINGS ─────────
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await Axios({
                    method: SummaryApi.get_my_tickets.method,
                    url: SummaryApi.get_my_tickets.url,
                });

                if (res.data.success) {
                    setBookings(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to load tickets");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // ───────── STATUS COLOR ─────────
    const getStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return "text-green-600 bg-green-100";
            case "FAILED":
                return "text-red-600 bg-red-100";
            default:
                return "text-yellow-600 bg-yellow-100";
        }
    };

    const downloadFromUrl = async (url: string, bookingId: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `ticket-${bookingId}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Download started");
        } catch (err) {
            toast.error("Download failed");
        }
    };

    // ───────── UI ─────────
    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading tickets...
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">

            <h1 className="text-2xl font-bold text-slate-800 mb-6">
                🎟 My Tickets
            </h1>

            {bookings.length === 0 ? (
                <p className="text-gray-500">No tickets found</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-5">

                    {bookings.map((b) => (
                        <div
                            key={b.id}
                            className="bg-white border rounded-2xl shadow-sm p-4 hover:shadow-md transition"
                        >

                            {/* ───── TICKET CARD ───── */}
                            <div
                                id={`ticket-${b.id}`}
                                className="p-4 border rounded-xl bg-gradient-to-r from-indigo-50 to-white"
                            >

                                <h2 className="text-lg font-bold text-slate-800 mb-2">
                                    🎫 Event Ticket
                                </h2>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-semibold">Booking ID:</span> {b.bookingId}</p>
                                    <p><span className="font-semibold">Event ID:</span> {b.eventId}</p>
                                    <p><span className="font-semibold">Quantity:</span> {b.quantity}</p>
                                    <p><span className="font-semibold">Total:</span> LKR {b.totalPrice}</p>
                                </div>

                                {/* STATUS */}
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(b.paymentStatus)}`}>
                                        {b.paymentStatus}
                                    </span>

                                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                                        {b.ticketStatus}
                                    </span>
                                </div>

                            </div>

                            {/* ───── ACTIONS ───── */}
                            <div className="flex flex-col md:flex-row gap-2 mt-4">

                                {/* View PDF (Cloudinary) */}
                                {b.ticketUrl && (
                                    <a
                                        href={b.ticketUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        View Ticket
                                    </a>
                                )}

                                {/* Download Custom PDF */}
                                <button
                                    onClick={() => downloadFromUrl(b.ticketUrl, b.bookingId)}
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Download PDF
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default UserTickets;