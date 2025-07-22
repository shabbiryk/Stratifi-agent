# 🚨 DUMMY DATA MAPPING & REPLACEMENT GUIDE

This document maps **every single location** of dummy/mock data in the codebase that needs to be replaced with real implementations.

---

## 📍 **AI RESPONSE SIMULATION** (Priority 1 - @bash)

### **File:** `components/sections/chat-section.tsx`

**Location:** Lines 152-205
**Function:** `simulateAIResponse`
**Status:** 🚨 **DUMMY DATA** - Replace entire function

```typescript
// 🚨 LINES 152-205: COMPLETELY DUMMY AI RESPONSES
const simulateAIResponse = async (userMessage: string, sessionToUse: any) => {
  setIsTyping(true);

  // DUMMY: Fake API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + generateRandom(0, 2000))
  );

  // DUMMY: Pattern matching responses
  let aiResponse = "";
  const userLower = userMessage.toLowerCase();

  if (userLower.includes("invest") || userLower.includes("$100")) {
    aiResponse = "Great question! For a $100 investment, I'd recommend..."; // FAKE
  } else if (userLower.includes("bitcoin") || userLower.includes("btc")) {
    aiResponse = `📈 **Current Bitcoin Price: $${(
      42000 + generateRandom(0, 5000)
    ).toLocaleString()}**`; // FAKE PRICE
  } else if (userLower.includes("trending") || userLower.includes("memecoin")) {
    aiResponse =
      "Here are the trending memecoins right now:\n\n🔥 **Top Performers (24h)**\n• PEPE (+15.2%)"; // FAKE DATA
  } else {
    aiResponse = `I understand you're asking about "${userMessage}". I'm here to help...`; // GENERIC
  }

  setIsTyping(false);
  await addMessage(aiResponse, "ai", sessionToUse);
};
```

**🔧 REPLACEMENT:**

```typescript
const generateRealAIResponse = async (
  userMessage: string,
  sessionToUse: any
) => {
  setIsTyping(true);

  // Call real AI service
  const response = await yourAIService.generateResponse({
    message: userMessage,
    context: {
      token,
      poolId,
      action,
      userHistory: messages,
      sessionMetadata: sessionToUse.metadata,
    },
  });

  setIsTyping(false);
  await addMessage(response, "ai", sessionToUse);
};
```

---

### **File:** `components/ui/research-chat-widget.tsx`

**Location:** Lines 50-134
**Function:** `simulateResearchResponse`
**Status:** 🚨 **DUMMY DATA** - Replace entire function

```typescript
// 🚨 LINES 50-134: HARDCODED RESEARCH RESPONSES
const simulateResearchResponse = async (userMessage: string) => {
  setIsTyping(true);

  // DUMMY: Fake delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  let response = "";

  // DUMMY: Hardcoded DeFi responses
  if (userMessage.toLowerCase().includes("defi")) {
    response = "DeFi (Decentralized Finance) lending allows users to..."; // FAKE EXPLANATION
  } else if (userMessage.toLowerCase().includes("yield")) {
    response = "Yield farming is a strategy to maximize returns..."; // FAKE STRATEGY
  } else if (userMessage.toLowerCase().includes("risk")) {
    response = "DeFi risks to consider:\n\n**Smart Contract Risk**..."; // FAKE RISK ANALYSIS
  } else {
    response = "I'd be happy to help with DeFi research!..."; // GENERIC
  }

  // DUMMY: Fake message creation
  const aiMessage: ChatMessage = {
    id: Date.now().toString(),
    role: "assistant",
    content: response,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, aiMessage]);
};
```

**🔧 REPLACEMENT:**

```typescript
const generateRealResearchResponse = async (userMessage: string) => {
  setIsTyping(true);

  const response = await yourAIService.generateResearchResponse({
    query: userMessage,
    mode: "research",
    expertise: "defi_protocols",
  });

  setIsTyping(false);
  const aiMessage: ChatMessage = {
    id: Date.now().toString(),
    role: "assistant",
    content: response.content,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, aiMessage]);
};
```

