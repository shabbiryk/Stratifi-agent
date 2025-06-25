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
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-stratifi-50 via-stratifi-100 to-stratifi-200 bg-clip-text text-transparent mb-4">
            AI Strategies
          </h1>
          <p className="text-slate-300 text-lg font-body max-w-2xl">
            Choose from our AI-powered strategies designed to optimize your DeFi
            yields while managing risk
          </p>
        </motion.div>

        {/* Strategy Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-stratifi-400/20 backdrop-blur-md border-stratifi-300/20">
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-stratifi-100 mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-white">
                  AI Powered
                </p>
                <p className="text-sm font-body text-slate-400">
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
            <Card className="bg-stratifi-400/20 backdrop-blur-md border-stratifi-300/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-stratifi-100 mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-white">
                  15.7%
                </p>
                <p className="text-sm font-body text-slate-400">Average APY</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-stratifi-400/20 backdrop-blur-md border-stratifi-300/20">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-stratifi-100 mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-white">
                  24/7
                </p>
                <p className="text-sm font-body text-slate-400">
                  Risk Monitoring
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategies.map((strategy, index) => (
            <StrategyCard key={strategy.id} strategy={strategy} index={index} />
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-stratifi-400/20 backdrop-blur-md border-stratifi-300/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white font-heading">
                <Brain className="h-5 w-5 text-stratifi-100" />
                <span>AI Market Intelligence</span>
              </CardTitle>
              <CardDescription className="font-body">
                Real-time insights and recommendations from our AI engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-heading font-medium text-white">
                    Current Recommendations
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-stratifi-400/10 rounded-lg">
                      <span className="text-sm font-body text-slate-300">
                        Increase USDC allocation
                      </span>
                      <Badge
                        variant="outline"
                        className="border-green-500/20 text-green-400"
                      >
                        High Confidence
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-stratifi-400/10 rounded-lg">
                      <span className="text-sm font-body text-slate-300">
                        Reduce ETH exposure
                      </span>
                      <Badge
                        variant="outline"
                        className="border-yellow-500/20 text-yellow-400"
                      >
                        Medium Confidence
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-heading font-medium text-white">
                    Market Conditions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-body text-slate-400">
                        Volatility
                      </span>
                      <span className="text-sm font-body text-green-400">
                        Low
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-body text-slate-400">
                        Yield Environment
                      </span>
                      <span className="text-sm font-body text-blue-400">
                        Favorable
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-body text-slate-400">
                        Risk Level
                      </span>
                      <span className="text-sm font-body text-purple-400">
                        Moderate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
        return "border-green-500/20 text-green-400";
      case "Medium":
        return "border-yellow-500/20 text-yellow-400";
      case "High":
        return "border-red-500/20 text-red-400";
      default:
        return "border-slate-500/20 text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="relative"
    >
      <Card
        className={`bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 h-full ${
          strategy.recommended ? "ring-2 ring-blue-500/20" : ""
        }`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                {strategy.icon}
              </div>
              <div>
                <CardTitle className="text-white text-xl">
                  {strategy.name}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {strategy.description}
                </CardDescription>
              </div>
            </div>
            {strategy.recommended && (
              <Badge
                variant="outline"
                className="border-blue-500/20 text-blue-400"
              >
                Recommended
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 text-sm">Expected APY</span>
              <p className="font-bold text-green-400 text-lg">
                {strategy.expectedApy}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Risk Level</span>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={getRiskColor(strategy.riskLevel)}
                >
                  {strategy.riskLevel}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Key Features</h4>
            <ul className="space-y-1">
              {strategy.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-300 flex items-center space-x-2"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Protocols</h4>
            <div className="flex flex-wrap gap-2">
              {strategy.protocols.map((protocol, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {protocol}
                </Badge>
              ))}
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4">
            <Brain className="h-4 w-4 mr-2" />
            Deploy Strategy
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
