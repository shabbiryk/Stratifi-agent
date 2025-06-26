"use client";

import ChatSection from "@/components/sections/chat-section";
import AppSidebar from "@/components/ui/app-sidebar";
import TopBar from "@/components/ui/top-bar";

export default function Home() {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <TopBar />

        {/* Chat Section */}
        <ChatSection />
      </div>
    </div>
  );
}