---

### **File:** `docs/SESSION_TRACKING_DESIGN.md`

**Location:** Lines 890-949  
**Function:** `simulateAIResponse` (in documentation example)
**Status:** 🚨 **DUMMY DATA** - Update documentation

```typescript
// 🚨 LINES 890-949: DUMMY AI IN DOCUMENTATION EXAMPLES
const simulateAIResponse = async (userMessage: string) => {
  // DUMMY: Fake delay and responses in docs
  setIsTyping(true);
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  const aiResponse = generateContextAwareResponse(
    userMessage,
    userActivities,
    currentSession
  ); // FAKE

  await sessionService.addMessage({
    session_id: currentSession.id,
    role: "ai",
    content: aiResponse, // FAKE RESPONSE
  });
};
```

**🔧 REPLACEMENT:** Update documentation examples to show real AI integration patterns.

---

## 📊 **FAKE MARKET DATA GENERATION** (Priority 1 - @bash/@zym001)

### **File:** `hooks/use-client-random.tsx`

**Location:** **ENTIRE FILE** (Lines 1-49)
**Status:** 🚨 **DUMMY DATA** - Delete entire file after integration

```typescript
// 🚨 ENTIRE FILE: FAKE DATA GENERATION
export function useClientRandom() {
  // DUMMY: Random APY generation
  const generateRandomAPY = (isLending: boolean = true): string => {
    const baseRate = isLending ? 5 : 3;
    const variation = isLending ? 8 : 5;
    return generateRandom(baseRate, baseRate + variation).toFixed(2); // FAKE RATES
  };

  // DUMMY: Random balance generation
  const generateRandomBalance = (
    min: number = 100,
    max: number = 1000
  ): string => {
    return generateRandom(min, max).toFixed(2); // FAKE BALANCES
  };

  // DUMMY: Random utilization
  const generateRandomUtilization = (): string => {
    return generateRandom(50, 90).toFixed(1); // FAKE UTILIZATION
  };
}
```

**🔧 REPLACEMENT:** Replace with real market data APIs

```typescript
// NEW FILE: hooks/use-market-data.tsx
export function useMarketData() {
  const getRealAPY = async (
    protocol: string,
    asset: string
  ): Promise<string> => {
    const response = await fetch(`/api/market-data/${protocol}/${asset}`);
    return response.apy;
  };

  const getRealBalance = async (
    address: string,
    chainId: number
  ): Promise<string> => {
    const response = await yourBlockchainProvider.getBalance(address, chainId);
    return response.formatted;
  };
}
```

---

## 🔄 **FALLBACK AGENT RESPONSES** (Priority 1 - @bash)

### **File:** `app/api/chat_with_agent/route.ts`

**Location:** Lines 226-294
**Status:** 🚨 **DUMMY DATA** - Replace fallback logic

```typescript
// 🚨 LINES 226-294: HARDCODED FALLBACK RESPONSES
catch (fetchError) {
  console.error("Error calling agent backend:", fetchError);

  // DUMMY: Enhanced fallback response with hardcoded DeFi intelligence
  let fallbackResponse = `I understand you're asking about "${message}". While my advanced analysis engine is temporarily unavailable...`; // GENERIC

  const messageLower = message.toLowerCase();

  if (messageLower.includes("lend") || messageLower.includes("supply")) {
    fallbackResponse += `• **Lending USDC**: ~4-8% APY on Aave, Compound`; // FAKE RATES
  } else if (messageLower.includes("borrow")) {
    fallbackResponse += `• **Collateralized Borrowing**: Use ETH as collateral`; // FAKE INFO
  } else if (messageLower.includes("yield") || messageLower.includes("farm")) {
    fallbackResponse += `📊 **Current Yields**: 5-15% for moderate risk strategies.`; // FAKE YIELDS
  } else {
    fallbackResponse += `🚀 **Getting Started**: Connect your wallet and I can help execute transactions.`; // GENERIC
  }

  return NextResponse.json({
    success: true,
    response: fallbackResponse, // FAKE RESPONSE
  } as ChatWithAgentResponse);
}
```

**🔧 REPLACEMENT:**

```typescript
catch (fetchError) {
  console.error("Error calling agent backend:", fetchError);

  // Use backup AI service for fallback
  const backupResponse = await yourBackupAIService.generateResponse({
    message: message,
    context: { chainName, userProfile, existingScratchpad },
    mode: "fallback"
  });

  return NextResponse.json({
    success: true,
    response: backupResponse,
  });
}
```

---

## 💰 **MOCK WALLET ACTIONS** (Priority 1 - @bash)

### **File:** `app/api/chat_with_agent/route.ts`

**Location:** Lines 159-190
**Status:** 🚨 **DUMMY DATA** - Replace pattern matching logic

```typescript
// 🚨 LINES 159-190: DUMMY WALLET ACTION PARSING
let walletAction: WalletAction | undefined;

