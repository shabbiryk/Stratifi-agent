"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetCard, Asset, Protocol } from "./asset-card";
import { ProtocolCard } from "./protocol-card";
import { OptimizationProgress } from "./optimization-progress";
import { RiskAssessment } from "./risk-assessment";
import { ChatInterface } from "./chat-interface";
import { PoolList } from "./pool-list";

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    balance: "1.5",
    protocols: [
      {
        id: "aave",
        name: "Aave",
        type: "lend",
        apy: 3.8,
        risk: "low",
        features: ["Lending", "Borrowing"],
        pools: [
          {
            id: "aave-eth",
            name: "ETH Lending Pool",
            apy: 3.8,
            tvl: "1.2B",
            risk: "low",
          },
        ],
      },
      {
        id: "compound",
        name: "Compound",
        type: "borrow",
        apy: 2.5,
        risk: "medium",
        features: ["Borrowing", "Lending"],
        pools: [
          {
            id: "compound-eth",
            name: "ETH Borrowing Pool",
            apy: 2.5,
            tvl: "800M",
            risk: "medium",
          },
        ],
      },
    ],
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    balance: "0.5",
    protocols: [
      {
        id: "hodlnaut",
        name: "Hodlnaut",
        type: "lend",
        apy: 5.2,
        risk: "medium",
        features: ["Lending", "Weekly payouts", "No lockup period"],
        pools: [
          {
            id: "hodlnaut-btc",
            name: "BTC Lending Pool",
            apy: 5.2,
            tvl: "500M",
            risk: "medium",
          },
        ],
      },
      {
        id: "celsius",
        name: "Celsius",
        type: "borrow",
        apy: 6.5,
        risk: "high",
        features: ["High yield", "Borrowing", "Loyalty tiers"],
        pools: [
          {
            id: "celsius-btc",
            name: "BTC Borrowing Pool",
            apy: 6.5,
            tvl: "300M",
            risk: "high",
          },
        ],
      },
    ],
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    icon: "$",
    balance: "5000",
    protocols: [
      {
        id: "aave-usdc",
        name: "Aave",
        type: "lend",
        apy: 4.2,
        risk: "low",
        features: ["Lending", "Borrowing"],
        pools: [
          {
            id: "aave-usdc-pool",
            name: "USDC Lending Pool",
            apy: 4.2,
            tvl: "2.5B",
            risk: "low",
          },
        ],
      },
    ],
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    balance: "10",
    protocols: [
      {
        id: "solend",
        name: "Solend",
        type: "lend",
        apy: 7.2,
        risk: "medium",
        features: ["Lending", "High APY"],
        pools: [
          {
            id: "solend-sol",
            name: "SOL Lending Pool",
            apy: 7.2,
            tvl: "200M",
            risk: "medium",
          },
        ],
      },
    ],
  },
];

