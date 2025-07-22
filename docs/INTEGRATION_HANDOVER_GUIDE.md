# 🚀 INTEGRATION HANDOVER GUIDE

## Overview

This document provides a complete guide for integrating the real **AgentKit backend** (@zym001) and **AI system** (@bash) with the existing frontend and API infrastructure.

---

## 👥 TEAM RESPONSIBILITIES

### @zym001 - Backend/AgentKit

**MISSING:** AgentKit class implementation
**STATUS:** ❌ Not Started
**TASK:** Create the core AgentKit system as specified in original requirements

### @bash - AI System

**MISSING:** Real AI integration  
**STATUS:** ❌ Not Started  
**TASK:** Replace dummy AI responses with real intelligent responses

### @Shikhar0x - API Layer (READY)

**STATUS:** ✅ Complete + Production Ready
**EXTRAS:** Full database, context memory, multi-chain support

---

## 🗂️ DUMMY DATA LOCATIONS (TO REPLACE)

### 1. **AI Response Simulation**

All files with `simulateAIResponse` functions contain **DUMMY DATA**:

```typescript
// 🚨 DUMMY - components/sections/chat-section.tsx (lines 152-205)
const simulateAIResponse = async (userMessage: string, sessionToUse: any) => {
  // DUMMY: Pattern matching responses
  if (userLower.includes("invest") || userLower.includes("$100")) {
    aiResponse = "Great question! For a $100 investment..."; // DUMMY RESPONSE
  }
  // DUMMY: Fake Bitcoin prices
  aiResponse = `📈 **Current Bitcoin Price: $${(
    42000 + generateRandom(0, 5000)
  ).toLocaleString()}**`;
  // DUMMY: Mock market data
};
```

**Files to update:**

- `components/sections/chat-section.tsx` (lines 152-205)
- `components/ui/research-chat-widget.tsx` (lines 50-134)
- `docs/SESSION_TRACKING_DESIGN.md` (lines 890-949)

### 2. **Fake Market Data Generation**

```typescript
// 🚨 DUMMY - hooks/use-client-random.tsx (ENTIRE FILE)
export function useClientRandom() {
  // DUMMY: Random APY generation
  const generateRandomAPY = (isLending: boolean = true): string => {
    return generateRandom(5, 13).toFixed(2); // FAKE RATES
  };
  // DUMMY: Random balance generation
  const generateRandomBalance = (
    min: number = 100,
    max: number = 1000
  ): string => {
    return generateRandom(min, max).toFixed(2); // FAKE BALANCES
  };
}
```

### 3. **Fallback Agent Responses**

