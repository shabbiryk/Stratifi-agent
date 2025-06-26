"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/ui/app-sidebar";
import TopBar from "@/components/ui/top-bar";

const strategies = [
  {
    id: 1,
    name: "Conservative Growth",
    description: "Low-risk, steady returns with maximum capital preservation",
    expectedApy: "6-8%",
    riskLevel: "Low",
    protocols: ["Aave", "Compound", "MakerDAO"],
    features: [
      "Blue-chip assets",
      "Minimal impermanent loss",
      "Auto-rebalancing",
    ],
    icon: <Shield className="h-6 w-6" />,
    recommended: false,
  },
  {
    id: 2,
    name: "Balanced Optimizer",
    description: "Optimal risk-reward balance with intelligent diversification",
    expectedApy: "12-15%",
    riskLevel: "Medium",
    protocols: ["Uniswap", "Curve", "Yearn"],
    features: ["Dynamic allocation", "Yield compounding", "Risk monitoring"],
    icon: <Target className="h-6 w-6" />,
    recommended: true,
  },
  {
    id: 3,
    name: "Aggressive Alpha",
    description: "Maximum yield hunting with sophisticated risk management",
    expectedApy: "20-30%",
    riskLevel: "High",
    protocols: ["Convex", "Frax", "Olympus"],
    features: ["High APY targeting", "Advanced strategies", "24/7 monitoring"],
    icon: <Zap className="h-6 w-6" />,
    recommended: false,
  },
  {
    id: 4,
    name: "DeFi Index",
    description: "Diversified exposure across top DeFi protocols",
    expectedApy: "10-12%",
    riskLevel: "Medium",
    protocols: ["Multiple", "Basket", "Rebalanced"],
    features: [
      "Protocol diversification",
      "Index tracking",
      "Regular rebalancing",
    ],
    icon: <BarChart3 className="h-6 w-6" />,
    recommended: false,
  },
];

export default function StrategiesPage() {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Strategies Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Strategies
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Choose from our AI-powered strategies designed to optimize your
              DeFi yields while managing risk
            </p>
          </motion.div>

          {/* Strategy Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">AI Powered</p>
                  <p className="text-sm text-slate-400">
                    Intelligent Optimization
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">15.7%</p>
                  <p className="text-sm text-slate-400">Average APY</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm text-slate-400">Risk Monitoring</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Strategies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {strategies.map((strategy, index) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                index={index}
              />
            ))}
          </div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <span>AI Market Intelligence</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time insights and recommendations from our AI engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">
                      Current Recommendations
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-slate-300">
                          Increase USDC allocation
                        </span>
                        <Badge
                          variant="outline"
                          className="border-green-500/30 text-green-400 bg-green-500/10"
                        >
                          High Confidence
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-slate-300">
                          Reduce ETH exposure
                        </span>
                        <Badge
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                        >
                          Medium Confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Market Outlook</h4>
                    <p className="text-sm text-slate-400">
                      Our AI predicts increased volatility in the next 48 hours.
                      Consider moving to more conservative strategies
                      temporarily.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface StrategyCardProps {
  strategy: {
    id: number;
    name: string;
    description: string;
    expectedApy: string;
    riskLevel: string;
    protocols: string[];
    features: string[];
    icon: React.ReactNode;
    recommended: boolean;
  };
  index: number;
}

function StrategyCard({ strategy, index }: StrategyCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "border-green-500/30 text-green-400 bg-green-500/10";
      case "Medium":
        return "border-yellow-500/30 text-yellow-400 bg-yellow-500/10";
      case "High":
        return "border-red-500/30 text-red-400 bg-red-500/10";
      default:
        return "border-slate-500/30 text-slate-400 bg-slate-500/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.4 }}
      className="relative"
    >
      {strategy.recommended && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge className="bg-blue-500 text-white">Recommended</Badge>
        </div>
      )}
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-blue-400">{strategy.icon}</div>
              <div>
                <CardTitle className="text-white">{strategy.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  {strategy.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Expected APY</span>
              <span className="text-lg font-bold text-green-400">
                {strategy.expectedApy}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Risk Level</span>
              <Badge
                variant="outline"
                className={getRiskColor(strategy.riskLevel)}
              >
                {strategy.riskLevel}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-slate-400 mb-2 block">
                Protocols
              </span>
              <div className="flex flex-wrap gap-1">
                {strategy.protocols.map((protocol) => (
                  <Badge
                    key={protocol}
                    variant="outline"
                    className="border-slate-600 text-slate-300 bg-slate-700/50 text-xs"
                  >
                    {protocol}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-slate-400 mb-2 block">
                Features
              </span>
              <ul className="space-y-1">
                {strategy.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-slate-300 flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Select Strategy
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
