import { useState } from "react";
import { HelpCircle, ChevronDown, Ticket, CreditCard, RefreshCw, User } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const categories = [
  {
    id: "booking",
    icon: Ticket,
    label: "Booking",
    faqs: [
      {
        q: "How do I purchase a ticket?",
        a: "Browse events on our platform, select your desired event, choose your seats or ticket type, and proceed to checkout. You'll receive a confirmation email with your e-ticket immediately after payment.",
      },
      {
        q: "Can I buy tickets for someone else?",
        a: "Yes! During checkout, you can enter the attendee's name and details. The ticket will be issued in their name. Just ensure the correct name is entered as it may need to match a valid ID at the venue.",
      },
      {
        q: "How do I access my tickets?",
        a: "Your tickets are available in your MyTickets dashboard under 'My Tickets'. You can download the PDF, show the QR code on your phone, or get it emailed to you.",
      },
      {
        q: "Is there a booking fee?",
        a: "A small service fee is applied to each ticket purchase to cover payment processing and platform maintenance. The fee amount is displayed clearly before you confirm your order.",
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    label: "Payment",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We accept Visa, Mastercard, American Express, PayHere, FriMi, Dialog Genie, and bank transfers for selected events. All transactions are secured with 256-bit SSL encryption.",
      },
      {
        q: "Is my payment information safe?",
        a: "Absolutely. We never store your card details on our servers. All payments are processed through PCI-DSS compliant gateways. Your financial data is always safe with us.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payments can be declined due to insufficient funds, incorrect card details, or bank restrictions on online transactions. Try a different card or contact your bank. You can also reach our support team for help.",
      },
    ],
  },
  {
    id: "refund",
    icon: RefreshCw,
    label: "Refunds",
    faqs: [
      {
        q: "Can I get a refund on my ticket?",
        a: "Refund eligibility depends on the event organizer's policy, which is stated on the event page. For cancelled events, full refunds are automatically processed within 7–14 business days.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are typically processed within 7–14 business days after approval. The time for funds to appear in your account depends on your bank or payment provider.",
      },
      {
        q: "Can I transfer my ticket to someone else?",
        a: "Some events allow ticket transfers. If enabled, you can transfer your ticket from the 'My Tickets' section in your dashboard. The recipient will need a MyTickets account.",
      },
    ],
  },
  {
    id: "account",
    icon: User,
    label: "Account",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' on the top right, enter your name, email, and password. You can also sign up using your Google or Facebook account for faster access.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a password reset link within a few minutes. Check your spam folder if you don't see it.",
      },
      {
        q: "How do I delete my account?",
        a: "You can request account deletion from Settings > Account > Delete Account. Note that deleting your account removes all your data and purchase history permanently.",
      },
    ],
  },
];

type FAQItemProps = {
  q: string;
  a: string;
};

function FAQItem({ q, a }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 mt-0.5 text-orange-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-gray-400 text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("booking");
  const active = categories.find((c) => c.id === activeCategory);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-300">
        {/* Hero */}
        <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <HelpCircle size={14} className="text-orange-400" />
              <span className="text-xs text-orange-400 font-semibold tracking-wider uppercase">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Find quick answers to the most common questions about MyTickets.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-900 border border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="bg-gray-900 border border-white/5 rounded-2xl px-8">
            {active?.faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-10 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-lg mb-2">Still need help?</h3>
            <p className="text-gray-400 text-sm mb-4">Our support team is available 24/7 to assist you.</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}