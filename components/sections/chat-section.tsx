"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSession } from "@/hooks/use-session";
import { useClientRandom } from "@/hooks/use-client-random";

// Import our refactored components and hooks
import { useChatState } from "@/components/chat/hooks/use-chat-state";
import { useAssetContext } from "@/components/chat/hooks/use-asset-context";
import {
  AIResponseService,
  AIResponseContext,
} from "@/components/chat/services/ai-response.service";
import { ChatWelcome } from "@/components/chat/ui/chat-welcome";
import { ChatMessages } from "@/components/chat/ui/chat-messages";
import { ChatInput } from "@/components/chat/ui/chat-input";

// Types
import { ChatSession } from "@/types/session";

interface ChatSectionProps {
  token?: string | null;
  poolId?: string | null;
  action?: string | null;
  onSessionsChange?: (sessions: any[]) => void;
  onCurrentSessionChange?: (session: any) => void;
  externalCurrentSession?: any;
  isCreatingNewSession?: boolean;
}

export function ChatSection({
  token,
  poolId,
  action,
  onSessionsChange,
  onCurrentSessionChange,
  externalCurrentSession,
  isCreatingNewSession,
}: ChatSectionProps) {
  // External dependencies
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address;

  // Session management
  const {
    user,
    sessions,
    currentSession,
    messages,
    loading,
    signInWithWallet,
    loadSessions,
    createSession,
    loadMessages,
    addMessage,
    clearMessages,
    signOut,
    setCurrentSession,
  } = useSession();

  // Random generators for demo
  const {
    generateRandomAPY,
    generateRandomBalance,
    generateRandomUtilization,
  } = useClientRandom();

  // Chat state management
  const { state, actions, refs, scrollToBottom } = useChatState();

  // AI service - memoized to prevent recreation on every render
  const aiService = useMemo(() => new AIResponseService(), []);

  // Stable event handlers with useCallback
  const handleWalletConnection = useCallback(async () => {
    if (!walletAddress) return;

    actions.setIsCreatingSession(true);
    try {
      const authenticatedUser = await signInWithWallet(walletAddress);
      if (authenticatedUser) {
        await loadSessions(authenticatedUser.id);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      actions.setIsCreatingSession(false);
    }
  }, [walletAddress, signInWithWallet, loadSessions, actions]);

  const handleNewSession = useCallback(async () => {
    if (!user) return;

    setCurrentSession(null);
    clearMessages();
    actions.setShowWelcome(true);
    actions.setIsCreatingSession(true);

    try {
      const newSession = await createSession(user.id);
      if (newSession) {
        console.log("New session created:", newSession.id);
      }
    } catch (error) {
      console.error("Failed to create new session:", error);
    } finally {
      actions.setIsCreatingSession(false);
    }
  }, [user, setCurrentSession, clearMessages, createSession, actions]);

  const createSessionForMessage =
    useCallback(async (): Promise<ChatSession | null> => {
      if (!user) return null;

      actions.setIsCreatingSession(true);
      try {
        const session = await createSession(user.id);
        if (!session) {
          console.error("Failed to create session");
        }
        return session;
      } catch (error) {
        console.error("Session creation error:", error);
        return null;
      } finally {
        actions.setIsCreatingSession(false);
      }
    }, [user, createSession, actions]);

  const generateAIResponse = useCallback(
    async (userMessage: string, sessionToUse: ChatSession) => {
      actions.setIsTyping(true);

      try {
        // Add delay for UX
        await aiService.delay();

        // Build context for AI
        const context: AIResponseContext = {
          assetContext: { token, poolId, action },
          userContext: { authenticated, walletAddress },
          generateRandomAPY,
          generateRandomBalance,
          generateRandomUtilization,
        };

        // Generate response
        const aiResponse = await aiService.generateResponse(
          userMessage,
          context
        );

        // Add AI response to database
        await addMessage(aiResponse, "ai", sessionToUse);
      } catch (error) {
        console.error("AI Response Error:", error);

        // Fallback response
        const fallbackResponse =
          "I'm experiencing some technical difficulties. Please try again in a moment, or feel free to connect your wallet and I'll help you get started with crypto trading.";

        try {
          await addMessage(fallbackResponse, "ai", sessionToUse);
        } catch (fallbackError) {
          console.error("Failed to add fallback message:", fallbackError);
        }
      } finally {
        actions.setIsTyping(false);
      }
    },
    [
      actions,
      aiService,
      token,
      poolId,
      action,
      authenticated,
      walletAddress,
      generateRandomAPY,
      generateRandomBalance,
      generateRandomUtilization,
      addMessage,
    ]
  );

  const handleSendMessage = useCallback(async () => {
    if (!state.input.trim() || !user || state.isCreatingSession) return;

    const userMessage = state.input.trim();
    actions.resetInput();
    actions.setShowWelcome(false);

    try {
      // Ensure we have a session
      let sessionToUse = currentSession;
      if (!sessionToUse) {
        sessionToUse = await createSessionForMessage();
        if (!sessionToUse) return;
      }

      // Add user message
      await addMessage(userMessage, "user", sessionToUse);

      // Generate AI response
      await generateAIResponse(userMessage, sessionToUse);
    } catch (error) {
      console.error("Send message error:", error);
    }
  }, [
    state.input,
    state.isCreatingSession,
    user,
    currentSession,
    actions,
    createSessionForMessage,
    addMessage,
    generateAIResponse,
  ]);

  const handlePromptClick = useCallback(
    async (prompt: string) => {
      if (!user || state.isCreatingSession) return;

      actions.setShowWelcome(false);

      try {
        // Ensure we have a session
        let sessionToUse = currentSession;
        if (!sessionToUse) {
          sessionToUse = await createSessionForMessage();
          if (!sessionToUse) return;
        }

        // Add user message
        await addMessage(prompt, "user", sessionToUse);

        // Generate AI response
        await generateAIResponse(prompt, sessionToUse);
      } catch (error) {
        console.error("Prompt click error:", error);
      }
    },
    [
      user,
      state.isCreatingSession,
      currentSession,
      actions,
      createSessionForMessage,
      addMessage,
      generateAIResponse,
    ]
  );

  const handleCopyMessage = useCallback((content: string) => {
    try {
      navigator.clipboard.writeText(content);
      // Could add toast notification here
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }, []);

  // Asset context handling
  useAssetContext({
    token,
    poolId,
    action,
    user,
    sessions,
    currentSession,
    isCreatingSession: state.isCreatingSession,
    isCreatingNewSession,
    createSession,
    setCurrentSession,
    loadMessages,
    addMessage,
    setShowWelcome: actions.setShowWelcome,
    setIsCreatingSession: actions.setIsCreatingSession,
  });

  // Auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages, state.isTyping, scrollToBottom]);

  // Update welcome state based on messages
  useEffect(() => {
    actions.setShowWelcome(messages.length === 0 && !currentSession);
  }, [messages, currentSession, actions]);

  // Session change notifications
  useEffect(() => {
    onSessionsChange?.(sessions);
  }, [sessions, onSessionsChange]);

  useEffect(() => {
    onCurrentSessionChange?.(currentSession);
  }, [currentSession, onCurrentSessionChange]);

  // External session handling
  useEffect(() => {
    if (state.isCreatingSession) return;

    if (
      externalCurrentSession &&
      externalCurrentSession.id !== currentSession?.id
    ) {
      setCurrentSession(externalCurrentSession);
      loadMessages(externalCurrentSession.id);
      actions.setShowWelcome(false);
    } else if (
      externalCurrentSession === null &&
      currentSession &&
      user &&
      !state.isCreatingSession &&
      isCreatingNewSession
    ) {
      handleNewSession();
    }
  }, [
    externalCurrentSession,
    currentSession,
    state.isCreatingSession,
    isCreatingNewSession,
    user,
    setCurrentSession,
    loadMessages,
    actions,
    handleNewSession,
  ]);

  // Wallet connection handling
  useEffect(() => {
    if (isCreatingNewSession) return;

    if (authenticated && walletAddress && !user && !state.isCreatingSession) {
      handleWalletConnection();
    } else if (!authenticated && user) {
      signOut();
    }
  }, [
    authenticated,
    walletAddress,
    user,
    state.isCreatingSession,
    isCreatingNewSession,
    handleWalletConnection,
    signOut,
  ]);

  // Render
  return (
    <div className="h-full flex bg-slate-950 text-white">
      <div className="flex-1 flex flex-col">
        {/* Welcome Screen */}
        {(state.showWelcome || (!currentSession && messages.length === 0)) && (
          <ChatWelcome onPromptClick={handlePromptClick} />
        )}

        {/* Chat Interface */}
        {(!state.showWelcome || messages.length > 0) && (
          <ChatMessages
            messages={messages}
            isTyping={state.isTyping}
            messagesEndRef={refs.messagesEndRef}
            chatContainerRef={refs.chatContainerRef}
            onCopyMessage={handleCopyMessage}
          />
        )}

        {/* Chat Input */}
        <ChatInput
          input={state.input}
          authenticated={authenticated}
          isTyping={state.isTyping}
          onInputChange={actions.setInput}
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
}
