// Custom hook for chat state management
import { useState, useRef, useCallback } from "react";
import { ChatMessage, ChatSession } from "@/types/session";

export interface ChatState {
  input: string;
  isTyping: boolean;
  showWelcome: boolean;
  isCreatingSession: boolean;
}

export interface ChatActions {
  setInput: (input: string) => void;
  setIsTyping: (typing: boolean) => void;
  setShowWelcome: (show: boolean) => void;
  setIsCreatingSession: (creating: boolean) => void;
  resetInput: () => void;
}

export function useChatState(initialWelcome = true) {
  // State management
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(initialWelcome);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Actions
  const resetInput = useCallback(() => setInput(""), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const state: ChatState = {
    input,
    isTyping,
    showWelcome,
    isCreatingSession,
  };

  const actions: ChatActions = {
    setInput,
    setIsTyping,
    setShowWelcome,
    setIsCreatingSession,
    resetInput,
  };

  return {
    state,
    actions,
    refs: {
      messagesEndRef,
      chatContainerRef,
    },
    scrollToBottom,
  };
}