// DUMMY: Simple pattern matching for wallet actions
if (
  responseText.toLowerCase().includes("transaction") ||
  responseText.toLowerCase().includes("send") ||
  responseText.toLowerCase().includes("swap") ||
  responseText.toLowerCase().includes("approve")
) {
  // DUMMY: Extract potential transaction details (hardcoded example)
  if (
    responseText.toLowerCase().includes("usdc") &&
    responseText.toLowerCase().includes("lend")
  ) {
    walletAction = {
      type: "transaction",
      description: "Approve and lend USDC to Morpho protocol", // FAKE DESCRIPTION
      toAddress: "0x8Df14A537FE45a23B0D4b9cECED1a9b6DDB1C86F" as `0x${string}`, // FAKE ADDRESS
      value: parseEther("100"), // FAKE AMOUNT
      tokenAddress:
        "0xA0b86a33E6441a1E7B17c98d3f1A5eF9E2D0b00e" as `0x${string}`, // FAKE TOKEN
    };
  }
}
```

**🔧 REPLACEMENT:**

```typescript
let walletAction: WalletAction | undefined;

// Parse AI response for structured wallet actions
const parsedActions = await yourAIService.parseWalletActions(responseText);

if (parsedActions.length > 0) {
  const action = parsedActions[0];

  walletAction = {
    type: action.type,
    description: action.description,
    toAddress: action.contractAddress,
    value: parseEther(action.amount.toString()),
    tokenAddress: action.tokenAddress,
    data: action.callData, // Smart contract call data
  };
}
```

---

## 📝 **EXAMPLE PROMPTS** (Priority 2 - @bash)

### **File:** `components/sections/chat-section.tsx`

**Location:** Lines 46-53
**Status:** 🚨 **DUMMY DATA** - Replace with real prompts

```typescript
// 🚨 LINES 46-53: HARDCODED EXAMPLE PROMPTS
const EXAMPLE_PROMPTS = [
  "How should I invest $100?", // DUMMY PROMPT
  "What's the Bitcoin price?", // DUMMY PROMPT
  "Show me trending memecoins", // DUMMY PROMPT
  "Analyze my portfolio", // DUMMY PROMPT
  "Help me buy Ethereum", // DUMMY PROMPT
  "What are the best DeFi yields?", // DUMMY PROMPT
];
```

**🔧 REPLACEMENT:**

```typescript
const INTELLIGENT_PROMPTS = [
  "What's the best lending strategy for my risk profile?",
  "Compare current yields across DeFi protocols",
  "How can I optimize my portfolio allocation?",
  "Show me opportunities on Base chain",
  "What are the risks of yield farming?",
  "Help me find the best borrowing rates",
];

