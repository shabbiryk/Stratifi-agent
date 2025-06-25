"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Zap, Shield, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const marketOpportunities = [
  {
    id: 1,
    protocol: "Aave",
    asset: "USDC",
    apy: 12.4,
    tvl: "$2.1B",
    risk: "Low",
    category: "Lending",
    featured: true,
  },
  {
    id: 2,
    protocol: "Compound",
    asset: "ETH",
    apy: 8.7,
    tvl: "$890M",
    risk: "Low",
    category: "Lending",
    featured: false,
  },
  {
    id: 3,
    protocol: "Uniswap V3",
    asset: "ETH/USDC",
    apy: 24.1,
    tvl: "$450M",
    risk: "Medium",
    category: "LP",
    featured: true,
  },
  {
    id: 4,
    protocol: "Curve",
    asset: "3Pool",
    apy: 15.6,
    tvl: "$1.2B",
    risk: "Low",
    category: "LP",
    featured: false,
  },
  {
    id: 5,
    protocol: "Yearn",
    asset: "yvUSDC",
    apy: 18.9,
    tvl: "$320M",
    risk: "Medium",
    category: "Vault",
    featured: true,
  },
  {
    id: 6,
    protocol: "Convex",
    asset: "cvxCRV",
    apy: 22.3,
    tvl: "$210M",
    risk: "High",
    category: "Staking",
    featured: false,
  },
];

export default function marketsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-stratifi-50 via-stratifi-100 to-stratifi-200 bg-clip-text text-transparent">
              Markets
            </h1>
            <Badge
              variant="outline"
              className="border-stratifi-100/20 text-stratifi-100"
            >
              Hot
            </Badge>
          </div>
          <p className="text-slate-300 text-lg font-body">
            Discover the best yield opportunities across DeFi protocols
          </p>
        </motion.div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-stratifi-400/20 backdrop-blur-md border-stratifi-300/20">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-stratifi-100 mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-white">
                  150+
                </p>
                <p className="text-sm font-body text-slate-400">
                  Active Protocols
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
                  $12.4B
                </p>
                <p className="text-sm font-body text-slate-400">Total TVL</p>
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
                <Zap className="h-8 w-8 text-stratifi-100 mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-white">
                  15.7%
                </p>
                <p className="text-sm font-body text-slate-400">Avg APY</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketOpportunities.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: {
    id: number;
    protocol: string;
    asset: string;
    apy: number;
    tvl: string;
    risk: string;
    category: string;
    featured: boolean;
  };
  index: number;
}

function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Lending":
        return <TrendingUp className="h-4 w-4" />;
      case "LP":
        return <Zap className="h-4 w-4" />;
      case "Vault":
        return <Shield className="h-4 w-4" />;
      case "Staking":
        return <Star className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {opportunity.protocol[0]}
              </div>
              <div>
                <CardTitle className="text-white text-lg">
                  {opportunity.protocol}
                </CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  {getCategoryIcon(opportunity.category)}
                  <span>{opportunity.category}</span>
                </CardDescription>
              </div>
            </div>
            {opportunity.featured && (
              <Badge
                variant="outline"
                className="border-orange-500/20 text-orange-400"
              >
                Featured
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Asset</span>
            <span className="font-medium text-white">{opportunity.asset}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">APY</span>
            <span className="font-bold text-green-400 text-lg">
              {opportunity.apy}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">TVL</span>
            <span className="font-medium text-white">{opportunity.tvl}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Risk</span>
            <Badge variant="outline" className={getRiskColor(opportunity.risk)}>
              {opportunity.risk}
            </Badge>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4">
            <Zap className="h-4 w-4 mr-2" />
            Optimize
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
