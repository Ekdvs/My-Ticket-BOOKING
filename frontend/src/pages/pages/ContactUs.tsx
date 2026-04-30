import { useState } from "react";
import type { ChangeEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle, ChevronRight } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── TYPES ────────────────────────────────────────────────────────────────
type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  priority: "normal" | "urgent";
};

type ErrorState = Partial<Record<keyof FormState, string>>;

// ─── Contact info cards ───────────────────────────────────────────────────
const INFO_CARDS = [
  {
    icon: Mail,
    label: "Email Us",
    primary: "support@mytickets.lk",
    secondary: "We reply within 2 hours",
    action: "mailto:support@mytickets.lk",
    color: "orange",
  },
  {
    icon: Phone,
    label: "Call Us",
    primary: "+94 11 234 5678",
    secondary: "Mon – Sun, 8 am – 10 pm",
    action: "tel:+94112345678",
    color: "green",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    primary: "42 Galle Road, Colombo 03",
    secondary: "Sri Lanka",
    action: "https://maps.google.com",
    color: "blue",
  },
  {
    icon: Clock,
    label: "Support Hours",
    primary: "24/7 Online Support",
    secondary: "Tickets answered within 24h",
    action: null,
    color: "purple",
  },
] as const;

const ICON_COLORS: Record<string, string> = {
  orange: "bg-orange-500/10 text-orange-400",
  green: "bg-green-500/10 text-green-400",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
};

const SUBJECTS = [
  "Select a topic",
  "Booking Issue",
  "Payment Problem",
  "Refund Request",
  "Event Information",
  "Technical Issue",
  "Partnership / Media",
  "Other",
];

const SOCIALS = [
  { icon: FaWhatsapp, label: "WhatsApp", handle: "+94 77 123 4567", href: "#", color: "text-green-400" },
  { icon: FaFacebook, label: "Facebook", handle: "MyTickets.LK", href: "#", color: "text-blue-400" },
  { icon: FaInstagram, label: "Instagram", handle: "@mytickets.lk", href: "#", color: "text-pink-400" },
];

