// components/PageLayout.tsx
import { ReactNode } from "react";

export default function PageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/10 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-black">{title}</h1>
          {subtitle && (
            <p className="text-gray-400 mt-2 text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">{children}</div>
    </div>
  );
}