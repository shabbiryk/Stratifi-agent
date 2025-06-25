"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Asset } from "./asset-card";
import { MessageCircle, TrendingUp, TrendingDown } from "lucide-react";

interface ChatInterfaceProps {
  asset: Asset;
  onSelect: (action: "borrow" | "lend") => void;
}

export function ChatInterface({ asset, onSelect }: ChatInterfaceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-800 bg-slate-900 p-6"
    >
      {/* Chat Header */}
      <div className="mb-6 flex items-center">
        <div className="mr-3 rounded-full bg-blue-500/20 p-2">
          <MessageCircle className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Asset Optimization Assistant</h3>
          <p className="text-sm text-slate-400">
            What would you like to do with your {asset.name}?
          </p>
        </div>
      </div>

      {/* AI Message */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-start">
          <div className="mr-3 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </div>
          </div>
          <div className="flex-1">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-4">
                <p className="text-sm">
                  I can help you optimize your{" "}
                  <span className="font-medium text-blue-400">
                    {asset.symbol}
                  </span>{" "}
                  holdings. Would you like to earn yield by lending your assets,
                  or would you prefer to borrow against them?
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Action Options */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            onClick={() => onSelect("lend")}
            className="w-full justify-start bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 text-green-400 h-auto p-4"
          >
            <div className="flex items-center">
              <TrendingUp className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Lend & Earn Yield</div>
                <div className="text-xs text-green-400/70">
                  Supply your {asset.symbol} to earn passive income
                </div>
              </div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button
            onClick={() => onSelect("borrow")}
            className="w-full justify-start bg-orange-600/20 border border-orange-600/30 hover:bg-orange-600/30 text-orange-400 h-auto p-4"
          >
            <div className="flex items-center">
              <TrendingDown className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Borrow Against Assets</div>
                <div className="text-xs text-orange-400/70">
                  Use your {asset.symbol} as collateral to borrow other assets
                </div>
              </div>
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Asset Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-6 rounded-lg border border-slate-700 bg-slate-800/30 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-lg font-bold">
              {asset.icon}
            </div>
            <div>
              <div className="font-medium">{asset.name}</div>
              <div className="text-sm text-slate-400">{asset.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Balance</div>
            <div className="font-medium">
              {asset.balance} {asset.symbol}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