// Or make them dynamic based on user context:
const generateContextualPrompts = (userContext: UserContext) => {
  return yourAIService.generateRelevantPrompts({
    userProfile: userContext.riskProfile,
    currentAssets: userContext.portfolio,
    chainPreference: userContext.preferredChain,
  });
};
```

---

## 🏗️ **MISSING BACKEND INTEGRATION** (Priority 1 - @zym001)

### **File:** `agent/agent.py`

**Location:** Lines 167-262
**Function:** `process_message`
**Status:** 🚨 **INCOMPLETE** - Missing AgentKit integration

```python
# 🚨 LINES 167-262: MISSING AGENTKIT INTEGRATION
async def process_message(message: str) -> str:
    """Process message using existing logic"""
    response = 'I am afraid something went wrong...' # DUMMY DEFAULT

    try:
        lower_text = message.lower()

        # INCOMPLETE: Only supports Morpho protocol queries
        if any(word in lower_text for word in ["morpho", "moprho", "morhpo", "morfo"]):
            # Only Morpho-specific responses, no AgentKit integration
            r = fetch_morpho_market_data(top_n=top_n, subgraph_url=SUBGRAPH_URLS[chain])
            # Process Morpho data...
        else:
            # DUMMY: Generic DeFi responses without AgentKit
            response = "Hello! I'm your DeFi agent specializing in Morpho protocol..."

    except Exception as e:
        response = f"An error occurred: {str(e)}" # GENERIC ERROR

    return response
```

**🔧 REPLACEMENT:**

```python
# Import AgentKit
from agentkit.AgentKit import AgentKit

async def process_message(message: str) -> str:
    """Process message using AgentKit + AI"""
    try:
        # Extract context from message
        context = parse_contextual_message(message)

        # Create AgentKit instance
        agent_kit = AgentKit(
            userwalletaddress=context.user_wallet,
            user_chain_id=context.chain_id,
            safe_chain_ids=context.supported_chains,
            safewalletPrivateKey=context.agent_private_key,
            safeWalletPublicKey=context.agent_public_key
        )

        # Generate AI response with AgentKit capabilities
        ai_response = await generate_intelligent_response(message, agent_kit, context)

        # Execute any required wallet actions
        if ai_response.requires_action:
            action_result = await agent_kit.execute_action(
                chain_id=context.chain_id,
                action=ai_response.action_type,
                params=ai_response.action_params
            )
            ai_response.update_with_result(action_result)

        return ai_response.text

    except Exception as e:
        logger.error(f"Error processing message: {e}")
        return await generate_fallback_response(message, str(e))
