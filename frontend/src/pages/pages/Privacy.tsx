import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      "Personal identification information (name, email address, phone number)",
      "Payment and billing information (processed securely via encrypted gateways)",
      "Booking and ticket purchase history",
      "Device information, IP address, and browser type",
      "Usage data and interaction with our platform",
    ],
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: [
      "To process ticket bookings and send confirmation emails",
      "To provide customer support and resolve disputes",
      "To send promotional offers and event recommendations (with your consent)",
      "To improve our platform, features, and user experience",
      "To comply with legal obligations and prevent fraud",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "All data is encrypted using industry-standard TLS/SSL protocols",
      "Payment information is never stored on our servers",
      "We conduct regular security audits and vulnerability assessments",
      "Access to personal data is strictly limited to authorized personnel",
      "We maintain detailed logs of all data access and modifications",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "Right to access your personal data at any time",
      "Right to correct inaccurate or outdated information",
      "Right to request deletion of your account and data",
      "Right to withdraw consent for marketing communications",
      "Right to data portability — export your data in a readable format",
    ],
  },
  {
    icon: Bell,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to keep you logged in and secure",
      "Analytics cookies help us understand how users navigate MyTickets",
      "Marketing cookies personalize ads shown to you on other platforms",
      "You can manage cookie preferences in your browser settings at any time",
      "Third-party tools like Google Analytics may process anonymized data",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Hero */}
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Shield size={14} className="text-orange-400" />
            <span className="text-xs text-orange-400 font-semibold tracking-wider uppercase">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Your Privacy Matters</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            We are committed to protecting your personal information and being transparent about how we use it.
          </p>
          <p className="text-xs text-gray-600 mt-6">Last updated: January 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-gray-900 border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <ul className="space-y-3">
              {content.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Have questions about your privacy?</h3>
          <p className="text-gray-400 text-sm mb-4">Our Data Protection Officer is here to help.</p>
          <a href="mailto:privacy@mytickets.lk" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold">
            Contact Privacy Team
          </a>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}