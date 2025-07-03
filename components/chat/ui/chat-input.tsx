// Chat Input Component
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  input: string;
  authenticated: boolean;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatInput({
  input,
  authenticated,
  isTyping,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="border-t border-slate-800 p-3 flex-shrink-0">
      <form
        className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        <Input
          className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:outline-none"
          placeholder={
            !authenticated
              ? "Please connect your wallet to start chatting..."
              : "Ask me anything about crypto..."
          }
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isTyping || !authenticated}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white"
          aria-label="Voice input"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
          disabled={isTyping || !input.trim()}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
