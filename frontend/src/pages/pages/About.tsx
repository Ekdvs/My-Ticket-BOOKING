import { useState } from "react";
import {
  Ticket, Globe, Award, Users, MapPin, TrendingUp,
  Heart, Zap, Shield, Star, ArrowRight, Quote,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "320K+",  label: "Happy Customers",    icon: Users      },
  { value: "5,000+", label: "Events Listed",       icon: Ticket     },
  { value: "25",     label: "Cities Covered",      icon: MapPin     },
  { value: "500+",   label: "Event Organizers",    icon: Globe      },
];

// ─── Milestones / Timeline ────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2019",
    title: "Founded in Colombo",
    desc: "Two friends, one mission — make ticket buying in Sri Lanka effortless. Launched with 12 events in Colombo.",
  },
  {
    year: "2020",
    title: "Survived the Pandemic",
    desc: "Pivoted to virtual events and livestream ticketing. Helped 80+ organizers move their events online.",
  },
  {
    year: "2021",
    title: "Expanded Island-Wide",
    desc: "Launched in Kandy, Galle, Negombo & Jaffna. Crossed 50,000 registered users.",
  },
  {
    year: "2022",
    title: "Mobile App Launch",
    desc: "Released iOS & Android apps. Introduced QR e-tickets and instant booking confirmations.",
  },
  {
    year: "2023",
    title: "Award & Series A",
    desc: "Won Best Tech Startup at SLASSCOM 2023. Raised Series A funding. Crossed 200K customers.",
  },
  {
    year: "2024",
    title: "320K+ Customers",
    desc: "Launched group booking, gift cards, and the organizer analytics dashboard. Operating in 25+ cities.",
  },
];

// ─── Team ─────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "Amal Silva",
    role: "Co-Founder & CEO",
    bio: "Former product manager at Dialog. Obsessed with building things Sri Lankans actually use.",
    initials: "AS",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
  {
    name: "Priya Jayasinghe",
    role: "Co-Founder & CTO",
    bio: "CS grad from Moratuwa. Built MyTickets' entire tech stack from scratch. Coffee-powered.",
    initials: "PJ",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  {
    name: "Roshan Fernando",
    role: "Head of Marketing",
    bio: "Digital marketing veteran with 10+ years growing consumer brands across South Asia.",
    initials: "RF",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
  },
  {
    name: "Nimasha Perera",
    role: "Head of Design",
    bio: "Ex-Figma designer. Believes every pixel is a promise to the user. Dog mom.",
    initials: "NP",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10",
    text: "text-green-400",
  },
  {
    name: "Kavinda Rathnayake",
    role: "Head of Operations",
    bio: "Logistics expert who made sure 320K tickets got to the right people at the right time.",
    initials: "KR",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
  {
    name: "Dilki Wickramasinghe",
    role: "Head of Support",
    bio: "Turned our support team into the fastest-responding in Sri Lankan tech. 97% CSAT.",
    initials: "DW",
    color: "from-red-500 to-pink-500",
    bg: "bg-red-500/10",
    text: "text-red-400",
  },
  {
    name: "Sahan De Silva",
    role: "Lead Engineer",
    bio: "Architect of MyTickets' real-time seat selection engine. Open source contributor.",
    initials: "SD",
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
  },
  {
    name: "Malsha Gunasekara",
    role: "Partnerships Manager",
    bio: "Built relationships with 500+ event organizers. Knows every major venue in the country.",
    initials: "MG",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
];

// ─── Values ───────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Heart,
    title: "People First",
    desc: "Every decision — from product to policy — starts with asking 'is this good for our customers?'",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Zap,
    title: "Move Fast",
    desc: "We ship weekly, learn daily, and never let perfect be the enemy of shipped.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Build Trust",
    desc: "Secure payments, honest refunds, and transparent communication — always.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Star,
    title: "Sri Lanka First",
    desc: "We're not a copy-paste of a foreign startup. We're built from the ground up for this island.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "MyTickets changed how we sell. We went from WhatsApp chaos to a clean dashboard that actually works.",
    name: "Harsha Bandara",
    role: "Event Organizer, Colombo",
    initials: "HB",
  },
  {
    quote: "Bought tickets for three concerts this year. So easy. Arrived in seconds. No queue, no drama.",
    name: "Thisara Perera",
    role: "Regular Customer",
    initials: "TP",
  },
  {
    quote: "Customer support replied in under 10 minutes when I had an issue. That's rare in Sri Lanka.",
    name: "Sanduni Ratnayake",
    role: "MyTickets User since 2021",
    initials: "SR",
  },
];

