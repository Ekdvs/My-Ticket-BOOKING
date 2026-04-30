import { useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, ArrowRight, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const FOOTER_LINKS = {
  Explore: [
    { label: "Events", path: "/events?category=EVENT" },
    { label: "Movies", path: "/events?category=MOVIE" },
    { label: "Theatre", path: "/events?category=THEATRE" },
    { label: "Sports", path: "/events?category=SPORT" },
    { label: "Holidays", path: "/events?category=HOLIDAY" },
    { label: "Foods", path: "/events?category=FOOD" },
    { label: "Deals", path: "/deals" },
  ],

  Account: [
    { label: "My Tickets", path: "/dashboard" },
    { label: "My Account", path: "/dashboard" },
    { label: "Wishlist", path: "/dashboard" },
    { label: "Refund Policy", path: "/dashboard" },
    { label: "Gift Cards", path: "/dashboard" },
  ],

  Company: [
    { label: "About Us", path: "/about" },
    { label: "Who We Are", path: "/about#team" },
    { label: "Careers", path: "/careers" },
    { label: "Blog", path: "/blog" },
    { label: "Press Kit", path: "/press" },
  ],

  Support: [
    { label: "FAQ", path: "/faq" },
    { label: "Contact Us", path: "/contact" },
    { label: "Help Center", path: "/help" },
    { label: "Report Issue", path: "/report" },
    { label: "Accessibility", path: "/accessibility" },
  ],
};

const SOCIALS = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-96 h-64 bg-orange-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl" />

      {/* Newsletter */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold text-orange-400 uppercase tracking-[0.2em]">
              Stay in the Loop
            </p>
            <h3 className="text-xl font-black text-white">Never miss an event</h3>
            <p className="text-sm text-gray-500">
              Get early bird deals and exclusive offers.
            </p>
          </div>

          <div className="flex gap-2">
            {subscribed ? (
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
                ✓ Subscribed!
              </div>
            ) : (
              <>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-white"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN LINKS */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                {heading}
              </h3>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-orange-400 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all text-orange-400">
                        ›
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BRAND + SOCIAL */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-6 border-t border-white/5 pt-8">
          <div>
            <div className="flex items-center gap-2">
              <Ticket className="text-white" />
              <span className="font-bold text-white">MyTickets</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Sri Lanka’s trusted ticket platform.
            </p>
          </div>

          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href={label === "Facebook" ? "https://facebook.com" : label === "Instagram" ? "https://instagram.com" : label === "Twitter" ? "https://twitter.com" : "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="text-orange-400 font-semibold">MyTickets</span>. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-orange-400">Privacy</Link>
            <Link to="/terms" className="hover:text-orange-400">Terms</Link>
            <Link to="/cookies" className="hover:text-orange-400">Cookies</Link>
          </div>

          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart size={11} className="text-red-500 fill-red-500" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}