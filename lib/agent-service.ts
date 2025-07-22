import { parseEther, formatEther } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

interface CreateAgentParams {
  userWalletAddress: string;
  chain_id: number;
}

interface CreateAgentResponse {
  success: boolean;
  agent_id?: string;
  error?: string;
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

interface ChatWithAgentParams {
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

export class AgentService {
  /**
   * Create an agent for a user
   */
  static async createAgent(
    params: CreateAgentParams
  ): Promise<CreateAgentResponse> {
    try {
      const response = await fetch("/api/create_agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data: CreateAgentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create agent");
      }

      return data;
    } catch (error) {
      console.error("Error creating agent:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Chat with an agent
   */
  static async chatWithAgent(
    params: ChatWithAgentParams
  ): Promise<ChatWithAgentResponse> {
    try {
      const response = await fetch("/api/chat_with_agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data: ChatWithAgentResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to chat with agent");
      }

      return data;
    } catch (error) {
      console.error("Error chatting with agent:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get chain ID from chain name
   */
  static getChainId(chainName?: string): number {
    const chainMap: { [key: string]: number } = {
      base: 8453,
      arbitrum: 42161,
      polygon: 137,
      optimism: 10,
      mainnet: 1,
    };

    return chainMap[chainName?.toLowerCase() || "base"] || 8453; // Default to Base
  }

  /**
   * Get supported chains
   */
  static getSupportedChains() {
    return [
      { id: 8453, name: "Base", symbol: "ETH" },
      { id: 42161, name: "Arbitrum", symbol: "ETH" },
      { id: 137, name: "Polygon", symbol: "MATIC" },
      { id: 10, name: "Optimism", symbol: "ETH" },
    ];
  }

  /**
   * Create wallet using viem (better than ethers)
   */
  static createAgentWallet() {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    return {
      privateKey,
      address: account.address,
      account,
    };
  }

  /**
   * Parse transaction amounts using viem
   */
  static parseAmount(amount: string): bigint {
    return parseEther(amount);
  }

  /**
   * Format amounts for display
   */
  static formatAmount(amount: bigint): string {
    return formatEther(amount);
  }
}

// Export types for use in components
export type {
  CreateAgentParams,
  CreateAgentResponse,
  ChatWithAgentParams,
  ChatWithAgentResponse,
  WalletAction,
  ChatMessage,
};
