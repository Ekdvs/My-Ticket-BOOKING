// pages/support/FAQ.tsx
import PageLayout from "../../components/PageLayout";

export default function FAQ() {
  return (
    <PageLayout title="FAQ" subtitle="Frequently asked questions">
      <div className="space-y-4">
        <div className="p-5 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-bold">How to book tickets?</h3>
          <p className="text-gray-400 text-sm mt-2">
            Select event → choose seats → checkout → get QR ticket instantly.
          </p>
        </div>

        <div className="p-5 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-bold">Refund policy?</h3>
          <p className="text-gray-400 text-sm mt-2">
            Refunds depend on event organizer rules.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}