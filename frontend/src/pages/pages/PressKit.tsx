import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ExternalLink } from 'lucide-react';

const PressKit = () => {
    const downloads = [
    { name: "Logo Pack (SVG + PNG)", size: "2.4 MB", type: "ZIP" },
    { name: "Brand Guidelines PDF", size: "8.1 MB", type: "PDF" },
    { name: "Product Screenshots", size: "14 MB", type: "ZIP" },
    { name: "Executive Headshots", size: "6.8 MB", type: "ZIP" },
    { name: "Company Fact Sheet", size: "0.9 MB", type: "PDF" },
  ];
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-gray-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-gray-500/10 border border-gray-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-gray-400 text-sm">📰</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Press Kit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Press & Media</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Everything journalists and media partners need to cover MyTickets.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Quick facts */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8">
          <h2 className="text-white font-black text-xl mb-6">Company at a Glance</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Founded", "2019, Colombo, Sri Lanka"],
              ["Founders", "Amal Silva & Priya Jayasinghe"],
              ["Category", "Event Ticketing & Discovery"],
              ["Reach", "25+ cities across Sri Lanka"],
              ["Customers", "320,000+ registered users"],
              ["Events Hosted", "5,000+ active listings"],
            ].map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <span className="text-gray-600 flex-shrink-0">{key}:</span>
                <span className="text-gray-300">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">Download Assets</h2>
          <div className="space-y-3">
            {downloads.map(({ name, size, type }) => (
              <div key={name} className="bg-gray-900 border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${type === "PDF" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {type}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-gray-600 text-xs">{size}</p>
                  </div>
                </div>
                <button className="text-orange-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Download <ExternalLink size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media contact */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-2">Media Contact</h3>
          <p className="text-gray-400 text-sm mb-1">For press inquiries, interviews, and partnerships:</p>
          <a href="mailto:press@mytickets.lk" className="text-orange-400 hover:underline text-sm font-semibold">press@mytickets.lk</a>
          <p className="text-gray-600 text-xs mt-2">We typically respond to press inquiries within 24 hours.</p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default PressKit
