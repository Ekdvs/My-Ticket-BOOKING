import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Accessibility = () => {
      const features = [
    {
      emoji: "🔤",
      title: "Screen Reader Support",
      desc: "MyTickets is fully compatible with NVDA, JAWS, and VoiceOver screen readers. All interactive elements include descriptive ARIA labels.",
    },
    {
      emoji: "⌨️",
      title: "Keyboard Navigation",
      desc: "Every feature on MyTickets is accessible via keyboard. Tab through menus, book tickets, and manage your account without a mouse.",
    },
    {
      emoji: "🎨",
      title: "High Contrast Mode",
      desc: "Enable high contrast mode in your OS settings. Our platform respects system-level contrast preferences automatically.",
    },
    {
      emoji: "🔡",
      title: "Adjustable Text Size",
      desc: "Our layout is fully responsive to browser font-size settings. Increase your browser's text size and MyTickets adapts gracefully.",
    },
    {
      emoji: "🎥",
      title: "Video Captions",
      desc: "All video content on MyTickets includes closed captions and transcripts for users who are deaf or hard of hearing.",
    },
    {
      emoji: "🖼️",
      title: "Image Descriptions",
      desc: "Every image on our platform includes descriptive alt text so screen reader users can understand all visual content.",
    },
  ];
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-purple-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-purple-400 text-sm">♿</span>
            <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase">Accessibility</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Accessible to Everyone</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            MyTickets is designed so that everyone, regardless of ability, can browse and book tickets independently.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ emoji, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <span className="text-3xl mb-4 block">{emoji}</span>
              <h3 className="text-white font-bold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-3">WCAG 2.1 Compliance</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            MyTickets strives to meet WCAG 2.1 Level AA standards. We conduct regular accessibility audits and work with users with disabilities to identify and fix issues.
          </p>
          <p className="text-gray-400 text-sm">
            If you encounter an accessibility barrier, please{" "}
            <a href="/contact" className="text-purple-400 hover:underline">report it here</a>{" "}
            or email us at{" "}
            <a href="mailto:accessibility@mytickets.lk" className="text-purple-400 hover:underline">accessibility@mytickets.lk</a>.
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Accessibility
