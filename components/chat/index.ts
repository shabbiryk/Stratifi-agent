// Export all chat-related components and services
export { ChatSection } from "../sections/chat-section";

// UI Components
export { ChatWelcome } from "./ui/chat-welcome";
export { ChatMessages } from "./ui/chat-messages";
export { ChatInput } from "./ui/chat-input";

// Hooks
export { useChatState } from "./hooks/use-chat-state";
export { useAssetContext } from "./hooks/use-asset-context";

// Services
export { AIResponseService } from "./services/ai-response.service";

// Types
export type { ChatState, ChatActions } from "./hooks/use-chat-state";
export type {
  AssetContext,
  UserContext,
  AIResponseContext,
} from "./services/ai-response.service";
