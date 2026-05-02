import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import { toast } from "react-hot-toast";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [qty, setQty] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await Axios({
        method: SummaryApi.geteventbyid(id!).method,
        url: SummaryApi.geteventbyid(id!).url,
      });

      setEvent(res.data.data);
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      const res = await Axios({
        method: SummaryApi.createBooking.method,
        url: SummaryApi.createBooking.url,
        data: {
          eventId: id,
          quantity: qty,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bookingId = res.data.data.bookingId;

      // 👉 go to payment page
      navigate(`/payment/${bookingId}`);

    } catch {
      toast.error("Booking failed");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">{event.title}</h2>

      <div className="mt-4 flex gap-4 items-center">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
        <span>{qty}</span>
        <button onClick={() => setQty(q => Math.min(event.availableTickets, q + 1))}>+</button>
      </div>

      <p className="mt-2">Total: Rs. {qty * event.price}</p>

      <button
        onClick={handleBooking}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Continue to Payment
      </button>
    </div>
  );
}