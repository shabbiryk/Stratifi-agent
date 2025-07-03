// AI Response Service - Handles all AI response generation logic
export interface AssetContext {
  token?: string | null;
  poolId?: string | null;
  action?: string | null;
}

export interface UserContext {
  authenticated: boolean;
  walletAddress?: string;
}

export interface AIResponseContext {
  assetContext: AssetContext;
  userContext: UserContext;
  generateRandomAPY: (isLending?: boolean) => string;
  generateRandomBalance: (min: number, max: number) => string;
  generateRandomUtilization: () => string;
}

export class AIResponseService {
  async generateResponse(
    userMessage: string,
    context: AIResponseContext
  ): Promise<string> {
    const userLower = userMessage.toLowerCase();
    const { assetContext, userContext } = context;
    const hasAssetContext =
      assetContext.token && assetContext.poolId && assetContext.action;
    const actionText =
      assetContext.action === "borrow" ? "borrowing" : "lending";

    // Handle asset-specific queries first
    if (hasAssetContext && this.isConfirmationMessage(userLower)) {
      return this.handleConfirmationResponse(context);
    }

    if (hasAssetContext && this.isBalanceQuery(userLower)) {
      return this.handleBalanceQuery(context);
    }

    if (hasAssetContext && this.isRateQuery(userLower)) {
      return this.handleRateQuery(context);
    }

    if (this.isPriceQuery(userLower)) {
      return this.handlePriceQuery(userMessage, context);
    }

    if (this.isPortfolioQuery(userLower)) {
      return this.handlePortfolioQuery(context);
    }

    if (this.isInvestmentQuery(userLower)) {
      return this.handleInvestmentQuery(context);
    }

    if (this.isTrendingQuery(userLower)) {
      return this.handleTrendingQuery();
    }

    if (this.isETHBuyQuery(userLower)) {
      return this.handleETHBuyQuery(context);
    }

    // Default response
    return this.handleDefaultResponse(userMessage, context);
  }

  private isConfirmationMessage(userLower: string): boolean {
    return (
      userLower.includes("yes") ||
      userLower.includes("proceed") ||
      userLower.includes("continue")
    );
  }

  private isBalanceQuery(userLower: string): boolean {
    return userLower.includes("balance") || userLower.includes("collateral");
  }

  private isRateQuery(userLower: string): boolean {
    return (
      userLower.includes("rate") ||
      userLower.includes("apy") ||
      userLower.includes("interest")
    );
  }

  private isPriceQuery(userLower: string): boolean {
    return (
      userLower.includes("price") ||
      userLower.includes("bitcoin") ||
      userLower.includes("btc")
    );
  }

  private isPortfolioQuery(userLower: string): boolean {
    return userLower.includes("portfolio");
  }

  private isInvestmentQuery(userLower: string): boolean {
    return userLower.includes("invest") || userLower.includes("$100");
  }

  private isTrendingQuery(userLower: string): boolean {
    return userLower.includes("trending") || userLower.includes("memecoin");
  }

  private isETHBuyQuery(userLower: string): boolean {
    return (
      userLower.includes("buy") ||
      userLower.includes("ethereum") ||
      userLower.includes("eth")
    );
  }

  private handleConfirmationResponse(context: AIResponseContext): string {
    const { assetContext, userContext, generateRandomAPY } = context;
    const actionText =
      assetContext.action === "borrow" ? "borrowing" : "lending";

    if (!userContext.authenticated || !userContext.walletAddress) {
      return `Great! Let me help you get started with ${actionText} ${assetContext.token?.toUpperCase()}.

⚠️ **Wallet Connection Required**
To proceed with ${actionText}, I need to connect to your wallet first.

**What happens next:**
1. Click "Connect Wallet" in the top bar
2. I'll verify your ${
        assetContext.action === "borrow"
          ? "collateral"
          : `${assetContext.token?.toUpperCase()} balance`
      }
3. Show you the ${actionText} terms for Pool ${assetContext.poolId}
4. Execute the transaction

Would you like me to guide you through the wallet connection process?`;
    } else {
      const randomAPY = generateRandomAPY(assetContext.action !== "borrow");
      return `Perfect! Let's proceed with ${actionText} ${assetContext.token?.toUpperCase()} from Pool ${
        assetContext.poolId
      }.

✅ **Transaction Details:**
• Wallet: ${userContext.walletAddress.slice(
        0,
        6
      )}...${userContext.walletAddress.slice(-4)}
• Asset: ${assetContext.token?.toUpperCase()}
• Pool: ${assetContext.poolId}
• Action: ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}
• ${assetContext.action === "borrow" ? "Interest Rate" : "APY"}: ${randomAPY}%

📋 **Next Steps:**
1. ✓ Wallet connected
2. ⏳ Checking ${
        assetContext.action === "borrow"
          ? "collateral requirements"
          : "available balance"
      }...
3. ⏳ Preparing transaction parameters
4. ⏳ Ready for your final confirmation

*This is a demo environment. In production, this would execute a real ${actionText} transaction.*

Would you like me to show you the final transaction summary?`;
    }
  }

