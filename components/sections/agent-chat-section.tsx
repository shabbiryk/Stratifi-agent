"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Bot, Zap, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  useAccount,
  useSendTransaction,
  useWriteContract,
  useBalance,
} from "wagmi";
import { parseEther } from "viem";
import { useSession } from "@/hooks/use-session";
import { AgentService, ChatMessage, WalletAction } from "@/lib/agent-service";

interface AgentChatSectionProps {
  mode: "agent";
}

export function AgentChatSection({ mode }: AgentChatSectionProps) {
  // Privy wallet connection (for auth) + Wagmi hooks (for transactions)
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const primaryWallet = wallets[0];
  const walletAddress = primaryWallet?.address;

  // Wagmi hooks for better transaction handling
  const { address: wagmiAddress, chainId } = useAccount();
  const { data: balance } = useBalance({ address: wagmiAddress });
  const { sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { writeContract } = useWriteContract();

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
    addMessage,
    setCurrentSession,
  } = useSession();

  // Local state
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isInitializingAgent, setIsInitializingAgent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize user and agent when wallet connects
  useEffect(() => {
    if (authenticated && walletAddress && !user && !isInitializingAgent) {
      setIsInitializingAgent(true);

      // Sign in user first
      signInWithWallet(walletAddress)
        .then(async (authenticatedUser) => {
          if (authenticatedUser) {
            await loadSessions(authenticatedUser.id);

            try {
              // Create or get agent for this user
              console.log("Creating agent for wallet:", walletAddress);
              const agentResponse = await AgentService.createAgent({
                userWalletAddress: walletAddress,
                chain_id: chainId || 8453, // Use wagmi chainId, default to Base
              });

              if (agentResponse.success && agentResponse.agent_id) {
                console.log(
                  "Agent created successfully:",
                  agentResponse.agent_id
                );
                setAgentId(agentResponse.agent_id);
                // Don't create a session here - wait for user interaction
              } else {
                console.error("Failed to create agent:", agentResponse.error);
                // Set a fallback state - user can still try to use the interface
                setAgentId(null);
              }
            } catch (error) {
              console.error("Error during agent creation:", error);
              // Network or other error - set fallback state
              setAgentId(null);
            }
          }
        })
        .catch((error) => {
          console.error("Error during user sign in:", error);
          setAgentId(null);
        })
        .finally(() => {
          setIsInitializingAgent(false);
        });
    }
  }, [
    authenticated,
    walletAddress,
    user,
    chainId,
    signInWithWallet,
    loadSessions,
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle wallet action requests using wagmi
  const handleWalletAction = async (walletAction: WalletAction) => {
    if (!walletAction) return;

    try {
      // Show user a confirmation message
      await addMessage(
        `🔄 **Wallet Action Requested**\n\n**Action:** ${walletAction.description}\n\n⏳ Preparing transaction...`,
        "ai"
      );

      if (walletAction.type === "transaction") {
        // Simple ETH transfer using wagmi
        const hash = await sendTransaction({
          to: walletAction.toAddress!,
          value: walletAction.value || parseEther("0"),
          data: walletAction.data,
        });

        await addMessage(
          `✅ **Transaction Submitted**\n\n**Hash:** \`${hash}\`\n\n*Your transaction is being processed. I'll continue helping you while we wait for confirmation.*`,
          "ai"
        );
      } else if (
        walletAction.type === "approval" ||
        walletAction.type === "swap"
      ) {
        // ERC20 approval or contract interaction using wagmi
        await writeContract({
          address: walletAction.toAddress!,
          abi: [], // Contract ABI would go here
          functionName: "approve", // Or other function name
          args: [], // Contract arguments
        });

        await addMessage(
          `✅ **Contract Interaction Submitted**\n\n*Your ${walletAction.type} is being processed.*`,
          "ai"
        );
      }
    } catch (error: any) {
      console.error("Wallet action failed:", error);

      if (error.code === 4001) {
        // User rejected transaction
        await addMessage(
          "❌ **Transaction Cancelled**\n\nNo worries! You can ask me for help with anything else.",
          "ai"
        );
      } else {
        await addMessage(
          `⚠️ **Transaction Failed**\n\n${
            error.message || "An unknown error occurred"
          }\n\nLet me know if you'd like to try again or need help with something else.`,
          "ai"
        );
      }
    }
  };

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || !user || !agentId || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      // If no current session, create one first
      let sessionToUse = currentSession;
      if (!sessionToUse) {
        console.log("Creating new agent session for message:", userMessage);
        sessionToUse = await createSession(user.id, {
          agent_id: agentId,
          mode: "agent",
        });
        if (!sessionToUse) {
          console.error("Failed to create agent session");
          setIsTyping(false);
          return;
        }
      }

      // Add user message
      await addMessage(userMessage, "user", sessionToUse);

      // Prepare message history for context
      const messageHistory: ChatMessage[] = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call agent API
      const agentResponse = await AgentService.chatWithAgent({
        userWalletAddress: walletAddress!,
        chain_id: chainId || 8453, // Use wagmi chainId, default to Base
        agent_id: agentId,
        session_id: sessionToUse.id,
        messageHistory,
        message: userMessage,
      });

      if (agentResponse.success && agentResponse.response) {
        // Add agent response
        await addMessage(agentResponse.response, "ai", sessionToUse);

        // Handle wallet actions if present
        if (agentResponse.walletAction) {
          await handleWalletAction(agentResponse.walletAction);
        }
      } else {
        await addMessage(
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
          "ai",
          sessionToUse
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      await addMessage(
        "I encountered an error while processing your request. Please try again.",
        "ai"
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-white">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Agent Header */}
        <div className="border-b border-slate-800 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">DeFi Agent</h2>
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                    Agent Mode
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  {isTyping
                    ? "Analyzing markets..."
                    : "Ready to execute • AI-Powered"}
                </p>
              </div>
            </div>

            {/* Wallet info - only show when authenticated and wallet connected */}
            {authenticated && walletAddress && balance && (
              <div className="text-right text-sm">
                <p className="text-slate-400">
                  Balance: {parseFloat(balance.formatted).toFixed(4)}{" "}
                  {balance.symbol}
                </p>
                <p className="text-slate-500">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          {!agentId && !isInitializingAgent && authenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Agent Setup Issue
              </h3>
              <p className="text-slate-400 mb-4">
                We're having trouble connecting to the agent service. This might
                be due to network connectivity or the backend service being
                temporarily unavailable.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6 max-w-md">
                <p className="text-yellow-200 text-sm">
                  <strong>Don't worry:</strong> You can still use Research Mode
                  while we resolve this issue.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setIsInitializingAgent(true);
                    // Retry agent creation
                    setTimeout(() => {
                      if (walletAddress && user) {
                        AgentService.createAgent({
                          userWalletAddress: walletAddress,
                          chain_id: chainId || 8453,
                        })
                          .then((response) => {
                            if (response.success && response.agent_id) {
                              setAgentId(response.agent_id);
                            }
                            setIsInitializingAgent(false);
                          })
                          .catch(() => {
                            setIsInitializingAgent(false);
                          });
                      } else {
                        setIsInitializingAgent(false);
                      }
                    }, 1000);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isInitializingAgent}
                >
                  {isInitializingAgent ? "Retrying..." : "Retry Setup"}
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = window.location.pathname)
                  }
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Switch to Research Mode
                </Button>
              </div>
            </div>
          ) : !authenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Welcome to Agent Mode
                </h3>
                <p className="text-slate-300 mb-6">
                  Connect your wallet to start using the DeFi Agent. Your
                  personal AI assistant will help you analyze markets, find
                  opportunities, and execute transactions.
                </p>
                <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4 mb-6">
                  <h4 className="text-purple-300 font-medium mb-2">
                    🤖 What your agent can do:
                  </h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Analyze market opportunities</li>
                    <li>• Execute DeFi transactions</li>
                    <li>• Monitor your positions</li>
                    <li>• Provide real-time insights</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : isInitializingAgent ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
              <p className="text-white font-medium">
                Initializing your agent...
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Setting up AI capabilities
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "ai"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500"
                        : "bg-slate-700"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-white">U</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {msg.role === "ai" ? "DeFi Agent" : "You"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        msg.role === "ai"
                          ? "bg-slate-800/50 border border-slate-700/50"
                          : "bg-purple-600/10 border border-purple-600/20"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">DeFi Agent</span>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
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
                        <span className="text-slate-400 text-sm ml-2">
                          Agent is analyzing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
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
              placeholder="Ask your DeFi agent anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || !agentId || isTxPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-purple-400 hover:text-purple-300 disabled:opacity-50"
              disabled={isTyping || !input.trim() || !agentId || isTxPending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
