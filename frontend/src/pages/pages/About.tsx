import PageLayout from "../components/PageLayout";

export default function About() {
  return (
    <PageLayout
      title="About MyTickets"
      subtitle="Sri Lanka’s modern event booking platform"
    >
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          MyTickets is a next-generation ticket booking platform built for
          concerts, movies, theatre, sports, and events across Sri Lanka.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white">Fast Booking</h3>
            <p className="text-sm text-gray-400 mt-2">
              Book tickets in seconds with a smooth UI experience.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white">Secure Payments</h3>
            <p className="text-sm text-gray-400 mt-2">
              100% secure checkout system with trusted gateways.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white">Instant Tickets</h3>
            <p className="text-sm text-gray-400 mt-2">
              Get QR tickets instantly after booking.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}