"use client";

import { ChatSection } from "@/components/sections/chat-section";
import { MainLayout } from "@/components/layouts";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback, useRef } from "react";
import ClientOnlyWrapper from "@/components/client-only-wrapper";

function HomeContent() {
  const searchParams = useSearchParams();

  // Extract parameters from agent.xyz redirect
  const token = searchParams.get("token");
  const poolId = searchParams.get("pool");
  const action = searchParams.get("action");

  // State for managing chat sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  // Flag to prevent infinite loops when creating new sessions
  const isCreatingNewSession = useRef(false);

  // Handle session changes from ChatSection
  const handleSessionsChange = useCallback((newSessions: any[]) => {
    setSessions(newSessions);
  }, []);

  const handleCurrentSessionChange = useCallback((newSession: any) => {
    setCurrentSession(newSession);
    // Reset the flag when a new session is actually created
    if (newSession && isCreatingNewSession.current) {
      isCreatingNewSession.current = false;
    }
  }, []);

  // Handle session selection from TopBar history
  const handleSessionSelect = useCallback(
    (sessionId: string) => {
      // Don't allow session selection while creating a new session
      if (isCreatingNewSession.current) return;

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
    // Prevent multiple new session requests
    if (isCreatingNewSession.current) {
      console.log("New session already in progress, ignoring request");
      return;
    }

    console.log("Starting new session creation from TopBar");
    isCreatingNewSession.current = true;

    // Reset current session - ChatSection will create a new one
    setCurrentSession(null);
    // Note: The ChatSection will handle creating a new session in its useEffect
  }, []);

  return (
    <ClientOnlyWrapper
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
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
          isCreatingNewSession={isCreatingNewSession.current}
        />
      </MainLayout>
    </ClientOnlyWrapper>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