  private handleBalanceQuery(context: AIResponseContext): string {
    const { assetContext, userContext, generateRandomBalance } = context;
    const actionText =
      assetContext.action === "borrow" ? "borrowing" : "lending";

    if (!userContext.authenticated) {
      return `I'd love to check your ${
        assetContext.action === "borrow" ? "collateral" : "balance"
      } for ${actionText} ${assetContext.token?.toUpperCase()}, but I need wallet access first.

Connect your wallet and I'll show you:
• Your current ${
        assetContext.action === "borrow"
          ? "collateral positions"
          : `${assetContext.token?.toUpperCase()} balance`
      }
• ${
        assetContext.action === "borrow"
          ? "Available borrowing capacity"
          : "Lending capacity"
      }
• Pool utilization and rates
• Transaction requirements`;
    } else {
      const randomBalance = generateRandomBalance(100, 1000);
      return `📊 **${
        assetContext.action === "borrow" ? "Collateral" : "Balance"
      } Check for Pool ${assetContext.poolId}**

${
  assetContext.action === "borrow"
    ? `💰 **Your Collateral:**
• Total Collateral Value: $${randomBalance}
• Available to Borrow: $${(parseFloat(randomBalance) * 0.7).toFixed(2)}
• Health Factor: 2.3 (Healthy)
• Max ${assetContext.token?.toUpperCase()} Borrow: ${(
        parseFloat(randomBalance) * 0.001
      ).toFixed(4)} ${assetContext.token?.toUpperCase()}`
    : `💎 **Your ${assetContext.token?.toUpperCase()} Balance:**
• Available Balance: ${(parseFloat(randomBalance) * 0.01).toFixed(
        4
      )} ${assetContext.token?.toUpperCase()}
• USD Value: $${randomBalance}
• Max Lending Amount: ${(parseFloat(randomBalance) * 0.009).toFixed(
        4
      )} ${assetContext.token?.toUpperCase()}
• Estimated Annual Yield: $${(parseFloat(randomBalance) * 0.08).toFixed(2)}`
}

Ready to proceed with ${actionText}?`;
    }
  }

  private handleRateQuery(context: AIResponseContext): string {
    const { assetContext, generateRandomAPY, generateRandomUtilization } =
      context;
    const rate = generateRandomAPY(assetContext.action !== "borrow");

    return `📈 **${
      assetContext.action === "borrow" ? "Interest Rates" : "APY Rates"
    } for ${assetContext.token?.toUpperCase()} - Pool ${assetContext.poolId}**

${
  assetContext.action === "borrow"
    ? `💸 **Borrowing Rates:**
• Current Rate: ${rate}% APR
• Rate Type: Variable
• Collateral Ratio: 150%
• Liquidation Threshold: 80%

**Rate Factors:**
• Pool utilization: ${generateRandomUtilization()}%
• Available liquidity: High
• Market volatility: Moderate`
    : `💰 **Lending APY:**
• Current APY: ${rate}%
• Compounding: Daily
• Pool Utilization: ${generateRandomUtilization()}%
• Risk Level: Low-Medium

**APY Breakdown:**
• Base Rate: ${(parseFloat(rate) * 0.7).toFixed(2)}%
• Utilization Bonus: ${(parseFloat(rate) * 0.3).toFixed(2)}%
• Platform Rewards: Potential additional yields`
}

These are competitive rates! Would you like to proceed with ${
      assetContext.action === "borrow" ? "borrowing" : "lending"
    }?`;
  }

