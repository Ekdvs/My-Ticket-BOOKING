import { ArrowRight, Briefcase,MapPin } from 'lucide-react';
import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export function Careers() {
    const jobs = [
  { title: "Senior React Developer", dept: "Engineering", type: "Full-time", location: "Colombo (Hybrid)" },
  { title: "Product Designer (UI/UX)", dept: "Design", type: "Full-time", location: "Remote" },
  { title: "Event Partnerships Manager", dept: "Business", type: "Full-time", location: "Colombo" },
  { title: "Customer Support Specialist", dept: "Support", type: "Part-time", location: "Remote" },
  { title: "Marketing & Growth Lead", dept: "Marketing", type: "Full-time", location: "Colombo" },
  { title: "QA Engineer", dept: "Engineering", type: "Full-time", location: "Hybrid" },
];

const deptColors = {
  Engineering: "bg-blue-500/20 text-blue-400",
  Design: "bg-purple-500/20 text-purple-400",
  Business: "bg-orange-500/20 text-orange-400",
  Support: "bg-green-500/20 text-green-400",
  Marketing: "bg-red-500/20 text-red-400",
};
  return (
    <><Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Briefcase size={14} className="text-orange-400" />
            <span className="text-xs text-orange-400 font-semibold tracking-wider uppercase">Careers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Join Our Team</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Help us build Sri Lanka's favourite ticketing platform. We're always looking for passionate people.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["🏠 Remote Friendly", "🏥 Health Insurance", "🎟️ Free Event Tickets", "📚 Learning Budget"].map((perk) => (
            <div key={perk} className="bg-gray-900 border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-300">{perk}</p>
            </div>
          ))}
        </div>

        {/* Open positions */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">Open Positions ({jobs.length})</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.title} className="bg-gray-900 border border-white/5 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 hover:border-orange-500/30 transition-colors group">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm group-hover:text-orange-400 transition-colors">{job.title}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptColors[job.dept]}`}>{job.dept}</span>
                    <span className="text-xs text-gray-500">{job.type}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{job.location}</span>
                  </div>
                </div>
                <button className="flex-shrink-0 text-sm text-orange-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Apply <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Don't see the right role?</h3>
          <p className="text-gray-400 text-sm mb-4">Send us your CV and we'll keep you in mind for future openings.</p>
          <a href="mailto:careers@mytickets.lk" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold">
            Send Open Application
          </a>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
