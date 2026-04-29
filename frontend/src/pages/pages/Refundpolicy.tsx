import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from "lucide-react";

const refundTiers = [
  {
    label: "Full Refund",
    condition: "Event cancelled by organizer",
    timeline: "7–14 business days",
    coverage: "Ticket price + booking fee",
    color: "green",
    icon: CheckCircle,
  },
  {
    label: "Full Refund",
    condition: "Cancellation 48+ hours before event",
    timeline: "7–14 business days",
    coverage: "Ticket price only (booking fee excluded)",
    color: "green",
    icon: CheckCircle,
  },
  {
    label: "50% Refund",
    condition: "Cancellation 24–48 hours before event",
    timeline: "7–14 business days",
    coverage: "50% of ticket price",
    color: "yellow",
    icon: AlertCircle,
  },
  {
    label: "No Refund",
    condition: "Cancellation less than 24 hours before event",
    timeline: "N/A",
    coverage: "Not applicable",
    color: "red",
    icon: XCircle,
  },
];

const colorMap = {
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    badge: "bg-green-500/20 text-green-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
};

const steps = [
  { step: "01", title: "Go to My Tickets", desc: "Log in to your account and navigate to My Tickets in your dashboard." },
  { step: "02", title: "Select the Booking", desc: "Find the ticket you want to refund and click 'Request Refund'." },
  { step: "03", title: "State Your Reason", desc: "Choose a reason from the dropdown and add any additional notes." },
  { step: "04", title: "Submit & Wait", desc: "Submit your request. Our team reviews it within 1–2 business days." },
  { step: "05", title: "Refund Processed", desc: "Once approved, your refund is returned to your original payment method." },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Hero */}
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <RefreshCw size={14} className="text-green-400" />
            <span className="text-xs text-green-400 font-semibold tracking-wider uppercase">Refund Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Refund Policy</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            We want you to feel confident buying tickets. Here's exactly when and how refunds work.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">
        {/* Refund tiers */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">Refund Eligibility</h2>
          <div className="space-y-4">
            {refundTiers.map(({ label, condition, timeline, coverage, color, icon: Icon }) => {
              const c = colorMap[color];
              return (
                <div key={condition} className={`${c.bg} border ${c.border} rounded-2xl p-6 flex items-start gap-5`}>
                  <Icon size={24} className={`${c.text} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{label}</span>
                      <p className="text-white font-semibold text-sm">{condition}</p>
                    </div>
                    <div className="flex gap-6 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-400">{timeline}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-400">{coverage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to request */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">How to Request a Refund</h2>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="bg-gray-900 border border-white/5 rounded-2xl p-6 flex items-start gap-5">
                <span className="text-2xl font-black text-orange-500/50 font-mono flex-shrink-0">{step}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{title}</p>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important notes */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8">
          <h2 className="text-white font-bold text-lg mb-4">Important Notes</h2>
          <ul className="space-y-3">
            {[
              "Refund eligibility may vary by event — always check the specific event's refund policy before purchasing.",
              "Digital gift cards and promotional credit are non-refundable.",
              "Booking service fees are non-refundable unless the event was cancelled by the organizer.",
              "Refunds are returned to the original payment method — we cannot refund to a different account.",
              "MyTickets is not responsible for refunds on tickets purchased through third-party resellers.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Need help with a refund?</h3>
          <p className="text-gray-400 text-sm mb-4">Our support team is ready to assist you.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}