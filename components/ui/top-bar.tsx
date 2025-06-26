"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function TopBar() {
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

        {/* Wallet Address */}
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
          <span className="text-slate-300 text-sm">0x9A7AD...50F61</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
