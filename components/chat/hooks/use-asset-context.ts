// Custom hook for asset context handling
import { useEffect, useRef } from "react";
import { ChatSession } from "@/types/session";

interface AssetContextProps {
  token?: string | null;
  poolId?: string | null;
  action?: string | null;
  user?: any;
  sessions: any[];
  currentSession?: ChatSession | null;
  isCreatingSession: boolean;
  isCreatingNewSession?: boolean;
  createSession: (
    userId: string,
    metadata?: any
  ) => Promise<ChatSession | null>;
  setCurrentSession: (session: ChatSession | null) => void;
  loadMessages: (sessionId: string) => void;
  addMessage: (
    content: string,
    role: "user" | "ai",
    session?: ChatSession
  ) => Promise<any>;
  setShowWelcome: (show: boolean) => void;
  setIsCreatingSession: (creating: boolean) => void;
}

export function useAssetContext({
  token,
  poolId,
  action,
  user,
  sessions,
  currentSession,
  isCreatingSession,
  isCreatingNewSession,
  createSession,
  setCurrentSession,
  loadMessages,
  addMessage,
  setShowWelcome,
  setIsCreatingSession,
}: AssetContextProps) {
  // Ref to track if asset context has been handled to prevent multiple sessions
  const assetContextHandled = useRef<string | null>(null);

  // Function to generate asset details message
  const generateAssetDetailsMessage = (
    token: string,
    poolId: string,
    action: string,
    authenticated?: boolean,
    walletAddress?: string
  ) => {
    const actionText = action === "borrow" ? "borrowing" : "lending";
    const actionEmoji = action === "borrow" ? "📤" : "📥";

    return `${actionEmoji} **Asset Details from Landing Page**

**Token:** ${token.toUpperCase()}
**Pool ID:** ${poolId}
**Action:** ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}

I can help you proceed with ${actionText} ${token.toUpperCase()}. Here's what I can do:

${
  action === "borrow"
    ? `💰 **Borrowing ${token.toUpperCase()}:**
• Check your collateral requirements
• Calculate borrowing capacity
• Show current interest rates
• Execute the borrowing transaction
• Monitor your health factor`
    : `💎 **Lending ${token.toUpperCase()}:**
• Calculate potential APY earnings
• Show lending pool utilization
• Execute the lending transaction
• Track your lending rewards
• Monitor pool performance`
}

${
  !authenticated
    ? `⚠️ **Next Steps:**
1. Connect your wallet to proceed
2. I'll verify your ${action === "borrow" ? "collateral" : "balance"}
3. Prepare the transaction
4. Execute ${actionText}

Would you like me to help you connect your wallet to get started?`
    : `✅ **Wallet Connected!**
Your wallet (${walletAddress?.slice(0, 6)}...${walletAddress?.slice(
        -4
      )}) is ready.

Would you like me to:
• Check your ${
        action === "borrow"
          ? "collateral and borrowing capacity"
          : "current balance"
      }
• Show you the ${actionText} terms for this pool
• Prepare the transaction for ${actionText} ${token.toUpperCase()}?`
}`;
  };

  // Handle asset context and session creation
  useEffect(() => {
    // Only proceed if we have all required data and aren't already creating a session
    if (
      !user ||
      !token ||
      !poolId ||
      !action ||
      isCreatingSession ||
      isCreatingNewSession
    ) {
      return;
    }

    // Create a unique key for this asset context
    const contextKey = `${user.id}-${token}-${poolId}-${action}`;

    // Skip if we've already handled this exact context
    if (assetContextHandled.current === contextKey) {
      console.log("Asset context already handled:", contextKey);
      return;
    }

    console.log("Creating/loading session for asset context:", {
      token,
      poolId,
      action,
    });

    // Check for existing session with this context
    const existingSession = sessions.find((session: any) => {
      const context = session.metadata?.initialContext;
      return (
        context?.token === token &&
        context?.poolId === poolId &&
        context?.action === action
      );
    });

    if (existingSession) {
      console.log("Found existing session:", existingSession.id);
      setCurrentSession(existingSession);
      loadMessages(existingSession.id);
      assetContextHandled.current = contextKey;
      setShowWelcome(false);
    } else if (!isCreatingSession) {
      console.log("Creating new session for asset context");
      setIsCreatingSession(true);

      createSession(user.id, { token, poolId, action })
        .then((newSession) => {
          if (newSession) {
            // Add initial context message
            const contextMessage = generateAssetDetailsMessage(
              token,
              poolId,
              action
            );
            addMessage(contextMessage, "ai", newSession);
            assetContextHandled.current = contextKey;
            setShowWelcome(false);
          }
        })
        .finally(() => {
          setIsCreatingSession(false);
        });
    }
  }, [
    user,
    token,
    poolId,
    action,
    sessions,
    isCreatingSession,
    isCreatingNewSession,
    createSession,
    setCurrentSession,
    loadMessages,
    addMessage,
    setShowWelcome,
    setIsCreatingSession,
  ]);

  // Reset asset context handler when user changes
  useEffect(() => {
    if (!user) {
      assetContextHandled.current = null;
    }
  }, [user]);

  return {
    assetContextHandled,
    generateAssetDetailsMessage,
  };
}
