"use client";

import { AppSidebar } from "@/components/layouts/components/app-sidebar";
import { TopBar } from "@/components/layouts/components/top-bar";
import { FloatingChatButton } from "@/components/ui/floating-chat-button";

interface MainLayoutProps {
  children: React.ReactNode;
  // Optional chat history props
  sessions?: any[];
  currentSession?: any;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
  showChatHistory?: boolean;
  // Control research widget visibility
  showResearchWidget?: boolean;
}

export function MainLayout({
  children,
  sessions,
  currentSession,
  onSessionSelect,
  onNewSession,
  showChatHistory = false,
  showResearchWidget = true,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with chat history integration */}
        <TopBar
          sessions={sessions}
          currentSession={currentSession}
          onSessionSelect={onSessionSelect}
          onNewSession={onNewSession}
          showChatHistory={showChatHistory}
        />

        {/* Page Content */}
        <main className="flex-1 min-h-0">{children}</main>
      </div>

      {/* Floating Research Chat Button - Only show when enabled */}
      {showResearchWidget && <FloatingChatButton />}
    </div>
  );
}