```typescript
// 🚨 DUMMY - app/api/chat_with_agent/route.ts (lines 226-294)
catch (fetchError) {
  // DUMMY: Hardcoded fallback responses
  let fallbackResponse = `I understand you're asking about "${message}"...`;

  if (messageLower.includes("lend")) {
    fallbackResponse += `• **Lending USDC**: ~4-8% APY on Aave, Compound`; // DUMMY RATES
  }
  // More hardcoded responses...
}
```

### 4. **Example Prompts**

```typescript
// 🚨 DUMMY - components/sections/chat-section.tsx (lines 46-53)
const EXAMPLE_PROMPTS = [
  "How should I invest $100?", // DUMMY PROMPT
  "What's the Bitcoin price?", // DUMMY PROMPT
  "Show me trending memecoins", // DUMMY PROMPT
  // More dummy prompts...
];
```

### 5. **Mock Wallet Actions**

```typescript
// 🚨 DUMMY - app/api/chat_with_agent/route.ts (lines 159-190)
// Simple pattern matching for wallet actions (DUMMY LOGIC)
if (
  responseText.toLowerCase().includes("usdc") &&
  responseText.toLowerCase().includes("lend")
) {
  walletAction = {
    type: "transaction",
    description: "Approve and lend USDC to Morpho protocol", // DUMMY ACTION
    toAddress: "0x8Df14A537FE45a23B0D4b9cECED1a9b6DDB1C86F", // DUMMY ADDRESS
    value: parseEther("100"), // DUMMY AMOUNT
  };
}
```

---

## 🔧 INTEGRATION POINTS FOR @zym001 (AgentKit Backend)

### **MISSING: AgentKit Class**

**Location:** Needs to be created in `backend/service/agentkit/`
**Requirements from original spec:**

```python
# TO CREATE: backend/service/agentkit/AgentKit.py
class AgentKit:
    def __init__(self,
                 userwalletaddress: str,
                 user_chain_id: int,
                 safe_chain_ids: List[int],
                 safewalletPrivateKey: str,
                 safeWalletPublicKey: str):
        # Initialize with user wallet and safe wallet
        self.user_wallet = userwalletaddress
        self.user_chain_id = user_chain_id
        self.safe_chain_ids = safe_chain_ids
        self.safe_private_key = safewalletPrivateKey
        self.safe_public_key = safeWalletPublicKey

        # Create ActionProviders for each chain
        self.action_providers = {}
        for chain_id in safe_chain_ids:
            self.action_providers[chain_id] = self.create_chain_provider(chain_id)

        # Create user-specific ActionProvider
        self.user_provider = self.create_user_provider()

    def create_chain_provider(self, chain_id: int):
        # Create ActionProvider with:
        # - Basic wallet actions (getbalance, send, receive)
        # - Lending/borrowing actions
        return ActionProvider(chain_id, self.safe_private_key)

    def create_user_provider(self):
        # Create ActionProvider with only:
        # - get_balance_in_chain_id action
        return UserActionProvider(self.user_wallet)

    def execute_action(self, chain_id: int, action: str, params: dict):
        # Route action to appropriate ActionProvider
        if chain_id in self.action_providers:
            return self.action_providers[chain_id].execute(action, params)
        else:
            return self.user_provider.execute(action, params)
```

### **Integration with Existing API**

The AgentKit will be called from the existing API:

```python
# INTEGRATION POINT: app/api/chat_with_agent/route.ts (lines 113-157)
# Current code calls: fetch(`${agentBackendUrl}/chat`, ...)

# TO UPDATE: agent/agent.py - Add AgentKit integration
from agentkit.AgentKit import AgentKit

@app.post("/chat", response_model=ChatResponse)
async def handle_chat_request(req: ChatRequest):
    try:
        # EXTRACT from contextualMessage:
        user_wallet = extract_user_wallet(req.message)
        chain_id = extract_chain_id(req.message)
        agent_wallet_private_key = extract_agent_private_key(req.message)
        agent_wallet_public_key = extract_agent_public_key(req.message)

        # CREATE AgentKit instance
        agent_kit = AgentKit(
            userwalletaddress=user_wallet,
            user_chain_id=chain_id,
            safe_chain_ids=[1, 8453, 42161, 137, 10],  # Multi-chain support
            safewalletPrivateKey=agent_wallet_private_key,
            safeWalletPublicKey=agent_wallet_public_key
        )

        # PROCESS message with AgentKit + AI
        response = await process_with_agentkit_and_ai(req.message, agent_kit)

        return ChatResponse(response=response, session_id=req.session_id)
    except Exception as e:
        return ChatResponse(response="", error=str(e))
```

### **Data Already Available**

The API layer already provides all needed data:

```typescript
// AVAILABLE DATA in contextualMessage:
User Wallet: 0x1234...           // userwalletaddress ✅
Chain: base (8453)               // user_chain_id ✅
Agent Wallet: 0x5678...          // safeWalletPublicKey ✅
Risk Profile: moderate           // User context ✅
Previous Context: [...]          // Conversation memory ✅
```

**Private key available in:** `agentWallet.wallet_private_key` (line 76)

---

## 🤖 INTEGRATION POINTS FOR @bash (AI System)

### **Replace Dummy AI Responses**

#### 1. **Main Chat Interface**

**File:** `components/sections/chat-section.tsx`
**Function:** `simulateAIResponse` (lines 152-205)

```typescript
// CURRENT DUMMY CODE:
const simulateAIResponse = async (userMessage: string, sessionToUse: any) => {
  // 🚨 REPLACE THIS ENTIRE FUNCTION
  if (userLower.includes("invest")) {
    aiResponse = "Great question! For a $100 investment..."; // DUMMY
  }
};

