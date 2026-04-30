import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Book, ChevronRight, MessageSquare, Search, Video, Zap } from "lucide-react";

const helpCategories = [
  { icon: "🎫", title: "Buying Tickets", count: 12, link: "/faq#booking" },
  { icon: "💳", title: "Payments & Billing", count: 8, link: "/faq#payment" },
  { icon: "🔄", title: "Refunds & Cancellations", count: 6, link: "/faq#refund" },
  { icon: "👤", title: "My Account", count: 9, link: "/faq#account" },
  { icon: "📱", title: "Mobile App", count: 5, link: "/faq" },
  { icon: "🎟️", title: "Event Organizers", count: 14, link: "/faq" },
];

const popularArticles = [
  "How to download my e-ticket",
  "Changing or cancelling a booking",
  "What if my ticket doesn't scan at the venue?",
  "How to request a refund",
  "Setting up two-factor authentication",
  "Transferring a ticket to another person",
];

const HelpCenter = () => {
  const [query, setQuery] = useState("");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-300">
        {/* Hero with search */}
        <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <Book size={14} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">How can we help?</h1>

            {/* Search */}
            <div className="relative max-w-lg mx-auto mt-8">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full bg-gray-800 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">
          {/* Categories */}
          <div>
            <h2 className="text-white font-black text-xl mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {helpCategories.map(({ icon, title, count }) => (
                <button
                  key={title}
                  className="bg-gray-900 border border-white/5 rounded-2xl p-5 text-left hover:border-orange-500/30 transition-colors group"
                >
                  <span className="text-2xl mb-3 block">{icon}</span>
                  <p className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">{title}</p>
                  <p className="text-gray-600 text-xs mt-1">{count} articles</p>
                </button>
              ))}
            </div>
          </div>

          {/* Popular articles */}
          <div>
            <h2 className="text-white font-black text-xl mb-6">Popular Articles</h2>
            <div className="bg-gray-900 border border-white/5 rounded-2xl divide-y divide-white/5">
              {popularArticles.map((article) => (
                <button
                  key={article}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm text-gray-300 group-hover:text-white">{article}</span>
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, title: "Live Chat", desc: "Chat with us now", color: "orange" },
              { icon: Video, title: "Video Tutorial", desc: "Watch how-to guides", color: "blue" },
              { icon: Zap, title: "Quick Tips", desc: "Get instant answers", color: "green" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className={`bg-${color}-500/10 border border-${color}-500/20 rounded-2xl p-6 text-center`}
              >
                <Icon size={24} className={`text-${color}-400 mx-auto mb-3`} />
                <p className="text-white font-bold text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;