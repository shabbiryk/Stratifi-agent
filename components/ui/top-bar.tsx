"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown, LogOut, Wallet } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Card } from "@/components/ui/card";

export function TopBar() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

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

  return (
    <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
      {/* Left side - Empty space to align with sidebar content */}
      <div className="w-8"></div>

      {/* Right side - Wallet info aligned */}
      <div className="flex items-center gap-4">
        {/* Refer & Earn Badge */}
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-400 border-red-500/30 px-3 py-1"
        >
          🔗 Refer & Earn: EAPUWK
        </Badge>

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
  );
}

export default TopBar;
