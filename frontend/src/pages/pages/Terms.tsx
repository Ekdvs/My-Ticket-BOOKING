import { FileText, AlertTriangle, CreditCard, Ban, Scale, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import  Footer from "../components/Footer";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing or using MyTickets, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services. These terms apply to all users including browsers, vendors, customers, merchants, and contributors of content.",
  },
  {
    icon: CreditCard,
    title: "Ticket Purchases & Payments",
    content:
      "All ticket purchases are final unless otherwise stated. Prices are displayed in Sri Lankan Rupees (LKR) and include applicable taxes. MyTickets uses secure, PCI-compliant payment gateways. We reserve the right to cancel orders suspected of fraud. In the event of event cancellation by the organizer, refunds will be issued according to our Refund Policy.",
  },
  {
    icon: RefreshCw,
    title: "Cancellations & Refunds",
    content:
      "Refund eligibility depends on the event organizer's policy. MyTickets facilitates refund requests but does not guarantee refunds for buyer's remorse or missed events. For cancelled events, full refunds are issued within 7–14 business days. Service fees may be non-refundable. Please review the specific event's refund terms before purchasing.",
  },
  {
    icon: Ban,
    title: "Prohibited Activities",
    content:
      "You may not use MyTickets to resell tickets above face value (scalping), create fake accounts, abuse promotional offers, scrape or copy our platform data, interfere with our systems, or engage in any fraudulent activity. Violations may result in permanent account suspension and legal action.",
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    content:
      "MyTickets acts as an intermediary between event organizers and ticket buyers. We are not liable for event cancellations, venue changes, or the conduct of event organizers. Our total liability to any user shall not exceed the amount paid for the specific transaction in dispute. We provide the platform 'as is' without warranty of any kind.",
  },
  {
    icon: AlertTriangle,
    title: "Changes to Terms",
    content:
      "MyTickets reserves the right to modify these terms at any time. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.",
  },
];

export default function Terms() {
  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Hero */}
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            <Scale size={14} className="text-red-400" />
            <span className="text-xs text-red-400 font-semibold tracking-wider uppercase">Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Terms & Conditions</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Please read these terms carefully before using MyTickets. They govern your use of our platform and services.
          </p>
          <p className="text-xs text-gray-600 mt-6">Effective Date: January 1, 2025 · Governed by Sri Lankan Law</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
        {sections.map(({ icon: Icon, title, content }, i) => (
          <div key={title} className="bg-gray-900 border border-white/5 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={20} className="text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg font-bold text-white">{title}</h2>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-sm">
            For legal inquiries, contact us at{" "}
            <a href="mailto:legal@mytickets.lk" className="text-orange-400 hover:underline">legal@mytickets.lk</a>
          </p>
          <p className="text-gray-600 text-xs mt-2">MyTickets (Pvt) Ltd · Colombo, Sri Lanka</p>
        </div>
      </div>
    </div>
    <Footer/>
    </> 
  );
}