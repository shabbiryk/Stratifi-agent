"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Minimize2, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResearchChatWidgetProps {
  onClose: () => void;
  isOpen: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const RESEARCH_PROMPTS = [
  "What is DeFi lending?",
  "Explain yield farming",
  "How do liquidity pools work?",
  "What are smart contract risks?",
  "Compare lending protocols",
];

export function ResearchChatWidget({
  onClose,
  isOpen,
}: ResearchChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your DeFi research assistant. I can help you understand protocols, strategies, and market insights. What would you like to learn about?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate AI response
  const simulateResearchResponse = async (userMessage: string) => {
    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    let response = "";

    // Research-focused responses
    if (
      userMessage.toLowerCase().includes("defi") ||
      userMessage.toLowerCase().includes("lending")
    ) {
      response =
        "DeFi (Decentralized Finance) lending allows users to earn yield by providing liquidity to protocols like Aave, Compound, or Morpho. Here's how it works:\n\n• **Deposit assets** into lending pools\n• **Earn interest** from borrowers\n• **Maintain liquidity** - withdraw anytime\n• **Risk factors**: Smart contract risk, liquidation risk\n\nWould you like me to explain any specific lending protocol?";
    } else if (
      userMessage.toLowerCase().includes("yield") ||
      userMessage.toLowerCase().includes("farming")
    ) {
      response =
        "Yield farming is a strategy to maximize returns in DeFi:\n\n• **Liquidity Mining**: Provide liquidity and earn tokens\n• **Staking**: Lock tokens for rewards\n• **Compounding**: Reinvest rewards for higher yields\n• **Multi-protocol**: Spread across different platforms\n\n**Current top strategies**:\n- Morpho: 8-15% APY\n- Aave: 3-8% APY  \n- Compound: 2-6% APY\n\nWant details on any specific strategy?";
    } else if (userMessage.toLowerCase().includes("risk")) {
      response =
        "DeFi risks to consider:\n\n**Smart Contract Risk**:\n• Code bugs or exploits\n• Protocol governance changes\n\n**Market Risk**:\n• Price volatility\n• Liquidation risk in lending\n\n**Liquidity Risk**:\n• Unable to withdraw funds\n• High slippage on trades\n\n**Mitigation strategies**:\n- Diversify across protocols\n- Use audited platforms\n- Start with smaller amounts\n\nNeed more details on any risk type?";
    } else if (
      userMessage.toLowerCase().includes("compare") ||
      userMessage.toLowerCase().includes("protocol")
    ) {
      response =
        "**Top DeFi Lending Protocols Comparison**:\n\n**Aave** 🏆\n• TVL: $10B+\n• Features: Flash loans, variable/stable rates\n• Chains: 10+ networks\n\n**Compound** 💰\n• TVL: $3B+\n• Features: Algorithmic rates\n• Governance: COMP token\n\n**Morpho** ⚡\n• TVL: $1B+\n• Features: P2P matching, better rates\n• Innovation: Optimized lending\n\nWhich protocol interests you most?";
    } else {
      response =
        "I'd be happy to help with DeFi research! I can explain:\n\n• 📊 **Protocols**: Aave, Compound, Morpho, Uniswap\n• 💰 **Strategies**: Lending, yield farming, staking\n• ⚖️ **Risk Management**: Smart contract, market risks\n• 📈 **Market Analysis**: APY comparisons, trends\n\nWhat specific topic would you like to explore?";
    }

    setIsTyping(false);

    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await simulateResearchResponse(input.trim());
  };

  const handlePromptClick = async (prompt: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await simulateResearchResponse(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 bg-blue-600 hover:bg-blue-700 shadow-xl text-white px-5 rounded-full hover:scale-105 transition-all duration-200"
        >
          <Bot className="h-5 w-5 mr-2" />
          Research Assistant
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-20 right-6 w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] z-50 shadow-2xl border border-slate-700 bg-slate-900 rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="px-4 py-4 bg-blue-600 text-white flex-shrink-0 border-b border-blue-500">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Research Assistant
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 hover:bg-opacity-50 rounded-full transition-all duration-200"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 hover:bg-opacity-50 rounded-full transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-lg text-base leading-relaxed ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-700 text-slate-100 rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-100 p-4 rounded-lg rounded-bl-sm text-base">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700">
            <div className="text-sm text-slate-400 mb-3">Quick topics:</div>
            <div className="flex flex-wrap gap-2">
              {RESEARCH_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-sm h-8 px-4 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 rounded-full transition-all duration-200 whitespace-nowrap"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-700 p-4 bg-slate-800">
          <div className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about DeFi..."
              className="flex-1 bg-slate-900 border-slate-600 text-white placeholder-slate-400 text-base h-11 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 h-11 w-11 p-0 rounded-full shrink-0 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
