import { useState } from "react";
import { Cookie, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cookieTypes = [
  {
    id: "essential",
    name: "Essential Cookies",
    description: "Required for the website to function. Cannot be disabled.",
    examples: ["Session token", "CSRF protection", "Login state"],
    required: true,
    defaultOn: true,
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description: "Help us understand how you use MyTickets so we can improve the platform.",
    examples: ["Google Analytics", "Page view tracking", "Click heatmaps"],
    required: false,
    defaultOn: true,
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description: "Used to show you relevant ads and promotions on other platforms.",
    examples: ["Facebook Pixel", "Google Ads", "Retargeting"],
    required: false,
    defaultOn: false,
  },
  {
    id: "preferences",
    name: "Preference Cookies",
    description: "Remember your settings and preferences for a better experience.",
    examples: ["Language preference", "Theme setting", "Saved filters"],
    required: false,
    defaultOn: true,
  },
];

export default function Cookies() {
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(cookieTypes.map((c) => [c.id, c.defaultOn]))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const savePrefs = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-300">
        {/* Hero */}
        <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-6">
              <Cookie size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold tracking-wider uppercase">Cookie Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Cookie Settings</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              We use cookies to enhance your experience. Manage your preferences below.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
          {/* What are cookies */}
          <div className="bg-gray-900 border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-orange-400" />
              <h2 className="text-white font-bold">What are cookies?</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help websites remember
              information about your visit, making your next visit easier and the site more useful. MyTickets uses
              cookies to keep you logged in, remember your preferences, and understand how you interact with our
              platform.
            </p>
          </div>

          {/* Cookie toggles */}
          <div className="space-y-4">
            {cookieTypes.map((cookie) => (
              <div key={cookie.id} className="bg-gray-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-sm">{cookie.name}</h3>
                      {cookie.required && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{cookie.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((ex) => (
                        <span key={ex} className="text-xs bg-gray-800 text-gray-500 px-2 py-1 rounded-lg">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => !cookie.required && toggle(cookie.id)}
                    disabled={cookie.required}
                    className={`flex-shrink-0 transition-colors ${
                      cookie.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {prefs[cookie.id] ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-orange-400 font-medium">On</span>
                        <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 font-medium">Off</span>
                        <div className="w-12 h-6 bg-gray-700 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition-all" />
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Save button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setPrefs(Object.fromEntries(cookieTypes.map((c) => [c.id, false])));
                setSaved(false);
              }}
              className="px-6 py-2.5 border border-white/10 rounded-xl text-sm text-gray-400 hover:bg-white/5 transition-colors"
            >
              Reject All Optional
            </button>
            <button
              onClick={savePrefs}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                saved
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
              }`}
            >
              {saved ? "✓ Preferences Saved!" : "Save My Preferences"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}