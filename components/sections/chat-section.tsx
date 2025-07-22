"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSession } from "@/hooks/use-session";
import { useClientRandom } from "@/hooks/use-client-random";

// Props for ChatSection
interface ChatSectionProps {
  token?: string | null;
  poolId?: string | null;
  action?: string | null;
  mode: "reasoning";
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-slate-400 text-sm ml-2">AI is typing</span>
    </div>
  );
}

// Example prompts for user interaction
const EXAMPLE_PROMPTS = [
  "How should I invest $100?",
  "What's the Bitcoin price?",
  "Show me trending memecoins",
  "Analyze my portfolio",
  "Help me buy Ethereum",
  "What are the best DeFi yields?",
];

// Supported blockchain networks
const SUPPORTED_CHAINS = [
  { name: "Base", color: "bg-blue-600" },
  { name: "Starknet", color: "bg-purple-500" },
  { name: "Somnia", color: "bg-pink-500" },
];

export function ChatSection({ token, poolId, action, mode }: ChatSectionProps) {
  // Privy wallet connection
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  // Session management hook
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

  // Client-side random number generation
  const {
    generateRandom,
    generateRandomAPY,
    generateRandomBalance,
    generateRandomUtilization,
  } = useClientRandom();

  // State for input box
  const [input, setInput] = useState("");
  // State for typing indicator
  const [isTyping, setIsTyping] = useState(false);
  // State for welcome screen
  const [showWelcome, setShowWelcome] = useState(true);
  // State to prevent concurrent session creation
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get primary wallet address
  const primaryWallet = wallets[0];
  const walletAddress = primaryWallet?.address;

  // Handle wallet connection and user setup
  useEffect(() => {
    if (authenticated && walletAddress && !user && !isCreatingSession) {
      console.log("Setting up user session for wallet:", walletAddress);
      setIsCreatingSession(true);

      signInWithWallet(walletAddress)
        .then((authenticatedUser) => {
          if (authenticatedUser) {
            loadSessions(authenticatedUser.id);
            // Don't create a session here - wait for user interaction
          }
        })
        .finally(() => {
          setIsCreatingSession(false);
        });
    } else if (!authenticated && user) {
      console.log("Wallet disconnected, signing out");
      signOut();
    }
  }, [
    authenticated,
    walletAddress,
    user,
    signInWithWallet,
    loadSessions,
    signOut,
  ]);

  // Update welcome state based on messages and current session
  useEffect(() => {
    setShowWelcome(messages.length === 0 && !currentSession);
  }, [messages, currentSession]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate AI response
  const simulateAIResponse = async (userMessage: string, sessionToUse: any) => {
    if (!sessionToUse) return;

    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + generateRandom(0, 2000))
    );

    // Mock AI responses
    let aiResponse = "";
    const userLower = userMessage.toLowerCase();

    if (userLower.includes("invest") || userLower.includes("$100")) {
      aiResponse =
        "Great question! For a $100 investment, I'd recommend considering these strategies:\n\n🟢 **Conservative (Low Risk)**\n• 60% USDC staking (4-6% APY)\n• 40% ETH (for growth potential)\n\n🟡 **Moderate (Medium Risk)**\n• 40% ETH\n• 30% BTC\n• 30% High-yield DeFi protocols\n\n🔴 **Aggressive (High Risk)**\n• 50% Promising altcoins\n• 30% DeFi yield farming\n• 20% Emerging protocols\n\nWhat's your risk tolerance and investment timeline?";
    } else if (
      userLower.includes("bitcoin") ||
      userLower.includes("btc") ||
      userLower.includes("price")
    ) {
      aiResponse = `📈 **Current Bitcoin Price: $${(
        42000 + generateRandom(0, 5000)
      ).toLocaleString()}**\n\n**24h Change:** ${generateRandom(-5, 8).toFixed(
        2
      )}%\n**Market Cap:** $${(800 + generateRandom(0, 200)).toFixed(
        0
      )}B\n**Volume:** $${(25 + generateRandom(0, 15)).toFixed(
        1
      )}B\n\n*Price data is simulated for demo purposes*`;
    } else if (
      userLower.includes("trending") ||
      userLower.includes("memecoin")
    ) {
      aiResponse =
        "Here are the trending memecoins right now:\n\n🔥 **Top Performers (24h)**\n• PEPE (+15.2%) - Frog-themed token\n• DOGE (+8.7%) - The original memecoin\n• SHIB (+12.3%) - Dogecoin killer\n• BONK (+22.1%) - Solana's dog token\n\n⚠️ **Risk Warning**: Memecoins are highly volatile and speculative. Only invest what you can afford to lose.";
    } else {
      aiResponse = `I understand you're asking about "${userMessage}". I'm here to help you with crypto research, market analysis, and educational content about DeFi protocols.\n\nI can assist you with:\n• Portfolio analysis and optimization\n• Market insights and price analysis\n• DeFi strategy recommendations\n• Educational content about protocols\n\nWhat specific topic would you like to explore?`;
    }

    setIsTyping(false);
    await addMessage(aiResponse, "ai", sessionToUse);
  };

  // Handler for sending a message
  const handleSend = async () => {
    if (!input.trim() || !user || isCreatingSession) return;

    const userMessage = input.trim();
    setInput("");
    setShowWelcome(false);

    // If no current session, create one first
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      console.log("Creating new reasoning session for message:", userMessage);
      setIsCreatingSession(true);
      try {
        sessionToUse = await createSession(user.id, { mode: "reasoning" });
        if (!sessionToUse) {
          console.error("Failed to create session");
          return;
        }
      } finally {
        setIsCreatingSession(false);
      }
    }

    // Add user message to database
    await addMessage(userMessage, "user", sessionToUse);

    // Simulate AI response
    await simulateAIResponse(userMessage, sessionToUse);
  };

  // Handler for clicking an example prompt
  const handlePromptClick = async (prompt: string) => {
    if (!user || isCreatingSession) return;

    setInput("");
    setShowWelcome(false);

    // If no current session, create one first
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      console.log("Creating new reasoning session for prompt:", prompt);
      setIsCreatingSession(true);
      try {
        sessionToUse = await createSession(user.id, { mode: "reasoning" });
        if (!sessionToUse) {
          console.error("Failed to create session");
          return;
        }
      } finally {
        setIsCreatingSession(false);
      }
    }

    // Add user message to database
    await addMessage(prompt, "user", sessionToUse);

    // Simulate AI response
    await simulateAIResponse(prompt, sessionToUse);
  };

  // Copy message to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-white">
      {/* Welcome Screen - Show when no messages and no current session */}
      {(showWelcome || (!currentSession && messages.length === 0)) && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col justify-center min-h-full px-4 py-8 max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to StratiFi Research
              </h1>
              <p className="text-xl text-slate-300 mb-2">
                Your AI-powered crypto research assistant!
              </p>

              <div className="space-y-4 mb-8 text-slate-300 max-w-2xl mx-auto">
                <p>
                  New to crypto? You can ask me anything. Remember I'm an AI, I
                  don't judge😉. I'm here to help you learn about DeFi, analyze
                  markets, and make informed decisions.
                </p>

                <p>
                  Already experienced? Get detailed explanations, market
                  analysis, and educational content about DeFi protocols and
                  strategies.
                </p>
              </div>

              {/* Blockchain Networks */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {SUPPORTED_CHAINS.map((chain) => (
                  <Badge
                    key={chain.name}
                    className={`${chain.color} text-white border-none hover:opacity-80`}
                  >
                    {chain.name}
                  </Badge>
                ))}
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="text-yellow-200 text-sm">
                    This is educational content only. Always do your own
                    research before making investment decisions.
                  </span>
                </div>
              </div>

              {/* Try an example section */}
              <div>
                <p className="text-slate-300 mb-6 text-lg">Try an example:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      className="text-left text-blue-400 hover:text-blue-300 hover:bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 transition-all duration-200 hover:border-blue-500/30"
                      onClick={() => handlePromptClick(prompt)}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface - Show when there are messages */}
      {(!showWelcome || messages.length > 0) && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="border-b border-slate-800 p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <div>
                <h2 className="font-semibold">StratiFi Research Assistant</h2>
                <p className="text-sm text-slate-400">
                  {isTyping
                    ? "Analyzing..."
                    : "Online • Ready to help with crypto research"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#475569 #1e293b",
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4 group">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold text-white">
                    {msg.role === "ai" ? "AI" : "U"}
                  </span>
                </div>

                {/* Message Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {msg.role === "ai" ? "Research AI" : "You"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatTime(new Date(msg.created_at))}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      msg.role === "ai"
                        ? "bg-slate-800/50 border border-slate-700/50"
                        : "bg-blue-600/10 border border-blue-600/20"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

                  {/* Message Actions */}
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(msg.content)}
                        className="h-7 px-2 text-slate-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-slate-400 hover:text-white"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-slate-400 hover:text-white"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Research AI</span>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box - Always at bottom */}
          <div className="border-t border-slate-800 p-3 flex-shrink-0">
            <form
              className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 max-w-4xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:outline-none"
                placeholder={
                  !authenticated
                    ? "Please connect your wallet to start researching..."
                    : "Ask me anything about crypto and DeFi..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || !authenticated}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
