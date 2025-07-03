// Chat Welcome Screen Component
import { Badge } from "@/components/ui/badge";

interface ChatWelcomeProps {
  onPromptClick: (prompt: string) => void;
}

// Example prompts for user interaction
const EXAMPLE_PROMPTS = [
  "How should I invest $100?",
  "What's the Bitcoin price?",
  "Show me trending memecoins",
  "Analyze my portfolio",
  "Help me buy Ethereum",
  "What are the best DeFi yields?",
];

// Supported blockchain networks
const SUPPORTED_CHAINS = [
  { name: "Base", color: "bg-blue-600" },
  { name: "Starknet", color: "bg-purple-500" },
  { name: "Somnia", color: "bg-pink-500" },
];

export function ChatWelcome({ onPromptClick }: ChatWelcomeProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col justify-center min-h-full px-6 py-4 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to StratiFi
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            The simplest way to trade crypto!
          </p>

          <div className="space-y-4 mb-6 text-slate-300 max-w-2xl mx-auto">
            <p>
              New to crypto? You can ask me anything. Remember I'm an AI, I
              don't judge😉. Whenever you're ready, I'm here to help you do
              transactions with ease and confidence.
            </p>

            <p>
              Already a pro? You are about to experience a completely new way of
              trading crypto, supported by AI. You can also perform cross-chain
              transactions on:
            </p>
          </div>

          {/* Blockchain Networks */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {SUPPORTED_CHAINS.map((chain) => (
              <Badge
                key={chain.name}
                className={`${chain.color} text-white border-none hover:opacity-80`}
              >
                {chain.name}
              </Badge>
            ))}
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-yellow-500">⚠️</span>
              <span className="text-yellow-200 text-sm">
                Warning: Do not send tokens from any other chain apart from the
                ones that we support.
              </span>
            </div>
          </div>

          {/* Try an example section */}
          <div>
            <p className="text-slate-300 mb-4 text-lg">Try an example:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="text-left text-blue-400 hover:text-blue-300 hover:bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 transition-all duration-200"
                  onClick={() => onPromptClick(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
