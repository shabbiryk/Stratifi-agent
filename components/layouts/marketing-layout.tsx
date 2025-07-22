"use client";

import Navbar from "@/components/navigation/navbar";
import { FloatingChatButton } from "@/components/ui/floating-chat-button";

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

      {/* Floating Research Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