  private handlePriceQuery(
    userMessage: string,
    context: AIResponseContext
  ): string {
    const { assetContext, generateRandomAPY } = context;

    if (assetContext.token?.toLowerCase() === "btc") {
      return `Bitcoin (BTC) is currently trading at approximately $43,250.

Since you're here to ${assetContext.action} BTC from Pool ${
        assetContext.poolId
      }, here's what's relevant:
• Current BTC Price: $43,250
• ${
        assetContext.action === "borrow" ? "Borrowing" : "Lending"
      } this asset at current prices
• Pool liquidity: High
• ${
        assetContext.action === "borrow"
          ? `Interest Rate: ${generateRandomAPY(false)}%`
          : `Current APY: ${generateRandomAPY(true)}%`
      }

Ready to proceed with ${
        assetContext.action === "borrow" ? "borrowing" : "lending"
      } BTC?`;
    } else {
      return "Bitcoin (BTC) is currently trading at approximately $43,250. The price has shown strong momentum recently with increased institutional adoption. Would you like me to help you buy some Bitcoin or analyze its technical indicators?";
    }
  }

  private handlePortfolioQuery(context: AIResponseContext): string {
    const { userContext } = context;

    if (!userContext.authenticated || !userContext.walletAddress) {
      return "I'd be happy to analyze your portfolio! To provide the most accurate analysis, I'll need to connect to your wallet first. This will allow me to:\n\n• View your current holdings\n• Calculate your total balance\n• Identify optimization opportunities\n• Suggest rebalancing strategies\n\nWould you like me to guide you through connecting your wallet?";
    } else {
      return `Great! I can see your wallet is connected (${userContext.walletAddress.slice(
        0,
        6
      )}...${userContext.walletAddress.slice(
        -4
      )}). Let me analyze your portfolio:\n\n📊 **Portfolio Analysis**\n• Scanning your holdings across supported chains...\n• Calculating total balance and allocation...\n• Identifying yield opportunities...\n\n💡 **Initial Recommendations:**\n• Consider diversifying across DeFi protocols\n• Look into staking opportunities for better yields\n• Monitor gas fees for optimal transaction timing\n\nWould you like me to dive deeper into any specific aspect of your portfolio?`;
    }
  }

  private handleInvestmentQuery(context: AIResponseContext): string {
    const { assetContext, generateRandomAPY } = context;

    if (assetContext.token && assetContext.poolId && assetContext.action) {
      const actionText =
        assetContext.action === "borrow" ? "borrowing" : "lending";
      return `For ${actionText} ${assetContext.token?.toUpperCase()} from Pool ${
        assetContext.poolId
      }, here's my recommendation:

💡 **${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Strategy:**
${
  assetContext.action === "borrow"
    ? `• Borrow conservatively (max 60% of available)
• Monitor your health factor regularly
• Have an exit strategy ready
• Consider borrowing costs vs. investment returns`
    : `• Start with a smaller amount to test the pool
• Monitor APY changes and pool performance
• Consider compounding your yields
• Diversify across multiple pools for lower risk`
}

Current ${
        assetContext.action === "borrow" ? "borrowing rate" : "APY"
      }: ${generateRandomAPY(assetContext.action !== "borrow")}%

Would you like me to help you proceed with this strategy?`;
    } else {
      return "Great question! For a $100 investment, I'd recommend considering these strategies:\n\n🟢 **Conservative (Low Risk)**\n• 60% USDC staking (4-6% APY)\n• 40% ETH (for growth potential)\n\n🟡 **Moderate (Medium Risk)**\n• 40% ETH\n• 30% BTC\n• 30% High-yield DeFi protocols\n\n🔴 **Aggressive (High Risk)**\n• 50% Promising altcoins\n• 30% DeFi yield farming\n• 20% Emerging protocols\n\nWhat's your risk tolerance and investment timeline?";
    }
  }

  private handleTrendingQuery(): string {
    return "Here are the trending memecoins right now:\n\n🔥 **Top Performers (24h)**\n• PEPE (+15.2%) - Frog-themed token\n• DOGE (+8.7%) - The original memecoin\n• SHIB (+12.3%) - Dogecoin killer\n• BONK (+22.1%) - Solana's dog token\n\n⚠️ **Risk Warning**: Memecoins are highly volatile and speculative. Only invest what you can afford to lose. Would you like me to help you research any specific token or set up price alerts?";
  }

