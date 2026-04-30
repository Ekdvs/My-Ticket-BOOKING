
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight } from 'lucide-react';

type TagColor = "orange" | "blue" | "purple" | "green" | "red" | "yellow";
const Blog = () => {
    const posts: {
    tag: string;
    date: string;
    title: string;
    excerpt: string;
    readTime: string;
    color: TagColor;
  }[] =  [
  {
    tag: "Event Tips",
    date: "Jan 15, 2025",
    title: "10 Must-Attend Events in Colombo This February",
    excerpt: "From live concerts to food festivals, here's your guide to the best events coming up in the capital.",
    readTime: "4 min read",
    color: "orange",
  },
  {
    tag: "Platform Update",
    date: "Jan 10, 2025",
    title: "Introducing Group Booking: Book Tickets for Your Crew",
    excerpt: "You can now book up to 20 tickets at once and split the bill with friends using our new group feature.",
    readTime: "2 min read",
    color: "blue",
  },
  {
    tag: "Organizer Guide",
    date: "Jan 5, 2025",
    title: "How to Sell More Tickets Using MyTickets Analytics",
    excerpt: "Dive into our new organizer dashboard and learn how to use data to optimize your event promotion strategy.",
    readTime: "6 min read",
    color: "purple",
  },
  {
    tag: "Community",
    date: "Dec 28, 2024",
    title: "MyTickets Year in Review: 2024 Was Huge",
    excerpt: "We crossed 300,000 customers, launched in 5 new cities, and helped organize over 2,500 events this year.",
    readTime: "5 min read",
    color: "green",
  },
  {
    tag: "Tips",
    date: "Dec 20, 2024",
    title: "How to Avoid Ticket Scams in Sri Lanka",
    excerpt: "A comprehensive guide to spotting fake tickets and buying safely online. Always buy from trusted platforms.",
    readTime: "7 min read",
    color: "red",
  },
  {
    tag: "Event Tips",
    date: "Dec 15, 2024",
    title: "Planning a Corporate Event? Here's What You Need",
    excerpt: "From venue selection to ticketing, a complete checklist for corporate event organizers in Sri Lanka.",
    readTime: "8 min read",
    color: "yellow",
  },
];

const tagColors: Record<TagColor, string> = {
  orange: "bg-orange-500/20 text-orange-400",
  blue: "bg-blue-500/20 text-blue-400",
  purple: "bg-purple-500/20 text-purple-400",
  green: "bg-green-500/20 text-green-400",
  red: "bg-red-500/20 text-red-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
};
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="relative border-b border-white/5 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center relative">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">MyTickets Blog</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Event tips, platform updates, and stories from Sri Lanka's events scene.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tagColors[post.color]}`}>
                  {post.tag}
                </span>
                <span className="text-xs text-gray-600">{post.date}</span>
              </div>
              <h2 className="text-white font-black text-lg mb-2 group-hover:text-orange-400 transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{post.readTime}</span>
                <span className="text-orange-400 text-sm flex items-center gap-1 font-semibold group-hover:gap-2 transition-all">
                  Read more <ChevronRight size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>

    <Footer/>
    
    </>
  )
}

export default Blog
