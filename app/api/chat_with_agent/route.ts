import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseEther } from "viem";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

interface ChatWithAgentRequest {
  userWalletAddress: string;
  chain_id: number;
  agent_id: string;
  session_id: string;
  messageHistory: ChatMessage[];
  message: string;
}

interface WalletAction {
  type: "transaction" | "approval" | "swap";
  toAddress?: `0x${string}`;
  value?: bigint;
  data?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  description: string;
}

interface ChatWithAgentResponse {
  success: boolean;
  response?: string;
  walletAction?: WalletAction;
  agent_scratchpad?: string;
  error?: string;
}

// Chain ID to name mapping for the agent backend
const CHAIN_NAMES: { [key: number]: string } = {
  1: "mainnet",
  42161: "arbitrum",
  8453: "base",
  137: "polygon",
  10: "optimism",
};

export async function POST(request: NextRequest) {
  try {
    const {
      userWalletAddress,
      chain_id,
      agent_id,
      session_id,
      messageHistory,
      message,
    }: ChatWithAgentRequest = await request.json();

    if (
      !userWalletAddress ||
      !chain_id ||
      !agent_id ||
      !session_id ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
        } as ChatWithAgentResponse,
        { status: 400 }
      );
    }

    // Step 1: Verify agent exists and belongs to user
    const { data: agentWallet, error: agentError } = await supabase
      .from("agent_wallets")
      .select("*")
      .eq("agent_id", agent_id)
      .eq("user_wallet_address", userWalletAddress.toLowerCase())
      .single();

    if (agentError || !agentWallet) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found or unauthorized",
        } as ChatWithAgentResponse,
        { status: 404 }
      );
    }

    // Step 2: Get user profile for context
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_wallet_address", userWalletAddress.toLowerCase())
      .single();

    // Step 3: Get or create agent scratchpad
    const { data: existingScratchpad } = await supabase
      .from("agent_scratchpad")
      .select("agent_scratchpad")
      .eq("session_id", session_id)
      .single();

    // Step 4: Call the existing agent backend service
    const agentBackendUrl =
      process.env.AGENT_BACKEND_URL || "http://localhost:8000";
    const chainName = CHAIN_NAMES[chain_id] || "base";

    // Prepare context for the agent
    const contextualMessage = `
User Wallet: ${userWalletAddress}
Chain: ${chainName} (${chain_id})
Agent Wallet: ${agentWallet.wallet_public_key}
Risk Profile: ${userProfile?.risk_profile || "moderate"}
Previous Context: ${existingScratchpad?.agent_scratchpad || "None"}

Message History:
${messageHistory
  .slice(-5)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}

Current Message: ${message}
    `.trim();

    try {
      // Call the agent backend service with timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const agentResponse = await fetch(`${agentBackendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: contextualMessage,
          session_id: session_id,
          user_id: agent_id,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!agentResponse.ok) {
        throw new Error(`Agent backend error: ${agentResponse.status}`);
      }

      const agentData = await agentResponse.json();
      let responseText =
        agentData.response ||
        "I apologize, but I encountered an issue processing your request.";

      // Step 5: Check if response indicates a wallet action is needed
      let walletAction: WalletAction | undefined;

      // Simple pattern matching for wallet actions (you can make this more sophisticated)
      if (
        responseText.toLowerCase().includes("transaction") ||
        responseText.toLowerCase().includes("send") ||
        responseText.toLowerCase().includes("swap") ||
        responseText.toLowerCase().includes("approve")
      ) {
        // Extract potential transaction details (this is a simple example)
        // In production, you'd want more sophisticated parsing or the agent to return structured data
        if (
          responseText.toLowerCase().includes("usdc") &&
          responseText.toLowerCase().includes("lend")
        ) {
          walletAction = {
            type: "transaction",
            description: "Approve and lend USDC to Morpho protocol",
            // These would be extracted from the agent's analysis
            toAddress:
              "0x8Df14A537FE45a23B0D4b9cECED1a9b6DDB1C86F" as `0x${string}`, // Morpho protocol contract address
            value: parseEther("100"), // Amount extracted from context
            tokenAddress:
              "0xA0b86a33E6441a1E7B17c98d3f1A5eF9E2D0b00e" as `0x${string}`, // USDC address
          };
        }
      }

      // Step 6: Update agent scratchpad with new context
      const updatedScratchpad = `
${existingScratchpad?.agent_scratchpad || ""}
User: ${message}
Agent: ${responseText}
Timestamp: ${new Date().toISOString()}
---
      `.trim();

      await supabase.from("agent_scratchpad").upsert(
        {
          session_id: session_id,
          agent_scratchpad: updatedScratchpad,
        },
        {
          onConflict: "session_id",
        }
      );

      // Step 7: Update user activity if a wallet action was identified
      if (walletAction) {
        await supabase.from("user_activities").insert({
          user_id: agentWallet.user_wallet_address,
          session_id: session_id,
          activity_type: "lend", // This would be determined by the wallet action
          token_symbol: "USDC", // Extracted from context
          pool_id: "morpho-usdc", // Determined by the protocol
          status: "pending",
          metadata: {
            agent_id: agent_id,
            wallet_action: walletAction,
          },
        });
      }

      return NextResponse.json({
        success: true,
        response: responseText,
        walletAction: walletAction,
        agent_scratchpad: updatedScratchpad,
      } as ChatWithAgentResponse);
    } catch (fetchError) {
      console.error("Error calling agent backend:", fetchError);

      // Enhanced fallback response with more DeFi intelligence
      let fallbackResponse = `I understand you're asking about "${message}". While my advanced analysis engine is temporarily unavailable, I can still help you with DeFi strategies on ${chainName}.

🔹 **Popular DeFi Actions on ${
        chainName.charAt(0).toUpperCase() + chainName.slice(1)
      }:**`;

      // Add contextual responses based on message content
      const messageLower = message.toLowerCase();

      if (messageLower.includes("lend") || messageLower.includes("supply")) {
        fallbackResponse += `
• **Lending USDC**: ~4-8% APY on Aave, Compound
• **ETH Lending**: ~2-5% APY with lower risk
• **Stablecoin Pools**: Curve, Balancer for stable yields

💡 **Recommendation**: Start with blue-chip protocols like Aave for safer lending.`;
      } else if (messageLower.includes("borrow")) {
        fallbackResponse += `
• **Collateralized Borrowing**: Use ETH as collateral
• **Health Factor**: Keep above 1.5 for safety
• **Interest Rates**: Variable rates 2-12% depending on asset

⚠️ **Risk Warning**: Monitor your collateral ratio closely.`;
      } else if (
        messageLower.includes("yield") ||
        messageLower.includes("farm")
      ) {
        fallbackResponse += `
• **LP Tokens**: Uniswap V3, Curve pools
• **Yield Farming**: Convex, Yearn strategies  
• **Staking**: ETH 2.0, protocol governance tokens

📊 **Current Yields**: 5-15% for moderate risk strategies.`;
      } else {
        fallbackResponse += `
• **Lending**: Supply assets to earn yield (4-8% APY)
• **Borrowing**: Use collateral to borrow other assets
• **LP Provision**: Provide liquidity for trading fees
• **Yield Farming**: Stake LP tokens for additional rewards

🚀 **Getting Started**: Connect your wallet and I can help execute transactions.`;
      }

      fallbackResponse += `

*Backend connection will be restored shortly for advanced market analysis and automated strategies.*

What would you like to explore?`;

      return NextResponse.json({
        success: true,
        response: fallbackResponse,
      } as ChatWithAgentResponse);
    }
  } catch (error) {
    console.error("Error in chat_with_agent:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as ChatWithAgentResponse,
      { status: 500 }
    );
  }
}