// NEW INTEGRATION:
const generateRealAIResponse = async (
  userMessage: string,
  sessionToUse: any
) => {
  const response = await callYourAIService({
    message: userMessage,
    context: {
      token: token, // Available from URL params
      poolId: poolId, // Available from URL params
      action: action, // Available from URL params
      userHistory: messages, // Available conversation history
      sessionData: sessionToUse.metadata,
    },
  });

  return response;
};
```

#### 2. **Agent Chat Interface**

**File:** `components/sections/agent-chat-section.tsx`
**Location:** Lines 175-235 (handleSend function)

```typescript
// CURRENT: Calls backend which has dummy responses
const agentResponse = await AgentService.chatWithAgent({...});

// INTEGRATION POINT: The response comes from agent/agent.py
// Update agent/agent.py to use real AI instead of pattern matching
```

#### 3. **Research Widget**

**File:** `components/ui/research-chat-widget.tsx`
**Function:** `simulateResearchResponse` (lines 50-134)

```typescript
// 🚨 REPLACE ENTIRE FUNCTION WITH REAL AI
const simulateResearchResponse = async (userMessage: string) => {
  // Current has hardcoded responses for DeFi, yield, risk, etc.
  // Replace with real AI service call
};
```

### **Context Data Available for AI**

Your AI system has access to rich context:

```typescript
// USER CONTEXT (from session management)
- user.id                    // Unique user identifier
- user.wallet_address        // User's wallet
- user.preferences           // User settings
- user.last_active          // Activity tracking

// CONVERSATION CONTEXT
- messages[]                // Full conversation history
- session.metadata          // Session-specific context
  - token, poolId, action   // Asset context from URL
  - mode: "reasoning"|"agent" // Interface mode
  - agent_id               // Associated agent

// AGENT CONTEXT (Agent mode only)
- agentWallet.wallet_public_key   // Agent's wallet
- userProfile.risk_profile        // User's risk tolerance
- existingScratchpad.agent_scratchpad // Previous context memory

// MARKET CONTEXT (available)
- chainId                   // Current blockchain
- balance                   // User's balance
- walletAddress            // Connected wallet
```

### **AI Service Integration Points**

#### **Reasoning Mode AI** (Educational/Research)

```typescript
// LOCATION: components/sections/chat-section.tsx
// PURPOSE: Educational content, research, explanations
// CONTEXT: token, poolId, action from URL parameters
// RESPONSE TYPE: Educational, no wallet actions

const reasoningModeAI = async (
  userMessage: string,
  context: ReasoningContext
) => {
  return await yourAIService.generate({
    prompt: userMessage,
    mode: "educational",
    assetContext: context.assetContext,
    userLevel: context.userExperience,
    responseStyle: "detailed_explanation",
  });
};
```

#### **Agent Mode AI** (Action-Oriented)

```typescript
// LOCATION: agent/agent.py -> process_message()
// PURPOSE: Market analysis, transaction preparation, wallet actions
// CONTEXT: Full user profile, wallet data, agent capabilities
// RESPONSE TYPE: Actionable advice + wallet actions

