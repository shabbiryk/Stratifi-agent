"use client";

import { ChatSection } from "@/components/sections/chat-section";
import { AgentChatSection } from "@/components/sections/agent-chat-section";
import { MainLayout } from "@/components/layouts";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback, useEffect } from "react";
import ClientOnlyWrapper from "@/components/client-only-wrapper";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Brain, Bot, Zap, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";

function HomeContent() {
  const searchParams = useSearchParams();

  // Extract parameters from agent.xyz redirect
  const token = searchParams.get("token");
  const poolId = searchParams.get("pool");
  const action = searchParams.get("action");

  // Simple mode selection state
  const [mode, setMode] = useState<"reasoning" | "agent">("reasoning");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Session management for history display
  const { sessions, loadSessions, user } = useSession();
  const [allSessions, setAllSessions] = useState<any[]>([]);

  // Load all sessions when user is available
  useEffect(() => {
    if (user) {
      loadSessions(user.id).then(() => {
        setAllSessions(sessions);
      });
    }
  }, [user, loadSessions]);

  // Update sessions when they change
  useEffect(() => {
    setAllSessions(sessions);
  }, [sessions]);

  // Handle session selection from TopBar history
  const handleSessionSelect = useCallback(
    (sessionId: string) => {
      const session = allSessions.find((s: any) => s.id === sessionId);
      if (session) {
        // Switch to the correct mode based on session metadata
        const sessionMode = session.metadata?.mode;
        if (sessionMode === "reasoning" || sessionMode === "agent") {
          setMode(sessionMode);
        }
        // The individual chat components will handle loading the selected session
      }
    },
    [allSessions]
  );

  // Handle new session creation from TopBar
  const handleNewSession = useCallback(() => {
    // Just trigger the components to create new sessions
    // They'll handle it when the user sends a message
  }, []);

  // Handle mode changes with smooth transition
  const handleModeChange = useCallback(
    (newMode: "reasoning" | "agent") => {
      if (newMode === mode) return;

      setIsTransitioning(true);
      setMode(newMode);

      // Reset transition state after a brief delay
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [mode]
  );

  return (
    <ClientOnlyWrapper
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <MainLayout
        sessions={allSessions}
        currentSession={null} // Let individual components manage their own current session
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        showChatHistory={true}
        showResearchWidget={false}
      >
        <div className="h-full flex flex-col min-h-0">
          {/* Mode Selection Header */}
          <div className="border-b border-slate-800 p-4 bg-slate-950/50 backdrop-blur flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {mode === "reasoning" ? "Reasoning Mode" : "Agent Mode"}
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    {mode === "reasoning"
                      ? "Research & Analysis • Educational content about DeFi protocols"
                      : "Execute Transactions • AI agent for market analysis and trading"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Connection Status Indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">
                      System Online
                    </span>
                  </div>

                  {/* Session Count Display */}
                  {allSessions.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        {allSessions.length} sessions
                      </span>
                    </div>
                  )}

                  {/* Mode Toggle */}
                  <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700">
                    <button
                      onClick={() => handleModeChange("reasoning")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        mode === "reasoning"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <Brain className="h-4 w-4" />
                      Research
                    </button>
                    <button
                      onClick={() => handleModeChange("agent")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        mode === "agent"
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <Bot className="h-4 w-4" />
                      Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 relative min-h-0">
            {isTransitioning && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-white font-medium">
                    Switching to {mode === "agent" ? "Agent" : "Reasoning"} Mode
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {mode === "agent"
                      ? "Preparing AI agent..."
                      : "Loading research interface..."}
                  </p>
                </div>
              </div>
            )}

            <div
              className={`h-full w-full transition-opacity duration-300 ${
                isTransitioning ? "opacity-30" : "opacity-100"
              }`}
            >
              <ErrorBoundary>
                {mode === "reasoning" ? (
                  <ChatSection
                    token={token}
                    poolId={poolId}
                    action={action}
                    mode="reasoning"
                  />
                ) : (
                  <AgentChatSection mode="agent" />
                )}
              </ErrorBoundary>
            </div>
          </div>
        </div>
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
