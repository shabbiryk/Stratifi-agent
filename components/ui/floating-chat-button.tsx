"use client";

import React, { useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResearchChatWidget } from "./research-chat-widget";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
          aria-label={
            isOpen ? "Close Research Assistant" : "Open Research Assistant"
          }
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white transition-transform duration-200" />
          ) : (
            <div className="flex items-center justify-center">
              <Bot className="h-6 w-6 text-white transition-transform duration-200 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Research Chat Widget */}
      {isOpen && (
        <ResearchChatWidget onClose={() => setIsOpen(false)} isOpen={isOpen} />
      )}
    </>
  );
}
