"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Brain, Check, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";

export default function ModeComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeMode, setActiveMode] = useState<"research" | "agent">(
    "research"
  );

  const handleModeChange = () => {
    setActiveMode(activeMode === "research" ? "agent" : "research");
  };

  const features = [
    {
      id: "control",
      name: "Control Level",
      research: "Full manual control",
      agent: "Automated with approvals",
      researchIcon: <Settings className="h-5 w-5" />,
      agentIcon: <Bot className="h-5 w-5" />,
    },
    {
      id: "time",
      name: "Time Investment",
      research: "High (research required)",
      agent: "Low (set and forget)",
      researchIcon: <User className="h-5 w-5" />,
      agentIcon: <Check className="h-5 w-5" />,
    },
    {
      id: "optimization",
      name: "Yield Optimization",
      research: "Manual rebalancing",
      agent: "Continuous optimization",
      researchIcon: <Search className="h-5 w-5" />,
      agentIcon: <Bot className="h-5 w-5" />,
    },
    {
      id: "strategy",
      name: "Strategy Complexity",
      research: "Based on your research",
      agent: "AI-powered strategies",
      researchIcon: <Brain className="h-5 w-5" />,
      agentIcon: <Bot className="h-5 w-5" />,
    },
  ];

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
            Choose Your Optimization Mode
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto text-lg text-slate-300"
          >
            Take control with Research Mode or let our AI handle everything with
            Agent Mode
          </motion.p>
        </div>

        <div className="mx-auto">
          {/* Mode toggle switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex flex-col items-center justify-center"
          >
            <div className="flex items-center space-x-8">
              <div
                className={cn(
                  "flex items-center space-x-2 rounded-full px-4 py-2 transition-colors",
                  activeMode === "research"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-400"
                )}
              >
                <Search className="h-5 w-5" />
                <span className="font-medium">Research Mode</span>
              </div>

              <div className="relative">
                <Switch
                  checked={activeMode === "agent"}
                  onCheckedChange={handleModeChange}
                  className="h-6 w-12 data-[state=checked]:bg-purple-600"
                />
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{
                    x: activeMode === "research" ? -5 : 5,
                  }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                />
              </div>

              <div
                className={cn(
                  "flex items-center space-x-2 rounded-full px-4 py-2 transition-colors",
                  activeMode === "agent"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-slate-400"
                )}
              >
                <Bot className="h-5 w-5" />
                <span className="font-medium">Agent Mode</span>
              </div>
            </div>
          </motion.div>

          {/* Mode comparison */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Research Mode */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={
                isInView
                  ? {
                      opacity: activeMode === "research" ? 1 : 0.7,
                      x: 0,
                      scale: activeMode === "research" ? 1 : 0.98,
                    }
                  : {}
              }
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                "rounded-xl border-2 bg-slate-900 transition-all duration-300",
                activeMode === "research"
                  ? "border-blue-500 shadow-lg shadow-blue-500/20"
                  : "border-slate-800"
              )}
            >
              <div className="p-6">
                <div className="mb-6 flex items-center">
                  <div className="mr-4 rounded-full bg-blue-500/20 p-3">
                    <Search className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Research Mode</h3>
                    <p className="text-slate-400">
                      Full control over your strategy
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-2 font-medium">How it works</h4>
                    <p className="text-sm text-slate-300">
                      You research and select the best protocols and strategies
                      for your assets. Our platform provides data and
                      recommendations, but you make the final decisions.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-2 font-medium">Perfect for</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-blue-500" />
                        <span>DeFi experts who want full control</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Users who enjoy researching protocols</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Those who want to learn more about DeFi</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Research Mode UI Preview */}
                <div className="mt-6 overflow-hidden rounded-lg border border-slate-700">
                  <div className="border-b border-slate-700 bg-slate-800 p-2">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-xs text-slate-400">
                        Research Dashboard
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3">
                    <div className="mb-2 flex items-center justify-between rounded bg-slate-800 p-2">
                      <span className="text-xs">Filter by Protocol</span>
                      <ChevronDownIcon className="h-3 w-3 text-slate-400" />
                    </div>
                    <div className="mb-2 grid grid-cols-2 gap-1">
                      <div className="rounded bg-slate-800 p-1 text-center text-xs">
                        Aave
                      </div>
                      <div className="rounded bg-slate-800 p-1 text-center text-xs">
                        Compound
                      </div>
                      <div className="rounded bg-slate-800 p-1 text-center text-xs">
                        Curve
                      </div>
                      <div className="rounded bg-slate-800 p-1 text-center text-xs">
                        Lido
                      </div>
                    </div>
                    <div className="space-y-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded bg-slate-800 p-1 text-xs"
                        >
                          <div className="flex items-center">
                            <div className="mr-1 h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Strategy {i}</span>
                          </div>
                          <span className="text-green-400">{3 + i * 2}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  className={cn(
                    "mt-6 w-full",
                    activeMode === "research"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  )}
                  onClick={() => setActiveMode("research")}
                >
                  Select Research Mode
                </Button>
              </div>
            </motion.div>

            {/* Agent Mode */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={
                isInView
                  ? {
                      opacity: activeMode === "agent" ? 1 : 0.7,
                      x: 0,
                      scale: activeMode === "agent" ? 1 : 0.98,
                    }
                  : {}
              }
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                "rounded-xl border-2 bg-slate-900 transition-all duration-300",
                activeMode === "agent"
                  ? "border-purple-500 shadow-lg shadow-purple-500/20"
                  : "border-slate-800"
              )}
            >
              <div className="p-6">
                <div className="mb-6 flex items-center">
                  <div className="mr-4 rounded-full bg-purple-500/20 p-3">
                    <Bot className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Agent Mode</h3>
                    <p className="text-slate-400">AI-powered automation</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-2 font-medium">How it works</h4>
                    <p className="text-sm text-slate-300">
                      Our AI agent continuously monitors the market and
                      automatically optimizes your portfolio based on your risk
                      preferences and goals. You approve major changes.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-2 font-medium">Perfect for</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Busy professionals with limited time</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-purple-500" />
                        <span>DeFi beginners who want expert guidance</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Users seeking maximum yield optimization</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Agent Mode UI Preview */}
                <div className="mt-6 overflow-hidden rounded-lg border border-slate-700">
                  <div className="border-b border-slate-700 bg-slate-800 p-2">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-xs text-slate-400">
                        Agent Dashboard
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3">
                    <div className="mb-2 flex items-center justify-between rounded bg-purple-500/10 p-2 text-xs text-purple-300">
                      <span>AI Agent is optimizing your portfolio</span>
                      <div className="flex space-x-1">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500"></div>
                        <div
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-2 space-y-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded bg-slate-800 p-1 text-xs"
                        >
                          <div className="flex items-center">
                            <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Optimization {i}</span>
                          </div>
                          <span className="text-green-400">+{i * 3}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded bg-green-500/10 p-1 text-center text-xs text-green-300">
                      Auto-rebalancing complete
                    </div>
                  </div>
                </div>

                <Button
                  className={cn(
                    "mt-6 w-full",
                    activeMode === "agent"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  )}
                  onClick={() => setActiveMode("agent")}
                >
                  Select Agent Mode
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Feature comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="mb-6 text-center text-2xl font-bold">
              Feature Comparison
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900">
                    <th className="p-4 text-left">Feature</th>
                    <th className="p-4 text-center">Research Mode</th>
                    <th className="p-4 text-center">Agent Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr
                      key={feature.id}
                      className={
                        index < features.length - 1
                          ? "border-b border-slate-800"
                          : ""
                      }
                    >
                      <td className="p-4">
                        <div className="font-medium">{feature.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="rounded-full bg-blue-500/20 p-1">
                            {feature.researchIcon}
                          </div>
                          <span className="text-sm">{feature.research}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="rounded-full bg-purple-500/20 p-1">
                            {feature.agentIcon}
                          </div>
                          <span className="text-sm">{feature.agent}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