export default function AssetOptimization() {
  // const { user, ready, login } = usePrivy();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "borrow" | "lend" | null
  >(null);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Fetch wallet assets when connected
  useEffect(() => {
    // For demo purposes, always show mock data
    // In a real implementation, you would fetch the user's wallet assets here
    setWalletAssets(mockAssets);
  }, []);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      // await login();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAssetSelect = (assetId: string) => {
    console.log("Asset selected:", assetId);
    console.log(
      "Before reset - selectedAction:",
      selectedAction,
      "showChat:",
      showChat
    );
    setSelectedAsset(assetId);
    setSelectedAction(null);
    setSelectedPool(null);
    setIsOptimized(false);
    setOptimizationProgress(0);
    setShowChat(true);
    console.log(
      "After setting - showChat should be true, selectedAction should be null"
    );
  };

  const handleActionSelect = (action: "borrow" | "lend") => {
    console.log("Action selected:", action);
    setSelectedAction(action);
    setShowChat(false);
    console.log("showChat set to false, selectedAction:", action);
  };

  const handlePoolSelect = (poolId: string) => {
    console.log("Pool selected:", poolId);
    setSelectedPool(poolId);
  };

  const handleOptimize = () => {
    if (!selectedAsset || !selectedAction || !selectedPool) return;

    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsOptimizing(false);
            setIsOptimized(true);
          }, 500);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const selectedAssetData = walletAssets.find((a) => a.id === selectedAsset);
  const selectedProtocol = selectedAssetData?.protocols.find(
    (p) => p.type === selectedAction
  );

  // Temporarily disable Privy checks for debugging
  // if (!ready) {
  //   return (
  //     <div className="flex h-[50vh] items-center justify-center">
  //       <p className="text-slate-400">Loading...</p>
  //     </div>
  //   );
  // }

  // For demo purposes, allow interaction without wallet connection
  // if (!user) {
  //   return (
  //     <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
  //       <p className="text-slate-400">Please connect your wallet to continue</p>
  //       <Button
  //         onClick={handleConnectWallet}
  //         disabled={isConnecting}
  //         className="bg-blue-600 hover:bg-blue-700"
  //       >
  //         {isConnecting ? "Connecting..." : "Connect Wallet"}
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="px-4">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Asset Optimization Engine
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto text-lg text-slate-300"
          >
            Optimize your assets across multiple protocols
          </motion.p>
        </div>

        <div className="mx-auto">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Asset Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4"
            >
              <div className="mb-4 flex items-center">
                <div className="mr-2 rounded-full bg-blue-500/20 p-1">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium">Your Assets</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {walletAssets.map((asset, index) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset === asset.id}
                    onSelect={handleAssetSelect}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-8"
            >
              {(() => {
                console.log("=== RENDERING DEBUG ===");
                console.log("selectedAsset:", selectedAsset);
                console.log("showChat:", showChat);
                console.log("selectedAction:", selectedAction);
                console.log("hasSelectedAssetData:", !!selectedAssetData);

                if (!selectedAsset) {
                  console.log("RENDER PATH: No asset selected");
                  return (
                    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 p-8 text-center">
                      <div className="mb-4 rounded-full bg-slate-800 p-4">
                        <Sparkles className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-medium">
                        Select an Asset to Optimize
                      </h3>
                      <p className="text-slate-400">
                        Choose an asset from your wallet to begin optimization
                      </p>
                    </div>
                  );
                }

                if (showChat) {
                  console.log("RENDER PATH: Chat interface");
                  return (
                    <ChatInterface
                      asset={selectedAssetData!}
                      onSelect={handleActionSelect}
                    />
                  );
                }

                if (selectedAction) {
                  console.log(
                    "RENDER PATH: Protocol list for action:",
                    selectedAction
                  );

                  // Show optimization progress if optimizing
                  if (isOptimizing) {
                    return (
                      <div className="rounded-xl border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                                {selectedAssetData?.icon}
                              </div>
                              <div>
                                <h3 className="text-xl font-medium">
                                  {selectedAssetData?.name} Optimization
                                </h3>
                                <p className="text-sm text-slate-400">
                                  Finding the best yield strategies
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span>Optimization in progress...</span>
                              <span>{Math.round(optimizationProgress)}%</span>
                            </div>
                            <OptimizationProgress
                              progress={optimizationProgress}
                              protocolCount={
                                selectedAssetData?.protocols.filter(
                                  (p) => p.type === selectedAction
                                ).length || 0
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Show optimization results if optimized
                  if (isOptimized) {
                    const bestProtocol = selectedAssetData?.protocols
                      .filter((p) => p.type === selectedAction)
                      .reduce((best, current) =>
                        current.apy > best.apy ? current : best
                      );

                    return (
                      <div className="rounded-xl border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                                {selectedAssetData?.icon}
                              </div>
                              <div>
                                <h3 className="text-xl font-medium">
                                  {selectedAssetData?.name} Optimization
                                </h3>
                                <p className="text-sm text-slate-400">
                                  Optimization complete
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="rounded-full bg-green-500/20 p-2">
                                  <Sparkles className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Optimization Complete
                                  </h4>
                                  <p className="text-sm text-slate-300">
                                    We've found the optimal strategy for your{" "}
                                    {selectedAssetData?.name}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-slate-400">
                                  Potential APY
                                </p>
                                <p className="text-2xl font-bold text-green-500">
                                  {bestProtocol
                                    ? (bestProtocol.apy * 1.1).toFixed(1)
                                    : "0.0"}
                                  %
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <div className="mb-6">
                            <h4 className="mb-3 font-medium">
                              Recommended Strategy
                            </h4>
                            <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-2">
                                    <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                      {bestProtocol?.name.charAt(0)}
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium">
                                      {bestProtocol?.name}
                                    </h5>
                                    <p className="text-sm text-slate-400">
                                      Recommended for{" "}
                                      {selectedAction === "lend"
                                        ? "lending"
                                        : "borrowing"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-slate-400">APY</p>
                                  <p className="text-xl font-bold text-green-400">
                                    {bestProtocol?.apy}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <RiskAssessment
                            protocols={
                              selectedAssetData?.protocols.filter(
                                (p) => p.type === selectedAction
                              ) || []
                            }
                          />

                          <div className="mt-6">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Apply Optimized Strategy
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Show protocol list (default state)
                  return (
                    <div className="rounded-xl border border-slate-800 bg-slate-900">
                      <div className="border-b border-slate-800 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                              {selectedAssetData?.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-medium">
                                {selectedAssetData?.name} Optimization
                              </h3>
                              <p className="text-sm text-slate-400">
                                Finding the best yield strategies
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={handleOptimize}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Optimize Now
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="mb-3 font-medium">
                          Available Protocols for {selectedAssetData?.name}
                        </h4>
                        <div className="space-y-3">
                          {selectedAssetData?.protocols
                            .filter((p) => p.type === selectedAction)
                            .map((protocol, index) => (
                              <motion.div
                                key={protocol.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.1 + index * 0.1,
                                }}
                                className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-2">
                                      <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                        {protocol.name.charAt(0)}
                                      </div>
                                    </div>
                                    <div>
                                      <h5 className="font-medium">
                                        {protocol.name}
                                      </h5>
                                      <p className="text-sm text-slate-400">
                                        Protocol for {selectedAssetData?.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-slate-400">
                                      Current APY
                                    </p>
                                    <p className="text-xl font-bold text-green-400">
                                      {protocol.apy}%
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {protocol.features.map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm">Risk Level:</span>
                                    <span
                                      className={`text-sm ${
                                        protocol.risk === "low"
                                          ? "text-green-400"
                                          : protocol.risk === "medium"
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {protocol.risk}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 hover:bg-slate-800"
                                    onClick={() =>
                                      handlePoolSelect(protocol.pools[0].id)
                                    }
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center">
                          <Button
                            onClick={handleOptimize}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Find Optimal Strategy{" "}
                            <Sparkles className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                console.log("RENDER PATH: Fallback state");
                return (
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 p-8 text-center">
                    <div className="mb-4 rounded-full bg-slate-800 p-4">
                      <Sparkles className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium">
                      Please select an action
                    </h3>
                    <p className="text-slate-400">
                      Choose whether you want to borrow or lend
                    </p>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