```

---

## 📄 **DUMMY MARKET DATA IN UI** (Priority 2 - @bash/@zym001)

### **File:** `app/markets/page.tsx`

**Location:** Lines 8-76
**Status:** 🚨 **DUMMY DATA** - Replace hardcoded market opportunities

```typescript
// 🚨 LINES 8-76: HARDCODED MARKET DATA
const marketOpportunities = [
  {
    id: 1,
    protocol: "Aave",
    asset: "USDC",
    apy: 12.4, // FAKE APY
    tvl: "$2.1B", // FAKE TVL
    risk: "Low", // FAKE RISK ASSESSMENT
    category: "Lending",
    featured: true,
  },
  // More fake data...
];
```

**🔧 REPLACEMENT:**

```typescript
const useRealMarketData = () => {
  const [marketOpportunities, setMarketOpportunities] = useState([]);

  useEffect(() => {
    const fetchRealMarketData = async () => {
      const data = await yourMarketDataAPI.getTopOpportunities({
        chains: [1, 8453, 42161],
        protocols: ["aave", "compound", "morpho", "uniswap"],
        sortBy: "apy_desc",
      });
      setMarketOpportunities(data);
    };

    fetchRealMarketData();
  }, []);

  return marketOpportunities;
};
```

### **File:** `app/strategies/page.tsx`

**Location:** Lines 16-76
**Status:** 🚨 **DUMMY DATA** - Replace hardcoded strategies

```typescript
// 🚨 LINES 16-76: HARDCODED STRATEGY DATA
const strategies = [
  {
    name: "Conservative Growth",
    expectedApy: "6-8%", // FAKE APY RANGE
    riskLevel: "Low", // FAKE RISK
    protocols: ["Aave", "Compound"], // FAKE PROTOCOLS
    features: ["Blue-chip assets"], // FAKE FEATURES
  },
  // More fake strategies...
];
```

---

## 🧪 **FAKE TEST DATA** (Priority 3 - Clean up)

### **File:** `check-data.js`

**Location:** Lines 5-76
**Status:** 🚨 **TEST DATA** - Used for database validation

```javascript
// 🚨 LINES 5-76: DATABASE CHECK SCRIPT (Keep for testing)
// This is actually useful - it checks if real data is being stored
// But update console messages to reflect real vs dummy data
```

### **File:** `test-database.js`

**Status:** 🚨 **TEST FILE** - Keep for validation

### **File:** `agent/test_agent.py`

**Location:** Lines 7-38
**Status:** 🚨 **TEST CODE** - Keep for backend testing

### **File:** `agent/test_client.py`

**Location:** Lines 1-18
**Status:** 🚨 **TEST CODE** - Keep for backend testing

---

## 🏷️ **USAGE TRACKING FOR INTEGRATION**

### **Files Using Dummy Random Data:**

```bash
# Find all files using generateRandom()
grep -r "generateRandom" --include="*.tsx" --include="*.ts" .
```

**Results:**

- `components/sections/chat-section.tsx` - Lines 156, 171, 175, 179, 183
- `hooks/use-client-random.tsx` - Lines 16, 21, 26, 35, 42
- `docs/CHAT_INTERFACE_DOCUMENTATION.md` - Line 177

### **Files Using Hardcoded Example Prompts:**

```bash
# Find all EXAMPLE_PROMPTS
grep -r "EXAMPLE_PROMPTS" --include="*.tsx" --include="*.ts" .
```

**Results:**

- `components/sections/chat-section.tsx` - Line 46
- `docs/CHAT_INTERFACE_DOCUMENTATION.md` - Line 382
- `README.md` - Line 208

---

## ✅ **POST-INTEGRATION CLEANUP CHECKLIST**

### **Files to DELETE completely:**

- [ ] `hooks/use-client-random.tsx` - Entire file is dummy data
- [ ] Remove all `import { useClientRandom }` statements

### **Functions to REPLACE completely:**

- [ ] `simulateAIResponse` in `components/sections/chat-section.tsx`
- [ ] `simulateResearchResponse` in `components/ui/research-chat-widget.tsx`
- [ ] `process_message` in `agent/agent.py` (add AgentKit integration)

### **Constants to UPDATE:**

- [ ] `EXAMPLE_PROMPTS` arrays - make them intelligent/contextual
- [ ] Hardcoded market data arrays in `/markets` and `/strategies` pages
- [ ] Fallback response strings in API routes

### **Functions to ENHANCE:**

- [ ] Wallet action parsing logic - from pattern matching to AI parsing
- [ ] Error handling - from generic messages to contextual help
- [ ] Response generation - from templates to AI-generated content

---

## 🔧 **INTEGRATION VERIFICATION**

After integration, verify these dummy data sources are eliminated:

```bash
# Should return NO results after integration:
grep -r "generateRandom" . --include="*.tsx" --include="*.ts"
grep -r "DUMMY" . --include="*.tsx" --include="*.ts" --include="*.py"
grep -r "FAKE" . --include="*.tsx" --include="*.ts" --include="*.py"
grep -r "simulateAI" . --include="*.tsx" --include="*.ts"

# Should return REAL implementations:
grep -r "yourAIService" . --include="*.tsx" --include="*.ts"
grep -r "AgentKit" . --include="*.py" --include="*.ts"
grep -r "real.*api" . --include="*.tsx" --include="*.ts"
```

---

**🎯 PRIORITY ORDER:**

1. **AI Response Functions** (Lines 152-205, 50-134, etc.) - @bash
2. **AgentKit Integration** (Lines 167-262 in agent.py) - @zym001
3. **Fallback Responses** (Lines 226-294) - @bash
4. **Wallet Action Parsing** (Lines 159-190) - @bash
5. **Market Data Generation** (Entire use-client-random.tsx) - @bash/@zym001
6. **UI Data** (Market/Strategy pages) - @bash/@zym001

This mapping ensures no dummy data remains in production! 🚀
