"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Cog,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  protocols: Protocol[];
}

interface Protocol {
  id: string;
  name: string;
  apy: number;
  risk: "low" | "medium" | "high";
  features: string[];
}

export default function AssetOptimization() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Mock assets data
  const assets: Asset[] = [
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      icon: "Ξ",
      protocols: [
        {
          id: "lido",
          name: "Lido",
          apy: 3.8,
          risk: "low",
          features: ["Liquid staking", "No lockup period", "Decentralized"],
        },
        {
          id: "aave",
          name: "Aave",
          apy: 2.1,
          risk: "medium",
          features: ["Lending", "Borrowing", "Flash loans"],
        },
        {
          id: "curve",
          name: "Curve",
          apy: 4.5,
          risk: "medium",
          features: ["Liquidity provision", "Low slippage", "Stablecoin focus"],
        },
      ],
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "₿",
      protocols: [
        {
          id: "hodlnaut",
          name: "Hodlnaut",
          apy: 5.2,
          risk: "medium",
          features: ["Lending", "Weekly payouts", "No lockup period"],
        },
        {
          id: "celsius",
          name: "Celsius",
          apy: 6.5,
          risk: "high",
          features: ["High yield", "Borrowing", "Loyalty tiers"],
        },
      ],
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      icon: "$",
      protocols: [
        {
          id: "compound",
          name: "Compound",
          apy: 3.2,
          risk: "low",
          features: ["Lending", "Governance", "Automated interest rates"],
        },
        {
          id: "yearn",
          name: "Yearn Finance",
          apy: 8.1,
          risk: "high",
          features: [
            "Yield optimization",
            "Auto-compounding",
            "Strategy vaults",
          ],
        },
      ],
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      icon: "◎",
      protocols: [
        {
          id: "marinade",
          name: "Marinade Finance",
          apy: 6.8,
          risk: "medium",
          features: ["Liquid staking", "Governance", "No lockup period"],
        },
        {
          id: "solend",
          name: "Solend",
          apy: 5.3,
          risk: "medium",
          features: ["Lending", "Borrowing", "Multiple markets"],
        },
      ],
    },
  ];

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId);
    setIsOptimized(false);
    setOptimizationProgress(0);
  };

  const handleOptimize = () => {
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
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 3000);
          }, 500);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const selectedAssetData = assets.find((a) => a.id === selectedAsset);

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
            Discover the highest yields across multiple protocols with our
            advanced optimization engine
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
                <h3 className="text-xl font-medium">Select an Asset</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {assets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:border-blue-500/50",
                        selectedAsset === asset.id
                          ? "border-blue-500 bg-blue-500/5"
                          : ""
                      )}
                      onClick={() => handleAssetSelect(asset.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                              {asset.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {asset.name}
                              </CardTitle>
                              <CardDescription>{asset.symbol}</CardDescription>
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 text-slate-400 transition-transform",
                              selectedAsset === asset.id
                                ? "rotate-90 text-blue-500"
                                : ""
                            )}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Optimization Engine */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-8"
            >
              {!selectedAsset ? (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 p-8 text-center">
                  <div className="mb-4 rounded-full bg-slate-800 p-4">
                    <Cog className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">
                    Select an Asset to Optimize
                  </h3>
                  <p className="text-slate-400">
                    Choose an asset from the left to discover the highest yield
                    opportunities
                  </p>
                </div>
              ) : (
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

                      {!isOptimizing && !isOptimized && (
                        <Button
                          onClick={handleOptimize}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Optimize Now
                        </Button>
                      )}
                    </div>

                    {isOptimizing && (
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>Optimization in progress...</span>
                          <span>{Math.round(optimizationProgress)}%</span>
                        </div>
                        <Progress
                          value={optimizationProgress}
                          className="h-2 bg-slate-700"
                          indicatorClassName="bg-blue-500"
                        />
                        <div className="mt-2 flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20">
                            <Cog className="h-2.5 w-2.5 animate-spin text-blue-500" />
                          </div>
                          <span>
                            Scanning {selectedAssetData?.protocols.length}{" "}
                            protocols for best yields
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {isOptimized ? (
                      <div className="relative">
                        {showParticles && <OptimizationParticles />}

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="mb-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="rounded-full bg-green-500/20 p-2">
                                <Check className="h-5 w-5 text-green-500" />
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
                                {(
                                  Math.max(
                                    ...(selectedAssetData?.protocols.map(
                                      (p) => p.apy
                                    ) || [0])
                                  ) * 1.1
                                ).toFixed(1)}
                                %
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <div className="mb-6">
                          <h4 className="mb-3 font-medium">
                            Optimized Strategy
                          </h4>
                          <div className="rounded-lg border border-slate-800 bg-slate-800/50">
                            <div className="border-b border-slate-700 p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">Protocol</div>
                                <div className="font-medium">Allocation</div>
                                <div className="font-medium">APY</div>
                                <div className="font-medium">Risk</div>
                              </div>
                            </div>
                            <div className="p-1">
                              {selectedAssetData?.protocols
                                .sort((a, b) => b.apy - a.apy)
                                .map((protocol, index) => (
                                  <motion.div
                                    key={protocol.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 0.1 + index * 0.1,
                                    }}
                                    className={cn(
                                      "m-2 flex items-center justify-between rounded-lg p-3",
                                      index === 0
                                        ? "bg-blue-500/20 ring-1 ring-blue-500/30"
                                        : "bg-slate-700/50"
                                    )}
                                  >
                                    <div className="font-medium">
                                      {protocol.name}
                                    </div>
                                    <div>
                                      {index === 0
                                        ? "70%"
                                        : index === 1
                                        ? "30%"
                                        : "0%"}
                                    </div>
                                    <div
                                      className={
                                        index === 0
                                          ? "font-bold text-green-500"
                                          : "text-slate-300"
                                      }
                                    >
                                      {protocol.apy.toFixed(1)}%
                                    </div>
                                    <div>
                                      <span
                                        className={cn(
                                          "rounded-full px-2 py-1 text-xs",
                                          protocol.risk === "low"
                                            ? "bg-green-500/20 text-green-400"
                                            : protocol.risk === "medium"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-red-500/20 text-red-400"
                                        )}
                                      >
                                        {protocol.risk}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <h4 className="mb-3 font-medium">Risk Assessment</h4>
                          <div className="mb-6 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
                            <div className="mb-4 flex items-center justify-between">
                              <span className="text-sm">Low Risk</span>
                              <span className="text-sm">High Risk</span>
                            </div>
                            <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-700">
                              <motion.div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                                initial={{ width: "100%" }}
                                style={{
                                  clipPath:
                                    "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                                }}
                              />
                              <motion.div
                                className="absolute h-full w-3 translate-x-[30%] bg-white"
                                initial={{ x: "0%" }}
                                animate={{ x: "30%" }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                            <div className="mt-2 text-center text-sm">
                              This strategy has a{" "}
                              <span className="font-medium text-yellow-400">
                                medium
                              </span>{" "}
                              risk profile
                            </div>
                          </div>

                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Apply Optimized Strategy{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    ) : !isOptimizing ? (
                      <div>
                        <h4 className="mb-3 font-medium">
                          Available Protocols for {selectedAssetData?.name}
                        </h4>
                        <div className="space-y-3">
                          {selectedAssetData?.protocols.map(
                            (protocol, index) => (
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
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-slate-700 p-2">
                                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                                    </div>
                                    <div>
                                      <h5 className="font-medium">
                                        {protocol.name}
                                      </h5>
                                      <p className="text-xs text-slate-400">
                                        Protocol for {selectedAssetData?.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-slate-400">
                                      Current APY
                                    </p>
                                    <p className="text-xl font-bold">
                                      {protocol.apy.toFixed(1)}%
                                    </p>
                                  </div>
                                </div>

                                <div className="mb-3 flex flex-wrap gap-2">
                                  {protocol.features.map((feature, i) => (
                                    <span
                                      key={i}
                                      className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Gauge className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm">Risk Level:</span>
                                    <span
                                      className={cn(
                                        "text-sm",
                                        protocol.risk === "low"
                                          ? "text-green-400"
                                          : protocol.risk === "medium"
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                      )}
                                    >
                                      {protocol.risk}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 hover:bg-slate-800"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            )
                          )}
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
                    ) : (
                      <div className="flex h-64 flex-col items-center justify-center">
                        <div className="mb-4 flex items-center justify-center">
                          <div className="relative h-16 w-16">
                            <motion.div
                              className="absolute h-full w-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            />
                            <motion.div
                              className="absolute h-full w-full rounded-full border-4 border-t-transparent border-r-purple-500 border-b-transparent border-l-transparent"
                              animate={{ rotate: -180 }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            />
                            <Cog className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                        </div>
                        <h4 className="mb-2 text-lg font-medium">
                          Optimizing Your Strategy
                        </h4>
                        <p className="text-center text-slate-400">
                          Our AI is analyzing{" "}
                          {selectedAssetData?.protocols.length} protocols to
                          find the best yield strategy for your{" "}
                          {selectedAssetData?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OptimizationParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(canvas: HTMLCanvasElement) {
        if (!canvas) {
          throw new Error("Canvas element is required");
        }
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particlesArray: Particle[] = [];

    function createParticles() {
      if (!canvas) return;
      for (let i = 0; i < 10; i++) {
        particlesArray.push(new Particle(canvas));
      }
    }

    function handleParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        if (particlesArray[i].size <= 0.2) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      createParticles();
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
