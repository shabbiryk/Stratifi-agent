"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronUp,
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  DollarSign,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  Brain,
  BarChart3,
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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  LiveMarketFeed,
  PulseIndicator,
} from "@/components/ui/live-market-feed";
import { AnimatedCounter, RacingBars } from "@/components/ui/animated-counter";
import { AIAgentAvatar } from "@/components/ui/ai-agent-avatar";

interface MarketData {
  timestamp: string;
  price: number;
  volume: number;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketData: MarketData[];
}

interface MarketInsight {
  id: string;
  type: "opportunity" | "risk" | "rebalance" | "news";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  timestamp: string;
  value?: number;
  change?: number;
}

export default function RealTimeIntelligence() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [volatility, setVolatility] = useState(50);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("market");
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [protocolCount, setProtocolCount] = useState(1000);
  const [chainCount, setChainCount] = useState(12);
  const [isClient, setIsClient] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize client-side only values
  useEffect(() => {
    setIsClient(true);
    setLastUpdated(new Date()); // Set initial timestamp

    // Set initial random values
    setProtocolCount(Math.floor(Math.random() * 500 + 1000));
    setChainCount(Math.floor(Math.random() * 5 + 12));

    // Update these values every 30 minutes to show some activity
    const protocolInterval = setInterval(() => {
      setProtocolCount(Math.floor(Math.random() * 500 + 1000));
      setChainCount(Math.floor(Math.random() * 5 + 12));
    }, 30 * 60 * 1000); // Every 30 minutes

    return () => clearInterval(protocolInterval);
  }, []);

  // Mock assets data - using fixed base values to avoid hydration mismatch
  const assets: Asset[] = [
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      price: 3012.45,
      change24h: 2.3,
      marketData: [], // Will be populated client-side
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      price: 42568.12,
      change24h: -1.2,
      marketData: [], // Will be populated client-side
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      price: 103.78,
      change24h: 5.7,
      marketData: [], // Will be populated client-side
    },
  ];

  // Simulated AI insights
  const mockInsights: MarketInsight[] = [
    {
      id: "1",
      type: "opportunity",
      title: "AAVE Lending Rate Surge",
      description:
        "AAVE lending rates increased by 2.3% in the last hour. Consider rebalancing ETH allocation.",
      impact: "high",
      confidence: 92,
      timestamp: "2 minutes ago",
      value: 8.7,
      change: 2.3,
    },
    {
      id: "2",
      type: "risk",
      title: "High Volatility Detected",
      description:
        "SOL price volatility increased 180%. Risk management protocols activated.",
      impact: "medium",
      confidence: 87,
      timestamp: "5 minutes ago",
      value: 180,
      change: -12.4,
    },
    {
      id: "3",
      type: "rebalance",
      title: "Portfolio Rebalance Suggested",
      description:
        "Move 15% from USDC to ETH staking for +3.2% APY improvement.",
      impact: "high",
      confidence: 95,
      timestamp: "8 minutes ago",
      value: 3.2,
      change: 15,
    },
    {
      id: "4",
      type: "news",
      title: "Protocol Upgrade",
      description:
        "Compound V3 upgrade completed. Enhanced yield opportunities available.",
      impact: "medium",
      confidence: 100,
      timestamp: "15 minutes ago",
    },
  ];

  const apyComparisonData = [
    { label: "Traditional Banks", value: 0.5, color: "#ef4444" },
    { label: "DeFi Average", value: 4.2, color: "#f59e0b" },
    { label: "Our Optimization", value: 8.7, color: "#10b981" },
    { label: "AI Enhanced", value: 12.4, color: "#3b82f6" },
  ];

  // Generate market data based on volatility (client-side only)
  function generateMarketData(
    days: number,
    basePrice: number,
    volatilityFactor: number
  ): MarketData[] {
    if (!isClient) return []; // Return empty array during SSR

    const data: MarketData[] = [];
    let currentPrice = basePrice;

    for (let i = 0; i < days; i++) {
      const change =
        (Math.random() - 0.5) * (basePrice * 0.05) * (volatilityFactor / 50);
      currentPrice += change;

      const date = new Date();
      date.setDate(date.getDate() - (days - i));

      data.push({
        timestamp: date.toISOString().split("T")[0],
        price: Math.round(currentPrice * 100) / 100,
        volume: Math.round(Math.random() * 1000000 + 500000),
      });
    }

    return data;
  }

  // Show alert notification when volatility changes significantly
  useEffect(() => {
    if (volatility > 70) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [volatility]);

  // Simulate real-time insights
  useEffect(() => {
    if (!isInView || !isClient) return;

    // Initial update - trigger immediately
    const performUpdate = () => {
      setAiProcessing(true);

      setTimeout(() => {
        const randomInsight =
          mockInsights[Math.floor(Math.random() * mockInsights.length)];
        const newInsight = {
          ...randomInsight,
          id: Date.now().toString(),
          timestamp: "Just now",
          confidence: Math.floor(Math.random() * 20) + 80,
        };

        setInsights((prev) => [newInsight, ...prev.slice(0, 3)]);
        setAiProcessing(false);
        setLastUpdated(new Date()); // Update timestamp
      }, 2000);
    };

    // Trigger initial update immediately
    performUpdate();

    // Set up interval for subsequent updates every 2 hours
    const interval = setInterval(performUpdate, 2 * 60 * 60 * 1000);

    // Also set initial insights for immediate display
    setInsights(mockInsights.slice(0, 2));

    return () => clearInterval(interval);
  }, [isInView, isClient]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4" />;
      case "risk":
        return <AlertTriangle className="h-4 w-4" />;
      case "rebalance":
        return <Target className="h-4 w-4" />;
      case "news":
        return <Activity className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "risk":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "rebalance":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "news":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <section ref={ref} className="py-8 sm:py-12 lg:py-32 relative">
      <div className="px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Real-Time Market Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto text-sm sm:text-base md:text-lg text-slate-300 px-4"
          >
            Our AI continuously monitors market conditions and identifies
            optimization opportunities in real-time
          </motion.p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
          {/* AI Agent & Live Insights */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* AI Agent Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <AIAgentAvatar
                        isActive={true}
                        isTalking={aiProcessing}
                        size="lg"
                      />
                      <div>
                        <CardTitle className="flex items-center space-x-2 text-sm sm:text-base md:text-lg">
                          <span>AI Market Agent</span>
                          <PulseIndicator />
                        </CardTitle>
                        <CardDescription
                          suppressHydrationWarning
                          className="text-xs sm:text-sm"
                        >
                          Analyzing {protocolCount} protocols across{" "}
                          {chainCount} chains
                          {lastUpdated && (
                            <div className="text-xs text-slate-500 mt-1">
                              Last updated: {lastUpdated.toLocaleTimeString()}
                            </div>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-slate-400">
                        Confidence Score
                      </p>
                      <AnimatedCounter
                        value={94.7}
                        suffix="%"
                        decimals={1}
                        className="text-base sm:text-lg md:text-xl font-bold text-cyan-400"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Market Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center space-x-2 text-sm sm:text-base md:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    <span>Live Market Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <LiveMarketFeed
                    autoRefresh={true}
                    refreshInterval={60 * 60 * 1000}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Insights Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center space-x-2 text-sm sm:text-base md:text-lg">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    <span>AI Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-2 sm:space-y-4">
                    {insights.length === 0 && (
                      <div className="text-center py-4 sm:py-8 text-slate-400">
                        <Brain className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs sm:text-sm md:text-base">
                          AI is analyzing market conditions...
                        </p>
                      </div>
                    )}

                    {insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-2 sm:p-4 rounded-lg border ${getInsightColor(
                          insight.type
                        )}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            {getInsightIcon(insight.type)}
                            <h4 className="font-medium text-xs sm:text-sm md:text-base">
                              {insight.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={getImpactColor(insight.impact)}>
                              {insight.impact.toUpperCase()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{insight.timestamp}</span>
                          </div>
                          {insight.value && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>Impact: {insight.value}%</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance Metrics & Comparison */}
          <div className="space-y-4 sm:space-y-6">
            {/* Yield Performance Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">
                    Yield Performance
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    AI optimization vs traditional methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <RacingBars data={apyComparisonData} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      24h Volume Analyzed
                    </span>
                    <AnimatedCounter
                      value={847000000}
                      prefix="$"
                      className="font-medium text-white text-xs sm:text-sm md:text-base"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      Optimization Accuracy
                    </span>
                    <AnimatedCounter
                      value={96.8}
                      suffix="%"
                      decimals={1}
                      className="font-medium text-green-400 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      Gas Fees Saved
                    </span>
                    <AnimatedCounter
                      value={34500}
                      prefix="$"
                      className="font-medium text-blue-400 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      Avg. Yield Improvement
                    </span>
                    <AnimatedCounter
                      value={4.3}
                      suffix="%"
                      decimals={1}
                      className="font-medium text-purple-400 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg flex items-center space-x-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <span>Risk Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      Risk Score
                    </span>
                    <Badge
                      variant="outline"
                      className="border-green-500/20 text-green-400 text-xs"
                    >
                      Low Risk
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      Diversification
                    </span>
                    <span className="font-medium text-blue-400 text-xs sm:text-sm md:text-base">
                      Optimal
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-400">
                      Insurance Coverage
                    </span>
                    <AnimatedCounter
                      value={95}
                      suffix="%"
                      className="font-medium text-purple-400 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