const agentModeAI = async (contextualMessage: string, agentKit: AgentKit) => {
  const aiResponse = await yourAIService.generate({
    prompt: contextualMessage,
    mode: "agent",
    capabilities: agentKit.getAvailableActions(),
    userProfile: extractUserProfile(contextualMessage),
    walletData: extractWalletData(contextualMessage),
    riskProfile: extractRiskProfile(contextualMessage),
  });

  // Parse response for wallet actions
  const walletActions = parseWalletActions(aiResponse);

  return {
    response: aiResponse.text,
    actions: walletActions,
  };
};
```

---

## 📊 DATABASE SCHEMA (READY FOR INTEGRATION)

### **Agent Tables** (Ready)

```sql
-- agent_wallets: Private keys for AI agents ✅
CREATE TABLE agent_wallets (
  agent_id VARCHAR(32) PRIMARY KEY,
  wallet_private_key TEXT NOT NULL,      -- For AgentKit
  wallet_public_key VARCHAR(42) NOT NULL, -- For AgentKit
  user_wallet_address VARCHAR(42) NOT NULL,
  chain_id INTEGER NOT NULL
);

-- agent_scratchpad: Context memory ✅
CREATE TABLE agent_scratchpad (
  session_id UUID PRIMARY KEY,
  agent_scratchpad TEXT DEFAULT '',    -- AI context memory
);

-- user_profiles: Risk assessment ✅
CREATE TABLE user_profiles (
  user_wallet_address VARCHAR(42) PRIMARY KEY,
  risk_profile TEXT,                   -- For AI personalization
  other_user_info TEXT                 -- Additional context
);
```

### **Session Tables** (Ready)

```sql
-- chat_sessions: Session persistence ✅
-- chat_messages: Message history ✅
-- user_activities: Transaction tracking ✅
```

---

## 🔗 API ENDPOINTS (READY FOR INTEGRATION)

### **create_agent** (Production Ready)

```typescript
// POST /api/create_agent
// INPUT: { userWalletAddress, chain_id }
// OUTPUT: { success: true, agent_id: "abc123" }
// STATUS: ✅ Complete - Creates agent wallets in database
```

### **chat_with_agent** (Ready for Backend Integration)

```typescript
// POST /api/chat_with_agent
// INPUT: { userWalletAddress, chain_id, agent_id, session_id, messageHistory, message }
// OUTPUT: { success: true, response: "AI response", walletAction?: {...} }

