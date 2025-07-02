"use client";

import Navbar from "@/components/navigation/navbar";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Traditional Navbar */}
      <Navbar />

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
