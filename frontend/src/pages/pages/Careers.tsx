// pages/Careers.tsx
import PageLayout from "../components/PageLayout";

export default function Careers() {
  return (
    <PageLayout title="Careers" subtitle="Join our growing team">
      <div className="space-y-4">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="font-bold">Frontend Developer (React)</h3>
          <p className="text-sm text-gray-400 mt-2">
            Build modern UI with React + Tailwind CSS.
          </p>
          <button className="mt-3 px-4 py-2 bg-orange-500 rounded-lg text-sm font-bold">
            Apply Now
          </button>
        </div>
      </div>
    </PageLayout>
  );
}