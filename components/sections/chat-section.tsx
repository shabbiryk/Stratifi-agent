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

// Chat message type for extensibility - now matches Supabase schema
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
  metadata?: any;
}

// Props for ChatSection to handle asset details
interface ChatSectionProps {
  token?: string | null;
  poolId?: string | null;
  action?: string | null;
  // Session management callbacks for parent component
  onSessionsChange?: (sessions: any[]) => void;
  onCurrentSessionChange?: (session: any) => void;
  // External session selection (from TopBar history)
  externalCurrentSession?: any;
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

export function ChatSection({
  token,
  poolId,
  action,
  onSessionsChange,
  onCurrentSessionChange,
  externalCurrentSession,
}: ChatSectionProps) {
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

  // State for input box
  const [input, setInput] = useState("");
  // State for typing indicator
  const [isTyping, setIsTyping] = useState(false);
  // State for welcome screen
  const [showWelcome, setShowWelcome] = useState(true);
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Ref to track if asset context has been handled to prevent multiple sessions
  const assetContextHandled = useRef<string | null>(null);

  // Get primary wallet address for more personalized responses
  const primaryWallet = wallets[0];
  const walletAddress = primaryWallet?.address;

  // Notify parent component of session changes
  useEffect(() => {
    onSessionsChange?.(sessions);
  }, [sessions, onSessionsChange]);

  useEffect(() => {
    onCurrentSessionChange?.(currentSession);
  }, [currentSession, onCurrentSessionChange]);

  // Handle external session selection (from TopBar history)
  useEffect(() => {
    if (
      externalCurrentSession &&
      externalCurrentSession.id !== currentSession?.id
    ) {
      console.log("External session selected:", externalCurrentSession.id);
      setCurrentSession(externalCurrentSession);
      loadMessages(externalCurrentSession.id);
      setShowWelcome(false);
    } else if (externalCurrentSession === null && currentSession && user) {
      // Handle new session request from TopBar
      console.log("New session requested from TopBar");
      // Clear current session and messages
      setCurrentSession(null);
      clearMessages();
      setShowWelcome(true);

      // Create a new session
      createSession(user.id).then((newSession) => {
        if (newSession) {
          console.log("New session created:", newSession.id);
          // The session will be set via onCurrentSessionChange callback
        }
      });
    }
  }, [
    externalCurrentSession,
    currentSession,
    loadMessages,
    setCurrentSession,
    user,
    createSession,
    clearMessages,
  ]);

  // Handle wallet connection and user setup
  useEffect(() => {
    if (authenticated && walletAddress && !user) {
      console.log("Setting up user session for wallet:", walletAddress);
      // Reset asset context tracking for new user
      assetContextHandled.current = null;
      signInWithWallet(walletAddress).then((authenticatedUser) => {
        if (authenticatedUser) {
          loadSessions(authenticatedUser.id);
        }
      });
    } else if (!authenticated && user) {
      console.log("Wallet disconnected, signing out");
      // Reset asset context tracking when user signs out
      assetContextHandled.current = null;
      signOut();
    }
  }, [authenticated, walletAddress, user]);

  // Handle asset context and session creation
  useEffect(() => {
    if (user && token && poolId && action) {
      // Create a unique key for this asset context
      const contextKey = `${token}-${poolId}-${action}`;

      // Skip if we've already handled this exact context
      if (assetContextHandled.current === contextKey) {
        console.log("Asset context already handled:", contextKey);
        return;
      }

      console.log("Creating/loading session for asset context:", {
        token,
        poolId,
        action,
      });

      // Check for existing session with this context
      const existingSession = sessions.find((session: any) => {
        const context = session.metadata?.initialContext;
        return (
          context?.token === token &&
          context?.poolId === poolId &&
          context?.action === action
        );
      });

      if (existingSession) {
        console.log("Found existing session:", existingSession.id);
        setCurrentSession(existingSession);
        loadMessages(existingSession.id);
        assetContextHandled.current = contextKey;
      } else {
        console.log("Creating new session for asset context");
        createSession(user.id, { token, poolId, action }).then((newSession) => {
          if (newSession) {
            // Add initial context message
            const contextMessage = generateAssetDetailsMessage(
              token,
              poolId,
              action
            );
            addMessage(contextMessage, "ai", newSession);
            assetContextHandled.current = contextKey;
          }
        });
      }
      setShowWelcome(false);
    }
  }, [user, token, poolId, action]);

  // Update welcome state based on messages
  useEffect(() => {
    setShowWelcome(messages.length === 0 && !currentSession);
  }, [messages, currentSession]);

  // Function to generate asset details message
  const generateAssetDetailsMessage = (
    token: string,
    poolId: string,
    action: string
  ) => {
    const actionText = action === "borrow" ? "borrowing" : "lending";
    const actionEmoji = action === "borrow" ? "📤" : "📥";

    return `${actionEmoji} **Asset Details from Landing Page**

**Token:** ${token.toUpperCase()}
**Pool ID:** ${poolId}
**Action:** ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}

I can help you proceed with ${actionText} ${token.toUpperCase()}. Here's what I can do:

${
  action === "borrow"
    ? `💰 **Borrowing ${token.toUpperCase()}:**
• Check your collateral requirements
• Calculate borrowing capacity
• Show current interest rates
• Execute the borrowing transaction
• Monitor your health factor`
    : `💎 **Lending ${token.toUpperCase()}:**
• Calculate potential APY earnings
• Show lending pool utilization
• Execute the lending transaction
• Track your lending rewards
• Monitor pool performance`
}

${
  !authenticated
    ? `⚠️ **Next Steps:**
1. Connect your wallet to proceed
2. I'll verify your ${action === "borrow" ? "collateral" : "balance"}
3. Prepare the transaction
4. Execute ${actionText}

Would you like me to help you connect your wallet to get started?`
    : `✅ **Wallet Connected!**
Your wallet (${walletAddress?.slice(0, 6)}...${walletAddress?.slice(
        -4
      )}) is ready.

Would you like me to:
• Check your ${
        action === "borrow"
          ? "collateral and borrowing capacity"
          : "current balance"
      }
• Show you the ${actionText} terms for this pool
• Prepare the transaction for ${actionText} ${token.toUpperCase()}?`
}`;
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = async (
    userMessage: string,
    sessionToUse?: ChatSession
  ) => {
    const targetSession = sessionToUse || currentSession;
    if (!targetSession) return;

    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Mock AI responses based on user input
    let aiResponse = "";
    const userLower = userMessage.toLowerCase();

    // Asset context-aware responses
    const hasAssetContext = token && poolId && action;
    const actionText = action === "borrow" ? "borrowing" : "lending";

    // Handle asset-specific queries first
    if (
      hasAssetContext &&
      (userLower.includes("yes") ||
        userLower.includes("proceed") ||
        userLower.includes("continue"))
    ) {
      if (!authenticated || !walletAddress) {
        aiResponse = `Great! Let me help you get started with ${actionText} ${token?.toUpperCase()}.

⚠️ **Wallet Connection Required**
To proceed with ${actionText}, I need to connect to your wallet first.

**What happens next:**
1. Click "Connect Wallet" in the top bar
2. I'll verify your ${
          action === "borrow" ? "collateral" : `${token?.toUpperCase()} balance`
        }
3. Show you the ${actionText} terms for Pool ${poolId}
4. Execute the transaction

Would you like me to guide you through the wallet connection process?`;
      } else {
        const randomAPY =
          action === "borrow"
            ? (Math.random() * 5 + 3).toFixed(2)
            : (Math.random() * 8 + 5).toFixed(2);
        aiResponse = `Perfect! Let's proceed with ${actionText} ${token?.toUpperCase()} from Pool ${poolId}.

✅ **Transaction Details:**
• Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}
• Asset: ${token?.toUpperCase()}
• Pool: ${poolId}
• Action: ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}
• ${action === "borrow" ? "Interest Rate" : "APY"}: ${randomAPY}%

📋 **Next Steps:**
1. ✓ Wallet connected
2. ⏳ Checking ${
          action === "borrow" ? "collateral requirements" : "available balance"
        }...
3. ⏳ Preparing transaction parameters
4. ⏳ Ready for your final confirmation

*This is a demo environment. In production, this would execute a real ${actionText} transaction.*

Would you like me to show you the final transaction summary?`;
      }
    } else if (
      hasAssetContext &&
      (userLower.includes("balance") || userLower.includes("collateral"))
    ) {
      if (!authenticated) {
        aiResponse = `I'd love to check your ${
          action === "borrow" ? "collateral" : "balance"
        } for ${actionText} ${token?.toUpperCase()}, but I need wallet access first.

Connect your wallet and I'll show you:
• Your current ${
          action === "borrow"
            ? "collateral positions"
            : `${token?.toUpperCase()} balance`
        }
• ${action === "borrow" ? "Available borrowing capacity" : "Lending capacity"}
• Pool utilization and rates
• Transaction requirements`;
      } else {
        const randomBalance = (Math.random() * 1000 + 100).toFixed(2);
        aiResponse = `📊 **${
          action === "borrow" ? "Collateral" : "Balance"
        } Check for Pool ${poolId}**

${
  action === "borrow"
    ? `💰 **Your Collateral:**
• Total Collateral Value: $${randomBalance}
• Available to Borrow: $${(parseFloat(randomBalance) * 0.7).toFixed(2)}
• Health Factor: 2.3 (Healthy)
• Max ${token?.toUpperCase()} Borrow: ${(
        parseFloat(randomBalance) * 0.001
      ).toFixed(4)} ${token?.toUpperCase()}`
    : `💎 **Your ${token?.toUpperCase()} Balance:**
• Available Balance: ${(parseFloat(randomBalance) * 0.01).toFixed(
        4
      )} ${token?.toUpperCase()}
• USD Value: $${randomBalance}
• Max Lending Amount: ${(parseFloat(randomBalance) * 0.009).toFixed(
        4
      )} ${token?.toUpperCase()}
• Estimated Annual Yield: $${(parseFloat(randomBalance) * 0.08).toFixed(2)}`
}

Ready to proceed with ${actionText}?`;
      }
    } else if (
      hasAssetContext &&
      (userLower.includes("rate") ||
        userLower.includes("apy") ||
        userLower.includes("interest"))
    ) {
      const rate =
        action === "borrow"
          ? (Math.random() * 5 + 3).toFixed(2)
          : (Math.random() * 8 + 5).toFixed(2);
      aiResponse = `📈 **${
        action === "borrow" ? "Interest Rates" : "APY Rates"
      } for ${token?.toUpperCase()} - Pool ${poolId}**

${
  action === "borrow"
    ? `💸 **Borrowing Rates:**
• Current Rate: ${rate}% APR
• Rate Type: Variable
• Collateral Ratio: 150%
• Liquidation Threshold: 80%

**Rate Factors:**
• Pool utilization: ${(Math.random() * 40 + 50).toFixed(1)}%
• Available liquidity: High
• Market volatility: Moderate`
    : `💰 **Lending APY:**
• Current APY: ${rate}%
• Compounding: Daily
• Pool Utilization: ${(Math.random() * 40 + 50).toFixed(1)}%
• Risk Level: Low-Medium

**APY Breakdown:**
• Base Rate: ${(parseFloat(rate) * 0.7).toFixed(2)}%
• Utilization Bonus: ${(parseFloat(rate) * 0.3).toFixed(2)}%
• Platform Rewards: Potential additional yields`
}

These are competitive rates! Would you like to proceed with ${actionText}?`;
    } else if (
      userLower.includes("price") ||
      userLower.includes("bitcoin") ||
      userLower.includes("btc")
    ) {
      if (hasAssetContext && token?.toLowerCase() === "btc") {
        aiResponse = `Bitcoin (BTC) is currently trading at approximately $43,250.

Since you're here to ${action} BTC from Pool ${poolId}, here's what's relevant:
• Current BTC Price: $43,250
• ${action === "borrow" ? "Borrowing" : "Lending"} this asset at current prices
• Pool liquidity: High
• ${
          action === "borrow"
            ? `Interest Rate: ${(Math.random() * 5 + 3).toFixed(2)}%`
            : `Current APY: ${(Math.random() * 8 + 5).toFixed(2)}%`
        }

Ready to proceed with ${actionText} BTC?`;
      } else {
        aiResponse =
          "Bitcoin (BTC) is currently trading at approximately $43,250. The price has shown strong momentum recently with increased institutional adoption. Would you like me to help you buy some Bitcoin or analyze its technical indicators?";
      }
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
      if (hasAssetContext) {
        aiResponse = `For ${actionText} ${token?.toUpperCase()} from Pool ${poolId}, here's my recommendation:

💡 **${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Strategy:**
${
  action === "borrow"
    ? `• Borrow conservatively (max 60% of available)
• Monitor your health factor regularly
• Have an exit strategy ready
• Consider borrowing costs vs. investment returns`
    : `• Start with a smaller amount to test the pool
• Monitor APY changes and pool performance
• Consider compounding your yields
• Diversify across multiple pools for lower risk`
}

Current ${action === "borrow" ? "borrowing rate" : "APY"}: ${(
          Math.random() * (action === "borrow" ? 5 : 8) +
          (action === "borrow" ? 3 : 5)
        ).toFixed(2)}%

Would you like me to help you proceed with this strategy?`;
      } else {
        aiResponse =
          "Great question! For a $100 investment, I'd recommend considering these strategies:\n\n🟢 **Conservative (Low Risk)**\n• 60% USDC staking (4-6% APY)\n• 40% ETH (for growth potential)\n\n🟡 **Moderate (Medium Risk)**\n• 40% ETH\n• 30% BTC\n• 30% High-yield DeFi protocols\n\n🔴 **Aggressive (High Risk)**\n• 50% Promising altcoins\n• 30% DeFi yield farming\n• 20% Emerging protocols\n\nWhat's your risk tolerance and investment timeline?";
      }
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
      if (hasAssetContext && token?.toLowerCase() === "eth") {
        if (!authenticated || !walletAddress) {
          aiResponse = `Perfect! You want to ${action} ETH from Pool ${poolId}. Let me help you with that.

To proceed with ${actionText} Ethereum, I'll need to connect to your wallet first:

📋 **What I'll do next:**
1. Connect your wallet
2. Check your ${action === "borrow" ? "collateral" : "ETH balance"}
3. Show you the ${actionText} terms
4. Execute the transaction

Should I guide you through the wallet connection?`;
        } else {
          aiResponse = `Excellent! Your wallet is connected and you want to ${action} ETH from Pool ${poolId}.

📋 **ETH ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Summary:**
• Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}
• Asset: Ethereum (ETH)
• Pool: ${poolId}
• ${action === "borrow" ? "Interest Rate" : "Current APY"}: ${(
            Math.random() * (action === "borrow" ? 5 : 8) +
            (action === "borrow" ? 3 : 5)
          ).toFixed(2)}%

✅ **Ready to Execute:**
1. ✓ Wallet connected
2. ⏳ Preparing ETH ${actionText} transaction...
3. ⏳ Awaiting your confirmation

Would you like me to proceed with this ETH ${actionText} transaction?`;
        }
      } else {
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
      }
    } else {
      if (hasAssetContext) {
        aiResponse = `I understand you're asking about "${userMessage}". 

Since you're here to ${action} ${token?.toUpperCase()} from Pool ${poolId}, I can help you with:

🎯 **${token?.toUpperCase()} ${
          actionText.charAt(0).toUpperCase() + actionText.slice(1)
        } Actions:**
• Check ${action === "borrow" ? "collateral requirements" : "current balance"}
• Show ${action === "borrow" ? "interest rates" : "APY rates"} for this pool
• Execute the ${actionText} transaction
• Monitor your position after ${actionText}

💬 **General Crypto Help:**
• Portfolio analysis and optimization
• Market insights and price analysis
• Cross-chain transaction guidance
• DeFi strategy recommendations

What would you like me to help you with regarding your ${token?.toUpperCase()} ${actionText}?`;
      } else {
        aiResponse = `I understand you're asking about "${userMessage}". I'm here to help you with crypto trading, portfolio analysis, market insights, and DeFi strategies across multiple chains.\n\nI can assist you with:\n• Buying/selling crypto\n• Portfolio optimization\n• Market analysis\n• Cross-chain transactions\n• DeFi yield strategies\n\nWhat specific crypto-related task would you like help with?`;
      }
    }

    setIsTyping(false);

    // Add AI response to database
    await addMessage(aiResponse, "ai", targetSession);
  };

  // Handler for sending a message
  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput("");
    setShowWelcome(false);

    // If no current session, create one first
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      console.log("Creating new session for message:", userMessage);
      sessionToUse = await createSession(user.id);
      if (!sessionToUse) {
        console.error("Failed to create session");
        return;
      }
    }

    // Add user message to database
    await addMessage(userMessage, "user", sessionToUse);

    // Simulate AI response
    await simulateAIResponse(userMessage, sessionToUse);
  };

