import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// ✅ TYPES
type FooterLink = {
  label: string;
  path: string;
};

type AccordionSectionProps = {
  heading: string;
  links: FooterLink[];
};

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Explore: [
    { label: "Events", path: "/events?category=EVENT" },
    { label: "Movies", path: "/events?category=MOVIE" },
    { label: "Theatre", path: "/events?category=THEATRE" },
    { label: "Sports", path: "/events?category=SPORT" },
    { label: "Holidays", path: "/events?category=HOLIDAY" },
    { label: "Foods", path: "/events?category=FOOD" },
    { label: "Deals", path: "/" },
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

// ✅ FIXED TYPES HERE
function AccordionSection({ heading, links }: AccordionSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 md:border-none">
      <button
        className="w-full flex items-center justify-between px-5 py-4 md:px-0 md:pb-3 md:pt-0 md:cursor-default"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
          {heading}
        </span>
        <ChevronDown
          size={16}
          className={`text-orange-400 transition-transform duration-300 md:hidden ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:!max-h-none md:overflow-visible ${open ? "max-h-96" : "max-h-0"
          }`}
      >
        <ul className="grid grid-cols-2 gap-x-3 gap-y-3 px-5 pb-4 md:px-0 md:pb-0 md:grid-cols-1 md:gap-y-2.5">
          {links.map((link: FooterLink) => (
            <li key={link.label}>
              <Link
                to={link.path}
                className="text-sm text-gray-400 hover:text-orange-400 flex items-center gap-1.5 group transition-colors"
              >
                <span className="w-0 group-hover:w-3 overflow-hidden transition-all text-orange-400 text-base leading-none">
                  ›
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

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
      <div className="absolute top-0 left-0 w-72 h-56 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative border-b border-white/5 bg-gradient-to-r from-orange-950/30 to-red-950/20">
        <div className="max-w-7xl mx-auto px-5 py-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="mb-5 sm:mb-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-1">
              Stay in the loop
            </p>
            <h3 className="text-xl font-black text-white leading-tight">
              Never miss an event
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Early bird deals &amp; exclusive offers.
            </p>
          </div>

          <div className="flex gap-2 sm:shrink-0">
            {subscribed ? (
              <div className="flex-1 sm:flex-none px-4 py-2.5 bg-green-500/15 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium text-center">
                ✓ You're subscribed!
              </div>
            ) : (
              <>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-orange-500/40 focus:outline-none px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  className="shrink-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all active:scale-95"
                >
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="md:px-5 md:py-14 md:grid md:grid-cols-4 md:gap-10">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <AccordionSection
              key={heading}
              heading={heading}
              links={links}
            />
          ))}
        </div>

        <div className="px-5 py-7 md:py-0 md:pb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all"
              >
                <Icon size={14} />
                <span>{label}</span>
              </a>
            ))}
          </div>

        </div>
        <p className="text-center text-sm text-gray-500 ">
          &copy; {new Date().getFullYear()} Ticket Booking. All rights reserved.
        </p>
        <p className="text-center text-xs text-gray-400 mb-6 tracking-wide">
          Built with ❤️ by ekdvs
        </p>
      </div>
    </footer>
  );
}