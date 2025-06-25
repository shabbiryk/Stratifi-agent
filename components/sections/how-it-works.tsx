"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Wallet, Brain, TrendingUp, Repeat, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Connect Your Wallet",
    description:
      "Securely link your cryptocurrency wallet to our platform. We support all major wallets including MetaMask, WalletConnect, and Coinbase Wallet.",
    details: [
      "One-click wallet integration",
      "Bank-level security protocols",
      "No private key sharing required",
      "Multi-wallet support",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analyzes Markets",
    description:
      "Our advanced AI algorithms scan thousands of DeFi protocols in real-time to identify the highest-yielding opportunities that match your risk profile.",
    details: [
      "Real-time market analysis",
      "Risk assessment algorithms",
      "Yield optimization strategies",
      "Protocol security verification",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Optimize Your Portfolio",
    description:
      "Based on AI analysis, your assets are automatically allocated across the best DeFi protocols to maximize returns while minimizing risk.",
    details: [
      "Automated asset allocation",
      "Dynamic rebalancing",
      "Gas fee optimization",
      "Compound interest maximization",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    number: "04",
    icon: Repeat,
    title: "Continuous Monitoring",
    description:
      "Our system continuously monitors market conditions and automatically adjusts your portfolio to maintain optimal performance and protection.",
    details: [
      "24/7 market monitoring",
      "Automatic rebalancing",
      "Risk threshold alerts",
      "Performance tracking",
    ],
    color: "from-orange-500 to-red-500",
  },
];

const features = [
  { title: "Set and Forget", description: "Fully automated optimization" },
  { title: "Real-time Alerts", description: "Stay informed of all changes" },
  { title: "Transparent Fees", description: "No hidden costs or surprises" },
  { title: "Instant Withdrawals", description: "Access your funds anytime" },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 border-purple-500/30 text-purple-400"
          >
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Started in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-slate-300 mx-auto">
            Our AI-powered platform makes DeFi investing simple and profitable.
            Just connect your wallet and let our algorithms do the rest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="relative"
            >
              <Card className="relative bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <CardHeader className="relative">
                  <div className="flex items-center mb-4">
                    <div
                      className={`relative p-4 rounded-xl bg-gradient-to-br ${step.color} mr-4`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-slate-600 lg:hidden" />
                  </div>

                  <CardTitle className="text-2xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-center text-slate-400"
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} mr-3 flex-shrink-0`}
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-900/30 border-slate-800 text-center"
            >
              <CardContent className="p-6">
                <h4 className="font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="relative bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 mb-16 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Average Time to Start Earning
            </h3>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
                <div className="text-slate-400">Minutes Setup</div>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-600" />
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">24</div>
                <div className="text-slate-400">Hours to First Yield</div>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-600" />
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  30
                </div>
                <div className="text-slate-400">Days to Full Optimization</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-slate-300 mb-6">
                Join thousands of users who are already earning higher yields
                with AI-powered DeFi optimization.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Optimizing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