  // Handler for clicking an example prompt
  const handlePromptClick = async (prompt: string) => {
    if (!user) return;

    setInput("");
    setShowWelcome(false);

    // If no current session, create one first
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      console.log("Creating new session for prompt:", prompt);
      sessionToUse = await createSession(user.id);
      if (!sessionToUse) {
        console.error("Failed to create session");
        return;
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
    // You could add a toast notification here
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full flex bg-slate-950 text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Welcome Screen - Show when no messages and no current session */}
        {(showWelcome || (!currentSession && messages.length === 0)) && (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col justify-center min-h-full px-6 py-4 max-w-4xl mx-auto">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to StratiFi
                </h1>
                <p className="text-xl text-slate-300 mb-2">
                  The simplest way to trade crypto!
                </p>

                <div className="space-y-4 mb-6 text-slate-300 max-w-2xl mx-auto">
                  <p>
                    New to crypto? You can ask me anything. Remember I'm an AI,
                    I don't judge😉. Whenever you're ready, I'm here to help you
                    do transactions with ease and confidence.
                  </p>

                  <p>
                    Already a pro? You are about to experience a completely new
                    way of trading crypto, supported by AI. You can also perform
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
                      Warning: Do not send tokens from any other chain apart
                      from the ones that we support.
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
          </div>
        )}

        {/* Chat Interface - Show when there are messages */}
        {(!showWelcome || messages.length > 0) && (
          <>
            {/* Chat Header */}
            <div className="border-b border-slate-800 p-4 flex-shrink-0">
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
              className="flex-1 overflow-y-auto p-4 space-y-6"
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
                        {msg.role === "ai" ? "StratiFi AI" : "You"}
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
              placeholder={
                !authenticated
                  ? "Please connect your wallet to start chatting..."
                  : "Ask me anything about crypto..."
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
    </div>
  );
}
