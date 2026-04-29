// pages/Blog.tsx
import PageLayout from "../components/PageLayout";

export default function Blog() {
  return (
    <PageLayout title="Blog" subtitle="Latest updates & news">
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-orange-500/30 transition"
          >
            <h3 className="font-bold">Event Booking Trends {i}</h3>
            <p className="text-sm text-gray-400 mt-2">
              Learn about modern ticketing systems and UI trends.
            </p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}