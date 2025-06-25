"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Lock,
  Eye,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const riskFeatures = [
  {
    icon: Shield,
    title: "Smart Contract Audits",
    description: "All protocols are verified through multiple security audits",
    riskLevel: "Low",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    icon: AlertTriangle,
    title: "Impermanent Loss Protection",
    description: "Advanced algorithms to minimize liquidity provision risks",
    riskLevel: "Medium",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
  },
  {
    icon: TrendingUp,
    title: "Volatility Monitoring",
    description:
      "Real-time tracking of asset price movements and market conditions",
    riskLevel: "Low",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    icon: Lock,
    title: "Asset Diversification",
    description: "Automatic portfolio balancing across multiple protocols",
    riskLevel: "Low",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    icon: Eye,
    title: "Transparent Reporting",
    description: "Complete visibility into all transactions and fees",
    riskLevel: "Low",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    description: "AI-powered risk assessment for every investment opportunity",
    riskLevel: "Low",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
];

const riskMetrics = [
  { label: "Protocol Security Score", value: 95, color: "bg-green-500" },
  { label: "Liquidity Coverage", value: 87, color: "bg-blue-500" },
  { label: "Market Stability", value: 78, color: "bg-purple-500" },
  { label: "Audit Compliance", value: 100, color: "bg-cyan-500" },
];

export default function RiskManagement() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 border-red-500/30 text-red-400"
          >
            Risk Management
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Safety is Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Priority
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Advanced risk management tools and protocols ensure your assets are
            protected while maximizing returns in the volatile DeFi landscape.
          </p>
        </motion.div>

        {/* Risk Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {riskMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <span className="text-lg font-bold text-white">
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Risk Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {riskFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group hover:translate-y-[-4px]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-current ${feature.color}`}
                    >
                      {feature.riskLevel} Risk
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                $2.1B+ Assets Protected
              </h3>
              <p className="text-slate-300 mb-6">
                Join thousands of users who trust our risk management systems to
                keep their investments safe.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-slate-400">
                <span>✓ Insurance Coverage</span>
                <span>✓ 24/7 Monitoring</span>
                <span>✓ Emergency Protocols</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