// INTEGRATION POINTS:
// 1. Line 134: Calls `${agentBackendUrl}/chat` (YOUR BACKEND)
// 2. Line 157-190: Dummy wallet action parsing (YOUR AI)
// 3. Line 226-294: Fallback responses (YOUR AI)
```

---

## 🚀 INTEGRATION STEPS

### **Phase 1: @zym001 Backend Setup**

1. **Create AgentKit Class Structure**

   ```bash
   mkdir -p backend/service/agentkit
   touch backend/service/agentkit/__init__.py
   touch backend/service/agentkit/AgentKit.py
   touch backend/service/agentkit/ActionProvider.py
   ```

2. **Implement AgentKit Constructor**

   - Take parameters from API (wallet addresses, chain IDs)
   - Create ActionProviders for each chain
   - Set up basic wallet actions (get_balance, send, receive)
   - Set up lending/borrowing actions

3. **Integrate with Existing Agent Service**

   - Update `agent/agent.py` line 167+ (process_message function)
   - Extract wallet data from contextualMessage
   - Create AgentKit instance
   - Route requests through AgentKit

4. **Test Integration**
   ```bash
   cd agent
   python agent.py  # Should start on port 8000
   # Frontend calls will now use real AgentKit
   ```

### **Phase 2: @bash AI Integration**

1. **Replace Reasoning Mode AI** (Educational)

   - File: `components/sections/chat-section.tsx`
   - Function: `simulateAIResponse` (lines 152-205)
   - Context: Asset parameters (token, poolId, action)
   - Purpose: Educational responses, no wallet actions

2. **Replace Agent Mode AI** (Action-Oriented)

   - File: `agent/agent.py`
   - Function: `process_message` (lines 167-262)
   - Context: Full user context + AgentKit capabilities
   - Purpose: Market analysis + wallet actions

3. **Replace Research Widget AI**

   - File: `components/ui/research-chat-widget.tsx`
   - Function: `simulateResearchResponse` (lines 50-134)
   - Context: Research-focused queries
   - Purpose: DeFi protocol explanations

4. **Implement Wallet Action Parsing**
   - Location: `app/api/chat_with_agent/route.ts` (lines 157-190)
   - Parse AI responses for transaction instructions
   - Return structured wallet actions

### **Phase 3: Testing & Validation**

1. **Test with Real Data**

   - Remove all dummy data hooks (`use-client-random.tsx`)
   - Verify real market data integration
   - Test wallet action execution

2. **End-to-End Testing**
   - Agent mode: Connect wallet → Ask for transaction → Execute
   - Reasoning mode: Asset-specific educational responses
   - Session persistence: Conversations saved properly

---

## 🗂️ FILES TO UPDATE

### **@zym001 (Backend)**

- **CREATE:** `backend/service/agentkit/AgentKit.py`
- **CREATE:** `backend/service/agentkit/ActionProvider.py`
- **UPDATE:** `agent/agent.py` (lines 167-262)

### **@bash (AI)**

- **UPDATE:** `components/sections/chat-section.tsx` (lines 152-205)
- **UPDATE:** `components/ui/research-chat-widget.tsx` (lines 50-134)
- **UPDATE:** `agent/agent.py` (lines 167-262)
- **UPDATE:** `app/api/chat_with_agent/route.ts` (lines 157-190, 226-294)

### **REMOVE AFTER INTEGRATION**

- **DELETE:** `hooks/use-client-random.tsx` (entire file - dummy data)
- **UPDATE:** Remove all `generateRandom()` calls
- **UPDATE:** Remove hardcoded example prompts (make them real)

---

## 📋 INTEGRATION CHECKLIST

### **Backend (@zym001)**

- [ ] AgentKit class created with required constructor
- [ ] ActionProviders implemented for each chain
- [ ] Basic wallet actions (getbalance, send, receive)
- [ ] Lending/borrowing actions implemented
- [ ] User ActionProvider with get_balance_in_chain_id
- [ ] Integration with `agent/agent.py`
- [ ] Real wallet private key usage
- [ ] Multi-chain support working

### **AI (@bash)**

- [ ] Reasoning mode AI responses (educational)
- [ ] Agent mode AI responses (actionable)
- [ ] Research widget AI responses
- [ ] Wallet action parsing from AI responses
- [ ] Context-aware responses using session data
- [ ] Asset-specific responses (token, pool, action)
- [ ] Risk profile personalization
- [ ] Remove all dummy/hardcoded responses

### **Both Teams**

- [ ] Remove `hooks/use-client-random.tsx`
- [ ] Remove all hardcoded market data
- [ ] Test end-to-end integration
- [ ] Verify database updates working
- [ ] Confirm wallet actions execute properly
- [ ] Validate session persistence
- [ ] Test error handling and fallbacks

---

## 💡 CURRENT WORKING FEATURES (DON'T BREAK)

### **Production Ready Components:**

✅ **Session Management** - Full persistence, history, user authentication  
✅ **Database Schema** - All tables, relationships, indexes  
✅ **API Layer** - create_agent, chat_with_agent with full context  
✅ **Wallet Integration** - Privy + Wagmi, transaction handling  
✅ **UI/UX** - Chat interface, mode switching, error boundaries  
✅ **Multi-chain Support** - 5 networks, context switching

### **Integration-Ready Data:**

✅ **User Context** - Wallet address, preferences, activity history  
✅ **Agent Context** - Private keys, public keys, scratchpad memory  
✅ **Session Context** - Message history, asset parameters, mode  
✅ **Market Context** - Chain ID, balances, wallet connection status

---

**Next Steps:** Each team can work independently using this guide. The frontend and API infrastructure is production-ready and waiting for your backend and AI integrations! 🚀
