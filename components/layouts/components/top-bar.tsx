"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  ChevronDown,
  LogOut,
  Wallet,
  MessageSquare,
  Plus,
  History,
  Clock,
} from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopBarProps {
  // Chat history props
  sessions?: any[];
  currentSession?: any;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
  showChatHistory?: boolean;
}

export function TopBar({
  sessions = [],
  currentSession,
  onSessionSelect,
  onNewSession,
  showChatHistory = false,
}: TopBarProps) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Helper function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get the primary wallet (first wallet)
  const primaryWallet = wallets[0];
  const walletAddress = primaryWallet?.address;

  // Copy address to clipboard
  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      // You can add a toast notification here
      console.log("Address copied to clipboard");
    }
  };

  // Format date for chat sessions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
        {/* Left side - Empty/Logo space */}
        <div className="flex items-center">
          {/* Future: Logo or brand name could go here */}
        </div>

        {/* Right side - Chat History + Wallet */}
        <div className="flex items-center gap-3">
          {/* Chat History Icons (only show if chat history is enabled) */}
          {showChatHistory && authenticated && (
            <>
              {/* New Chat Button - Icon Only */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onNewSession}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-lg bg-slate-800/50 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-slate-800 border-slate-700"
                >
                  <p>New Chat</p>
                </TooltipContent>
              </Tooltip>

              {/* Chat History Dropdown - Icon Only */}
              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setShowHistoryDropdown(!showHistoryDropdown)
                      }
                      className="h-10 w-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200 relative"
                    >
                      <History className="h-5 w-5" />
                      {/* Badge for session count */}
                      {sessions.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-white text-xs border-none"
                        >
                          {sessions.length > 9 ? "9+" : sessions.length}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-slate-800 border-slate-700"
                  >
                    <p>Chat History ({sessions.length})</p>
                  </TooltipContent>
                </Tooltip>

                {/* History Dropdown Content */}
                {showHistoryDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowHistoryDropdown(false)}
                    />

                    {/* Dropdown Content - Positioned to the right */}
                    <Card className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border-slate-700 z-20 max-h-96 overflow-hidden">
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Recent Conversations
                        </h3>

                        {sessions.length === 0 ? (
                          <div className="text-center py-6 text-slate-400">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No conversations yet</p>
                            <p className="text-xs opacity-70">
                              Start a new chat to begin
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1 max-h-80 overflow-y-auto">
                            {sessions.map((session: any) => (
                              <Button
                                key={session.id}
                                variant="ghost"
                                onClick={() => {
                                  onSessionSelect?.(session.id);
                                  setShowHistoryDropdown(false);
                                }}
                                className={`w-full justify-start p-3 h-auto text-left ${
                                  currentSession?.id === session.id
                                    ? "bg-blue-600/20 border border-blue-600/30 text-white"
                                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                                }`}
                              >
                                <div className="flex items-start gap-3 w-full">
                                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="text-sm font-medium truncate flex-1">
                                        {session.session_name ||
                                          "Untitled Chat"}
                                      </div>
                                      {/* Mode indicator */}
                                      {session.metadata?.mode && (
                                        <Badge
                                          variant="outline"
                                          className={`text-xs px-1.5 py-0.5 ${
                                            session.metadata.mode ===
                                            "reasoning"
                                              ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                              : "border-purple-500/30 text-purple-400 bg-purple-500/10"
                                          }`}
                                        >
                                          {session.metadata.mode === "reasoning"
                                            ? "Research"
                                            : "Agent"}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-3 w-3 opacity-50" />
                                      <span className="text-xs opacity-70">
                                        {formatDate(
                                          session.last_message_at ||
                                            session.created_at
                                        )}
                                      </span>
                                    </div>
                                    {/* Show context if available */}
                                    {session.metadata?.initialContext && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-1 py-0 border-slate-600 text-slate-400"
                                        >
                                          {session.metadata.initialContext.token?.toUpperCase()}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-1 py-0 border-slate-600 text-slate-400"
                                        >
                                          {
                                            session.metadata.initialContext
                                              .action
                                          }
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </>
                )}
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-slate-700" />
            </>
          )}

          {/* Wallet Connection */}
          {!ready ? (
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
              <span className="text-slate-400 text-sm">Loading...</span>
            </div>
          ) : !authenticated ? (
            <Button
              onClick={login}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <div className="relative">
              {/* Connected Wallet Button */}
              <Button
                variant="ghost"
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <span className="text-sm">
                  {truncateAddress(walletAddress || "")}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Dropdown Menu */}
              {showWalletDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowWalletDropdown(false)}
                  />

                  {/* Dropdown Content */}
                  <Card className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border-slate-700 z-20">
                    <div className="p-2 space-y-1">
                      {/* Copy Address */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          copyAddress();
                          setShowWalletDropdown(false);
                        }}
                        className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Address
                      </Button>

                      {/* Disconnect */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          logout();
                          setShowWalletDropdown(false);
                        }}
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default TopBar;