  private handleETHBuyQuery(context: AIResponseContext): string {
    const { assetContext, userContext, generateRandomAPY } = context;

    if (assetContext.token?.toLowerCase() === "eth") {
      const actionText =
        assetContext.action === "borrow" ? "borrowing" : "lending";

      if (!userContext.authenticated || !userContext.walletAddress) {
        return `Perfect! You want to ${assetContext.action} ETH from Pool ${
          assetContext.poolId
        }. Let me help you with that.

To proceed with ${actionText} Ethereum, I'll need to connect to your wallet first:

📋 **What I'll do next:**
1. Connect your wallet
2. Check your ${assetContext.action === "borrow" ? "collateral" : "ETH balance"}
3. Show you the ${actionText} terms
4. Execute the transaction

Should I guide you through the wallet connection?`;
      } else {
        return `Excellent! Your wallet is connected and you want to ${
          assetContext.action
        } ETH from Pool ${assetContext.poolId}.

📋 **ETH ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Summary:**
• Wallet: ${userContext.walletAddress.slice(
          0,
          6
        )}...${userContext.walletAddress.slice(-4)}
• Asset: Ethereum (ETH)
• Pool: ${assetContext.poolId}
• ${
          assetContext.action === "borrow" ? "Interest Rate" : "Current APY"
        }: ${generateRandomAPY(assetContext.action !== "borrow")}%

✅ **Ready to Execute:**
1. ✓ Wallet connected
2. ⏳ Preparing ETH ${actionText} transaction...
3. ⏳ Awaiting your confirmation

Would you like me to proceed with this ETH ${actionText} transaction?`;
      }
    } else {
      if (!userContext.authenticated || !userContext.walletAddress) {
        return "I can help you buy $100 worth of Ethereum on Base! Here's what I'll do:\n\n📋 **Transaction Summary**\n• Amount: $100 USD\n• Asset: Ethereum (ETH)\n• Network: Base\n• Est. ETH: ~0.045 ETH\n• Gas fees: ~$2-5\n\nTo proceed, I'll need to:\n1. Connect your wallet\n2. Confirm the transaction details\n3. Execute the swap\n\nShould I start the wallet connection process?";
      } else {
        return `Perfect! Your wallet is connected. I can help you buy $100 worth of Ethereum on Base.\n\n📋 **Transaction Summary**\n• From wallet: ${userContext.walletAddress.slice(
          0,
          6
        )}...${userContext.walletAddress.slice(
          -4
        )}\n• Amount: $100 USD\n• Asset: Ethereum (ETH)\n• Network: Base\n• Est. ETH: ~0.045 ETH\n• Gas fees: ~$2-5\n\n✅ **Ready to Execute:**\n1. ✓ Wallet connected\n2. ⏳ Preparing transaction...\n3. ⏳ Awaiting your confirmation\n\n*Note: This is a demo. In production, this would execute a real transaction.*\n\nWould you like me to proceed with this transaction?`;
      }
    }
  }

  private handleDefaultResponse(
    userMessage: string,
    context: AIResponseContext
  ): string {
    const { assetContext } = context;

    if (assetContext.token && assetContext.poolId && assetContext.action) {
      const actionText =
        assetContext.action === "borrow" ? "borrowing" : "lending";

      return `I understand you're asking about "${userMessage}". 

Since you're here to ${
        assetContext.action
      } ${assetContext.token?.toUpperCase()} from Pool ${
        assetContext.poolId
      }, I can help you with:

🎯 **${assetContext.token?.toUpperCase()} ${
        actionText.charAt(0).toUpperCase() + actionText.slice(1)
      } Actions:**
• Check ${
        assetContext.action === "borrow"
          ? "collateral requirements"
          : "current balance"
      }
• Show ${
        assetContext.action === "borrow" ? "interest rates" : "APY rates"
      } for this pool
• Execute the ${actionText} transaction
• Monitor your position after ${actionText}

💬 **General Crypto Help:**
• Portfolio analysis and optimization
• Market insights and price analysis
• Cross-chain transaction guidance
• DeFi strategy recommendations

What would you like me to help you with regarding your ${assetContext.token?.toUpperCase()} ${actionText}?`;
    } else {
      return `I understand you're asking about "${userMessage}". I'm here to help you with crypto trading, portfolio analysis, market insights, and DeFi strategies across multiple chains.\n\nI can assist you with:\n• Buying/selling crypto\n• Portfolio optimization\n• Market analysis\n• Cross-chain transactions\n• DeFi yield strategies\n\nWhat specific crypto-related task would you like help with?`;
    }
  }

  // Simulate API delay for realistic UX
  async delay(min = 1000, max = 3000): Promise<void> {
    const delayTime = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }
}
