// pages/Team.tsx
import PageLayout from "../components/PageLayout";

export default function Team() {
  const team = [
    { name: "CEO", role: "Founder" },
    { name: "Tech Lead", role: "Full Stack Engineer" },
    { name: "UI Designer", role: "Frontend Designer" },
  ];

  return (
    <PageLayout title="Who We Are" subtitle="Meet the team behind MyTickets">
      <div className="grid md:grid-cols-3 gap-6">
        {team.map((m) => (
          <div
            key={m.name}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition"
          >
            <div className="w-14 h-14 rounded-full bg-orange-500/20 mb-4" />
            <h3 className="font-bold">{m.name}</h3>
            <p className="text-sm text-gray-400">{m.role}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}