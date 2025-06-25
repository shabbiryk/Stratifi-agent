"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Wallet,
  X,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import type { JSX } from "react/jsx-runtime";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: JSX.Element;
  balance: number;
  value: number;
  apy: number;
  optimizedApy: number;
  protocol?: string;
  risk?: "low" | "medium" | "high";
}

export default function WalletConnectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);

  // Enhanced mock assets data
  const assets: Asset[] = [
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      icon: (
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          Ξ
        </div>
      ),
      balance: 3.45,
      value: 10350,
      apy: 4.2,
      optimizedApy: 7.8,
      protocol: "Lido",
      risk: "low",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      icon: (
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
          $
        </div>
      ),
      balance: 5000,
      value: 5000,
      apy: 3.5,
      optimizedApy: 8.2,
      protocol: "Aave",
      risk: "low",
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      icon: (
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
          ₿
        </div>
      ),
      balance: 0.25,
      value: 7500,
      apy: 2.1,
      optimizedApy: 5.4,
      protocol: "Compound",
      risk: "medium",
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      icon: (
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          ◎
        </div>
      ),
      balance: 75,
      value: 3750,
      apy: 5.8,
      optimizedApy: 12.3,
      protocol: "Marinade",
      risk: "medium",
    },
  ];

  const walletOptions = [
    { name: "MetaMask", icon: "🦊", popular: true },
    { name: "WalletConnect", icon: "🔗", popular: true },
    { name: "Coinbase Wallet", icon: "🔵", popular: false },
    { name: "Phantom", icon: "👻", popular: false },
  ];

  const handleConnectWallet = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setShowRipple(true);
    setShowWalletModal(true);

    setTimeout(() => setShowRipple(false), 600);
  };

  const handleWalletSelect = (walletName: string) => {
    setIsConnecting(true);
    setShowWalletModal(false);

    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedAsset(null);
  };

  const handleAssetClick = (assetId: string) => {
    setSelectedAsset(selectedAsset === assetId ? null : assetId);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <section ref={ref} className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Connect Your Wallet & Discover Opportunities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-slate-300"
          >
            Connect your wallet to discover optimized yield strategies across
            multiple DeFi protocols
          </motion.p>
        </div>

        <div className="mx-auto max-w-4xl">
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-12 text-center shadow-xl"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <Wallet className="mb-6 h-16 w-16 text-blue-500" />
              </motion.div>

              <h3 className="mb-4 text-2xl font-bold">Connect Your Wallet</h3>
              <p className="mb-8 text-slate-300 max-w-md">
                Connect your wallet to discover optimized yield strategies for
                your assets and unlock higher returns
              </p>

              <motion.div className="relative">
                <Button
                  size="lg"
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4"
                >
                  {/* Ripple effect */}
                  {showRipple && (
                    <motion.div
                      className="absolute bg-white/30 rounded-full"
                      style={{
                        left: ripplePosition.x,
                        top: ripplePosition.y,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ width: 0, height: 0 }}
                      animate={{ width: 200, height: 200 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}

                  {isConnecting ? (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-blue-500"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                      <span className="relative flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Connecting...
                      </span>
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Enhanced wallet header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4"
              >
                <div className="flex items-center">
                  <motion.div
                    className="mr-3 rounded-full bg-green-500/20 p-2"
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0 rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.5)",
                        "0 0 0 rgba(34, 197, 94, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Wallet className="h-5 w-5 text-green-500" />
                  </motion.div>
                  <div>
                    <p className="font-medium flex items-center">
                      Connected Wallet
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2 text-green-400"
                      >
                        <Check className="h-4 w-4" />
                      </motion.span>
                    </p>
                    <p className="text-sm text-slate-400">0x7Fc...3A5e</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                  <X className="mr-1 h-4 w-4" /> Disconnect
                </Button>
              </motion.div>

              {/* Portfolio overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400 mb-1">
                    Total Portfolio Value
                  </p>
                  <AnimatedCounter
                    value={26600}
                    prefix="$"
                    className="text-2xl font-bold text-white"
                  />
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400 mb-1">Current APY</p>
                  <AnimatedCounter
                    value={3.9}
                    suffix="%"
                    decimals={1}
                    className="text-2xl font-bold text-yellow-400"
                  />
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400 mb-1">Optimized APY</p>
                  <AnimatedCounter
                    value={8.4}
                    suffix="%"
                    decimals={1}
                    className="text-2xl font-bold text-green-400"
                  />
                </div>
              </motion.div>

              {/* Enhanced asset discovery */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium">Your Assets</h3>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-blue-400"
                  >
                    <Zap className="h-5 w-5" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  {assets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer overflow-hidden transition-all duration-300 bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50",
                          selectedAsset === asset.id
                            ? "ring-2 ring-blue-500 bg-slate-800/50"
                            : ""
                        )}
                        onClick={() => handleAssetClick(asset.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                {asset.icon}
                              </motion.div>
                              <div>
                                <CardTitle className="text-lg">
                                  {asset.name}
                                </CardTitle>
                                <CardDescription className="flex items-center space-x-2">
                                  <span>{asset.symbol}</span>
                                  <span
                                    className={getRiskColor(
                                      asset.risk || "low"
                                    )}
                                  >
                                    • {asset.risk || "low"} risk
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                <AnimatedCounter
                                  value={asset.balance}
                                  decimals={asset.symbol === "USDC" ? 0 : 2}
                                  enableFlip={false}
                                />{" "}
                                {asset.symbol}
                              </div>
                              <div className="text-sm text-slate-400">
                                <AnimatedCounter
                                  value={asset.value}
                                  prefix="$"
                                  enableFlip={false}
                                />
                              </div>
                            </div>
                            <motion.div
                              animate={{
                                rotate: selectedAsset === asset.id ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            </motion.div>
                          </div>
                        </CardHeader>

                        <AnimatePresence>
                          {selectedAsset === asset.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <CardContent className="p-4 pt-0 border-t border-slate-700/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-slate-400">
                                        Current APY
                                      </span>
                                      <span className="font-medium text-yellow-400">
                                        <AnimatedCounter
                                          value={asset.apy}
                                          suffix="%"
                                          decimals={1}
                                          enableFlip={false}
                                        />
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-slate-400">
                                        Optimized APY
                                      </span>
                                      <span className="font-medium text-green-400">
                                        <AnimatedCounter
                                          value={asset.optimizedApy}
                                          suffix="%"
                                          decimals={1}
                                          enableFlip={false}
                                        />
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-slate-400">
                                        Best Protocol
                                      </span>
                                      <span className="font-medium text-blue-400">
                                        {asset.protocol}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col justify-center">
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        Optimize Yield
                                      </Button>
                                    </motion.div>
                                    <div className="text-xs text-slate-400 mt-2 text-center">
                                      Potential additional revenue:
                                      <span className="text-green-400 font-medium ml-1">
                                        <AnimatedCounter
                                          value={
                                            ((asset.optimizedApy - asset.apy) *
                                              asset.value) /
                                            100
                                          }
                                          prefix="$"
                                          enableFlip={false}
                                        />
                                        /year
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Wallet Selection Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Select Wallet</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWalletModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {walletOptions.map((wallet, index) => (
                  <motion.button
                    key={wallet.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWalletSelect(wallet.name)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <span className="font-medium">{wallet.name}</span>
                      {wallet.popular && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
