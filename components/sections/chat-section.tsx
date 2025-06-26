"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Mic,
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePrivy, useWallets } from "@privy-io/react-auth";

// Chat message type for extensibility
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-sm">StratiFi AI is typing...</span>
    </div>
  );
}

// Example prompts for quick user actions
const EXAMPLE_PROMPTS = [
  "How should I invest $100?",
  "Analyze my portfolio and suggest investments",
  "Show my portfolio, with total balance",
  "Show me the trending memecoins right now",
  "What's the price of Bitcoin?",
  "Buy $100 worth of Ethereum on Base",
];

// Supported blockchain networks
const SUPPORTED_CHAINS = [
  { name: "Arbitrum", color: "bg-blue-500" },
  { name: "Base", color: "bg-blue-600" },
  { name: "Optimism", color: "bg-red-500" },
  { name: "Polygon", color: "bg-purple-500" },
  { name: "Berachain", color: "bg-orange-500" },
  { name: "Hyperliquid", color: "bg-cyan-500" },
  { name: "Ink", color: "bg-green-500" },
  { name: "Soneium", color: "bg-pink-500" },
];

export function ChatSection() {
  // Privy wallet connection
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  // State for chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // State for input box
  const [input, setInput] = useState("");
  // State for typing indicator
  const [isTyping, setIsTyping] = useState(false);
  // State for welcome screen
  const [showWelcome, setShowWelcome] = useState(true);
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get primary wallet address for more personalized responses
  const primaryWallet = wallets[0];
  const walletAddress = primaryWallet?.address;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Mock AI responses based on user input
    let aiResponse = "";
    const userLower = userMessage.toLowerCase();

    if (
      userLower.includes("price") ||
      userLower.includes("bitcoin") ||
      userLower.includes("btc")
    ) {
      aiResponse =
        "Bitcoin (BTC) is currently trading at approximately $43,250. The price has shown strong momentum recently with increased institutional adoption. Would you like me to help you buy some Bitcoin or analyze its technical indicators?";
    } else if (userLower.includes("portfolio")) {
      if (!authenticated || !walletAddress) {
        aiResponse =
          "I'd be happy to analyze your portfolio! To provide the most accurate analysis, I'll need to connect to your wallet first. This will allow me to:\n\n• View your current holdings\n• Calculate your total balance\n• Identify optimization opportunities\n• Suggest rebalancing strategies\n\nWould you like me to guide you through connecting your wallet?";
      } else {
        aiResponse = `Great! I can see your wallet is connected (${walletAddress.slice(
          0,
          6
        )}...${walletAddress.slice(
          -4
        )}). Let me analyze your portfolio:\n\n📊 **Portfolio Analysis**\n• Scanning your holdings across supported chains...\n• Calculating total balance and allocation...\n• Identifying yield opportunities...\n\n💡 **Initial Recommendations:**\n• Consider diversifying across DeFi protocols\n• Look into staking opportunities for better yields\n• Monitor gas fees for optimal transaction timing\n\nWould you like me to dive deeper into any specific aspect of your portfolio?`;
      }
    } else if (userLower.includes("invest") || userLower.includes("$100")) {
      aiResponse =
        "Great question! For a $100 investment, I'd recommend considering these strategies:\n\n🟢 **Conservative (Low Risk)**\n• 60% USDC staking (4-6% APY)\n• 40% ETH (for growth potential)\n\n🟡 **Moderate (Medium Risk)**\n• 40% ETH\n• 30% BTC\n• 30% High-yield DeFi protocols\n\n🔴 **Aggressive (High Risk)**\n• 50% Promising altcoins\n• 30% DeFi yield farming\n• 20% Emerging protocols\n\nWhat's your risk tolerance and investment timeline?";
    } else if (
      userLower.includes("trending") ||
      userLower.includes("memecoin")
    ) {
      aiResponse =
        "Here are the trending memecoins right now:\n\n🔥 **Top Performers (24h)**\n• PEPE (+15.2%) - Frog-themed token\n• DOGE (+8.7%) - The original memecoin\n• SHIB (+12.3%) - Dogecoin killer\n• BONK (+22.1%) - Solana's dog token\n\n⚠️ **Risk Warning**: Memecoins are highly volatile and speculative. Only invest what you can afford to lose. Would you like me to help you research any specific token or set up price alerts?";
    } else if (
      userLower.includes("buy") ||
      userLower.includes("ethereum") ||
      userLower.includes("eth")
    ) {
      if (!authenticated || !walletAddress) {
        aiResponse =
          "I can help you buy $100 worth of Ethereum on Base! Here's what I'll do:\n\n📋 **Transaction Summary**\n• Amount: $100 USD\n• Asset: Ethereum (ETH)\n• Network: Base\n• Est. ETH: ~0.045 ETH\n• Gas fees: ~$2-5\n\nTo proceed, I'll need to:\n1. Connect your wallet\n2. Confirm the transaction details\n3. Execute the swap\n\nShould I start the wallet connection process?";
      } else {
        aiResponse = `Perfect! Your wallet is connected. I can help you buy $100 worth of Ethereum on Base.\n\n📋 **Transaction Summary**\n• From wallet: ${walletAddress.slice(
          0,
          6
        )}...${walletAddress.slice(
          -4
        )}\n• Amount: $100 USD\n• Asset: Ethereum (ETH)\n• Network: Base\n• Est. ETH: ~0.045 ETH\n• Gas fees: ~$2-5\n\n✅ **Ready to Execute:**\n1. ✓ Wallet connected\n2. ⏳ Preparing transaction...\n3. ⏳ Awaiting your confirmation\n\n*Note: This is a demo. In production, this would execute a real transaction.*\n\nWould you like me to proceed with this transaction?`;
      }
    } else {
      aiResponse = `I understand you're asking about "${userMessage}". I'm here to help you with crypto trading, portfolio analysis, market insights, and DeFi strategies across multiple chains.\n\nI can assist you with:\n• Buying/selling crypto\n• Portfolio optimization\n• Market analysis\n• Cross-chain transactions\n• DeFi yield strategies\n\nWhat specific crypto-related task would you like help with?`;
    }

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
      },
    ]);
  };

  // Handler for sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setShowWelcome(false);

    // Add user message to chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI response
    await simulateAIResponse(userMessage);
  };

  // Handler for clicking an example prompt
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  // Copy message to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Welcome Screen - Show when no messages */}
      {showWelcome && messages.length === 0 && (
        <div className="flex-1 flex flex-col justify-center px-6 py-4 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to StratiFi
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              The simplest way to trade crypto!
            </p>

            <div className="space-y-4 mb-6 text-slate-300 max-w-2xl mx-auto">
              <p>
                New to crypto? You can ask me anything. Remember I'm an AI, I
                don't judge😉. Whenever you're ready, I'm here to help you do
                transactions with ease and confidence.
              </p>

              <p>
                Already a pro? You are about to experience a completely new way
                of trading crypto, supported by AI. You can also perform
                cross-chain transactions on:
              </p>
            </div>

            {/* Blockchain Networks */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
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
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-yellow-500">⚠️</span>
                <span className="text-yellow-200 text-sm">
                  Warning: Do not send tokens from any other chain apart from
                  the ones that we support.
                </span>
              </div>
            </div>

            {/* Try an example section */}
            <div>
              <p className="text-slate-300 mb-4 text-lg">Try an example:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="text-left text-blue-400 hover:text-blue-300 hover:bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 transition-all duration-200"
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
      )}

      {/* Chat Interface - Show when there are messages */}
      {(!showWelcome || messages.length > 0) && (
        <>
          {/* Chat Header */}
          <div className="border-b border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <div>
                <h2 className="font-semibold">StratiFi AI Assistant</h2>
                <p className="text-sm text-slate-400">
                  {isTyping
                    ? "Typing..."
                    : "Online • Ready to help with crypto"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 scrollbar-hide"
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
                      {msg.role === "ai" ? "StratiFi AI" : "You"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatTime(msg.timestamp)}
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
                    <span className="font-medium text-sm">StratiFi AI</span>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </>
      )}

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
            placeholder="Ask me anything about crypto..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
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
  );
}

export default ChatSection;
