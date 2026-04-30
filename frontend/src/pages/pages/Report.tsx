import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Report = () => {
  const [form, setForm] = useState({ type: "", description: "", email: "", screenshot: null });
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    "Bug / Technical Error",
    "Payment Failed",
    "Incorrect Event Information",
    "Ticket Not Received",
    "Fraudulent Listing",
    "Content Violation",
    "Accessibility Issue",
    "Other",
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-300">
        <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-red-400 text-sm">⚠</span>
              <span className="text-xs text-red-400 font-semibold tracking-wider uppercase">Report an Issue</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Report a Problem</h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Help us improve MyTickets by reporting bugs, errors, or any issues you encounter.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16">
          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-white font-black text-2xl mb-2">Report Submitted!</h3>
              <p className="text-gray-400 mb-2">Your report has been logged. Our team will investigate and follow up within 24 hours.</p>
              <p className="text-gray-600 text-sm">Reference: #RPT-{Math.floor(Math.random() * 90000) + 10000}</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-orange-400 text-sm hover:underline">Submit another report</button>
            </div>
          ) : (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 space-y-5">
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Issue Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50"
                >
                  <option value="">Select issue type</option>
                  {issueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Your Email (for updates)</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5 block">Describe the Issue *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What happened? What were you trying to do? Please be as specific as possible..."
                  rows={6}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>

              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">📎 Drag & drop a screenshot here, or click to upload</p>
                <p className="text-gray-700 text-xs mt-1">PNG, JPG up to 5MB</p>
              </div>

              <button
                onClick={() => form.type && form.description && setSubmitted(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Submit Report
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Report;