// ─── Press logos (text-based) ─────────────────────────────────────────────────
const PRESS = ["Daily Mirror", "Colombo Telegraph", "Ada Derana", "LBO", "SLASSCOM", "Daily FT"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function About() {
  const [activeTeamMember, setActiveTeamMember] = useState(null);

  return (
    <><Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/5 min-h-[90vh] flex items-center">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[100px]" />
          {/* Geometric grid lines */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-32 relative grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
              <Ticket size={13} className="text-orange-400" />
              <span className="text-xs text-orange-400 font-bold tracking-[0.18em] uppercase">About MyTickets</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-6">
              Sri Lanka's Home<br />
              for{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-500">
                  Unforgettable
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
              </span>
              <br />Events
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              We started MyTickets in 2019 because buying tickets in Sri Lanka was broken — WhatsApp forwards, cash-only, zero guarantees. We fixed that.
            </p>

            <div className="flex gap-4 flex-wrap">
              <a
                href="#team"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Meet the Team <ArrowRight size={16} />
              </a>
              <a
                href="/events"
                className="inline-flex items-center gap-2 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors"
              >
                Browse Events
              </a>
            </div>
          </div>

          {/* Right: floating stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div
                key={label}
                className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-500/20 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange-400" />
                </div>
                <p className="text-3xl font-black text-white mb-1">{value}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STORY
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left: image-style card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/15 rounded-3xl p-10 text-center">
              <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500 mb-4">
                2019
              </div>
              <p className="text-white font-bold text-xl mb-2">Founded in Colombo</p>
              <p className="text-gray-500 text-sm">By two friends who couldn't find their tickets</p>
              <div className="mt-8 flex justify-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center">
                  <span className="text-orange-400 font-black text-xs">AS</span>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-black text-xs">PJ</span>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-yellow-900 rounded-2xl px-4 py-2 font-black text-sm rotate-3 shadow-lg">
              🏆 SLASSCOM 2023
            </div>
          </div>

          {/* Right: story text */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-3">Our Story</p>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Born from<br />Frustration,<br />Built with Purpose
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Amal missed a concert because he couldn't figure out where to buy tickets. Priya had been overbilled by a scalper. They decided enough was enough.
              </p>
              <p>
                In October 2019, working out of a Colombo co-working space, they launched the first version of MyTickets with 12 events and zero marketing budget.
              </p>
              <p>
                Today, MyTickets powers ticketing for concerts, theatre, sports, food festivals, corporate events and more — across 25+ cities, with 320,000+ customers who trust us to get them in the door.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-orange-400" />
                <span className="text-sm text-gray-300">Best Tech Startup — SLASSCOM 2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-3">Our Journey</p>
            <h2 className="text-4xl font-black text-white">Six Years of Growth</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-red-500/20 to-transparent hidden md:block" />

            <div className="space-y-10">
              {TIMELINE.map(({ year, title, desc }, i) => (
                <div
                  key={year}
                  className={`relative grid md:grid-cols-2 gap-6 md:gap-16 items-center ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-last"}`}
                >
                  {/* Content card */}
                  <div className={`bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-orange-500/20 transition-colors ${i % 2 !== 0 ? "md:text-right" : ""}`}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">{year}</span>
                    <h3 className="text-white font-black text-lg mt-1 mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-gray-950 z-10" />

                  {/* Empty column for alternating layout */}
                  <div />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-3">What Drives Us</p>
            <h2 className="text-4xl font-black text-white">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="text-white font-black text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TEAM  (#team anchor)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="team" className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-3">The People</p>
            <h2 className="text-4xl font-black text-white mb-3">Who We Are</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A tight-knit team of 30+ across Colombo and remote — engineers, designers, marketers, and event lovers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                onClick={() => setActiveTeamMember(activeTeamMember?.name === member.name ? null : member)}
                className="cursor-pointer group"
              >
                <div className={`bg-gray-900 border rounded-2xl p-6 text-center transition-all ${
                  activeTeamMember?.name === member.name
                    ? "border-orange-500/40 bg-gray-800"
                    : "border-white/5 hover:border-white/10"
                }`}>
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} p-0.5 mx-auto mb-4`}>
                    <div className={`w-full h-full rounded-full ${member.bg} flex items-center justify-center`}>
                      <span className={`font-black text-sm ${member.text}`}>{member.initials}</span>
                    </div>
                  </div>

                  <p className="text-white font-black text-sm leading-tight">{member.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{member.role}</p>

                  {/* Expanded bio */}
                  {activeTeamMember?.name === member.name && (
                    <p className="text-gray-400 text-xs mt-3 leading-relaxed border-t border-white/5 pt-3">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            Click any card to read their story
          </p>

          {/* Hiring CTA */}
          <div className="mt-12 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-black text-lg">Want to join us?</h3>
              <p className="text-gray-400 text-sm mt-1">We're always looking for passionate people who love events and tech.</p>
            </div>
            <a
              href="/careers"
              className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              See Open Roles <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-3">What People Say</p>
            <h2 className="text-4xl font-black text-white">Trusted by Sri Lanka</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, initials }) => (
              <div key={name} className="bg-gray-900 border border-white/5 rounded-2xl p-7 relative">
                <Quote size={24} className="text-orange-500/30 mb-4" />
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/15 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 font-black text-xs">{initials}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{name}</p>
                    <p className="text-gray-600 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRESS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-600 mb-10">
            Featured In & Recognised By
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {PRESS.map((name) => (
              <div
                key={name}
                className="px-6 py-3 bg-gray-900 border border-white/5 rounded-xl text-gray-500 font-bold text-sm hover:text-gray-300 hover:border-white/10 transition-all"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5 bg-gradient-to-br from-orange-600/8 to-red-600/8">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Ticket size={28} className="text-orange-400" />
            <span className="text-xl font-black text-white">MyTickets</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Ready to Experience<br />Sri Lanka's Events?
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Join 320,000+ Sri Lankans who discover, book, and enjoy events with MyTickets.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/events"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-black text-base hover:opacity-90 transition-opacity"
            >
              <Ticket size={18} />
              Browse All Events
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/5 transition-colors"
            >
              Get In Touch
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-6 flex-wrap text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-green-400" />
              <span>Growing since 2019</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-orange-400" />
              <span>Colombo, Sri Lanka</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-red-400" />
              <span>Made with love for Sri Lanka</span>
            </div>
          </div>
        </div>
      </section>

    </div>
    <Footer/>
    </>
  );
}