const FAQ_TEASER = [
  "How do I download my e-ticket?",
  "Can I get a refund for a cancelled event?",
  "How do I transfer my ticket to someone else?",
  "What payment methods do you accept?",
];

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    priority: "normal",
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // ─── VALIDATION ─────────────────────────────────────────────────────────
  const validate = (): ErrorState => {
    const e: ErrorState = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.subject || form.subject === SUBJECTS[0]) e.subject = "Please select a topic";
    if (!form.message.trim() || form.message.length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1400);
  };

  const setField =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
    };

  // ─── SUCCESS STATE ──────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gray-900 border border-white/5 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-400" />
          </div>

          <h2 className="text-white font-black text-2xl mb-2">Message Sent!</h2>

          <p className="text-gray-400 text-sm mb-1">
            Thanks, <span className="text-white font-semibold">{form.name}</span>.
          </p>

          <p className="text-gray-500 text-sm mb-6">
            We'll reply to <span className="text-orange-400">{form.email}</span>.
          </p>

          <div className="bg-gray-800 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">
              Reference Number
            </p>
            <p className="text-white font-mono font-bold text-lg">
              #MT-{Date.now().toString(36).toUpperCase().slice(-6)}
            </p>
          </div>

          <button
            onClick={() => {
              setSent(false);
              setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                priority: "normal",
              });
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-300">

        {/* ── HERO ──────────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/8 via-transparent to-red-600/8 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <MessageSquare size={13} className="text-orange-400" />
              <span className="text-xs text-orange-400 font-bold tracking-[0.18em] uppercase">Contact Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              We'd Love to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Hear From You
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Have a question, issue, or feedback? Reach out via the form below or any of our channels.
            </p>
          </div>
        </div>

        {/* ── INFO CARDS ────────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INFO_CARDS.map(({ icon: Icon, label, primary, secondary, action, color }) => {
              const Tag = action ? "a" : "div";
              return (
                <Tag
                  key={label}
                  href={action || undefined}
                  target={action?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`bg-gray-900 border border-white/5 rounded-2xl p-5 text-center ${action ? "hover:border-orange-500/30 transition-colors cursor-pointer group" : ""}`}
                >
                  <div className={`w-11 h-11 ${ICON_COLORS[color]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 mb-1">{label}</p>
                  <p className={`text-white text-sm font-bold leading-snug ${action ? "group-hover:text-orange-400 transition-colors" : ""}`}>
                    {primary}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{secondary}</p>
                </Tag>
              );
            })}
          </div>
        </div>

        {/* ── FORM + SIDEBAR ────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">

          {/* FORM */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-5">
              <div>
                <h2 className="text-white font-black text-xl">Send us a message</h2>
                <p className="text-gray-500 text-sm mt-1">Fill in the form and we'll get back to you within 2 hours.</p>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 block mb-1.5">
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Kasun Perera"
                    className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                      errors.name ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-orange-500/50"
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 block mb-1.5">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <input
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="kasun@email.com"
                    className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                      errors.email ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-orange-500/50"
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 block mb-1.5">
                    Phone <span className="text-gray-700">(optional)</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder="+94 77 000 0000"
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 block mb-1.5">
                    Topic <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={setField("subject")}
                    className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                      errors.subject ? "border-red-500/60" : "border-white/10 focus:border-orange-500/50"
                    }`}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} disabled={s === SUBJECTS[0]}>{s}</option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 block mb-2">Priority</label>
                <div className="flex gap-2">
                  {(
                    [
                      { val: "normal" as const, label: "Normal", dot: "⚪" },
                      { val: "urgent" as const, label: "Urgent", dot: "🔴" },
                    ] as const
                  ).map(({ val, label, dot }) => (
                    <button
                      key={val}
                      onClick={() => setForm((f) => ({ ...f, priority: val }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        form.priority === val
                          ? val === "urgent"
                            ? "bg-red-500/20 border border-red-500/40 text-red-400"
                            : "bg-orange-500/20 border border-orange-500/40 text-orange-400"
                          : "bg-gray-800 border border-white/10 text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {dot} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    Message <span className="text-orange-500">*</span>
                  </label>
                  <span className={`text-xs ${form.message.length < 20 ? "text-gray-600" : "text-green-400"}`}>
                    {form.message.length} chars {form.message.length < 20 ? `(${20 - form.message.length} more)` : "✓"}
                  </span>
                </div>
                <textarea
                  value={form.message}
                  onChange={setField("message")}
                  placeholder="Describe your issue or question in detail. The more specific you are, the faster we can help you."
                  rows={5}
                  className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none resize-none transition-colors ${
                    errors.message ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-orange-500/50"
                  }`}
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={sending}
                className={`w-full py-3.5 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all ${
                  sending
                    ? "bg-gray-700 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 active:scale-[0.98]"
                }`}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-600">
                By submitting, you agree to our{" "}
                <a href="/privacy" className="text-orange-400 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="md:col-span-2 space-y-6">

            {/* Social channels */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-black text-sm mb-4">Chat with us on</h3>
              <div className="space-y-3">
                {SOCIALS.map(({ icon: Icon, label, handle, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center justify-between group bg-gray-800 border border-white/5 hover:border-white/10 rounded-xl px-4 py-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={color} />
                      <div>
                        <p className="text-white text-xs font-bold">{label}</p>
                        <p className="text-gray-500 text-xs">{handle}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-black text-sm mb-4">Response Times</h3>
              <div className="space-y-3">
                {[
                  { channel: "Live Chat",      time: "Under 5 min",    dot: "bg-green-400"  },
                  { channel: "Email",          time: "Under 2 hours",  dot: "bg-orange-400" },
                  { channel: "Phone",          time: "Immediate",      dot: "bg-green-400"  },
                  { channel: "Support Ticket", time: "Under 24 hours", dot: "bg-yellow-400" },
                ].map(({ channel, time, dot }) => (
                  <div key={channel} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                      <span className="text-gray-400 text-sm">{channel}</span>
                    </div>
                    <span className="text-white text-xs font-semibold">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ teaser */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-black text-sm mb-1">Quick Answers</h3>
              <p className="text-gray-500 text-xs mb-4">Check our FAQ for instant help</p>
              <div className="space-y-2">
                {FAQ_TEASER.map((q) => (
                  <a
                    key={q}
                    href="/faq"
                    className="flex items-center justify-between gap-2 text-xs text-gray-400 hover:text-orange-400 group transition-colors py-1"
                  >
                    <span>{q}</span>
                    <ChevronRight size={12} className="flex-shrink-0 text-gray-600 group-hover:text-orange-400" />
                  </a>
                ))}
              </div>
              <a href="/faq" className="block mt-4 text-center text-xs text-orange-400 font-bold hover:underline">
                View all FAQs →
              </a>
            </div>
          </div>
        </div>

        {/* ── OFFICE STRIP ──────────────────────────────────────────────────────── */}
        <div className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">Our Office</p>
              <h3 className="text-white font-black text-xl">MyTickets HQ</h3>
              <p className="text-gray-400 text-sm mt-1">42 Galle Road, Colombo 03, Sri Lanka</p>
              <p className="text-gray-500 text-xs mt-1">Open Mon – Fri, 9 am – 6 pm</p>
            </div>
            <a
              href="https://maps.google.com/?q=Galle+Road+Colombo+03"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gray-800 border border-white/10 hover:border-orange-500/30 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <MapPin size={15} className="text-orange-400" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}