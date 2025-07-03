// Chat Messages Component
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { ChatMessage } from "@/types/session";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  onCopyMessage: (content: string) => void;
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1">
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
      <span className="text-slate-400 text-sm ml-2">AI is typing</span>
    </div>
  );
}

export function ChatMessages({
  messages,
  isTyping,
  messagesEndRef,
  chatContainerRef,
  onCopyMessage,
}: ChatMessagesProps) {
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Header */}
      <div className="border-b border-slate-800 p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <div>
            <h2 className="font-semibold">StratiFi AI Assistant</h2>
            <p className="text-sm text-slate-400">
              {isTyping ? "Typing..." : "Online • Ready to help with crypto"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#475569 #1e293b",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-4 group">
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "ai"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-slate-700"
              }`}
            >
              <span className="text-xs font-bold text-white">
                {msg.role === "ai" ? "AI" : "U"}
              </span>
            </div>

            {/* Message Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {msg.role === "ai" ? "StratiFi AI" : "You"}
                </span>
                <span className="text-xs text-slate-500">
                  {formatTime(new Date(msg.created_at))}
                </span>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  msg.role === "ai"
                    ? "bg-slate-800/50 border border-slate-700/50"
                    : "bg-blue-600/10 border border-blue-600/20"
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {msg.content}
                </p>
              </div>

              {/* Message Actions */}
              {msg.role === "ai" && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopyMessage(msg.content)}
                    className="h-7 px-2 text-slate-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-slate-400 hover:text-white"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-slate-400 hover:text-white"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">StratiFi AI</span>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
