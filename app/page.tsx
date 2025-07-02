"use client";

import { ChatSection } from "@/components/sections/chat-section";
import { MainLayout } from "@/components/layouts";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback } from "react";

function HomeContent() {
  const searchParams = useSearchParams();

  // Extract parameters from agent.xyz redirect
  const token = searchParams.get("token");
  const poolId = searchParams.get("pool");
  const action = searchParams.get("action");

  // State for managing chat sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // Handle session changes from ChatSection
  const handleSessionsChange = useCallback((newSessions: any[]) => {
    setSessions(newSessions);
  }, []);

  const handleCurrentSessionChange = useCallback((newSession: any) => {
    setCurrentSession(newSession);
  }, []);

  // Handle session selection from TopBar history
  const handleSessionSelect = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s: any) => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
        // The ChatSection will handle loading messages when currentSession changes
      }
    },
    [sessions]
  );

  // Handle new session creation from TopBar
  const handleNewSession = useCallback(async () => {
    // Reset current session - ChatSection will create a new one
    setCurrentSession(null);
    // Note: The ChatSection will handle creating a new session in its useEffect
  }, []);

  return (
    <MainLayout
      sessions={sessions}
      currentSession={currentSession}
      onSessionSelect={handleSessionSelect}
      onNewSession={handleNewSession}
      showChatHistory={true} // Enable chat history in TopBar
    >
      <ChatSection
        token={token}
        poolId={poolId}
        action={action}
        onSessionsChange={handleSessionsChange}
        onCurrentSessionChange={handleCurrentSessionChange}
        externalCurrentSession={currentSession}
      />
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
