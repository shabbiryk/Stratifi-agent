# StratiFi Chat Interface Documentation

## Overview

The StratiFi chat interface is an AI-powered conversational system that provides users with intelligent assistance for cryptocurrency trading, lending, borrowing, and portfolio management. The chat system features context-aware responses, wallet integration, and seamless handling of asset-specific operations from external redirects.

## Architecture

### Core Components

1. **ChatSection Component** (`components/sections/chat-section.tsx`)

   - Main chat interface component
   - Handles message state management
   - Integrates with wallet connection
   - Processes URL parameters for asset context

2. **Main Layout Integration** (`app/page.tsx`)

   - URL parameter extraction from agent.xyz redirects
   - Passes asset context to chat component
   - Suspense wrapper for Next.js compatibility

3. **AI Response System**
   - Pattern-based response matching
   - Context-aware responses based on asset parameters
   - Wallet-state dependent messaging

## Chat Interface Features

### 🎯 Dual Interface States

#### Welcome Screen

- **Trigger**: No messages in chat history
- **Content**:
  - Welcome message and introduction
  - Supported blockchain networks (Base, Starknet, Somnia)
  - Example prompts for user interaction
  - Warning about supported chains
- **Purpose**: Onboard new users and provide entry points

#### Active Chat Interface

- **Trigger**: Messages exist in chat history
- **Content**:
  - Chat header with AI status
  - Message history with timestamps
  - Real-time typing indicators
  - Message interaction controls (copy, reactions)
- **Purpose**: Facilitate ongoing conversations

### 💬 Message System

#### Message Types

```typescript
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}
```

#### Message Features

- **Auto-scrolling**: Automatically scrolls to newest messages
- **Timestamps**: Human-readable time format (HH:MM)
- **Copy functionality**: Click-to-copy message content
- **Message reactions**: Thumbs up/down for feedback (UI ready)

### 🔗 URL Parameter Integration

#### Agent.xyz Redirect Handling

**URL Format**: `https://app.stratifi.xyz/?token={symbol}&pool={poolId}&action={action}`

**Supported Parameters**:

- `token`: Asset symbol (e.g., ETH, BTC, USDC)
- `pool`: Pool identifier (e.g., pool_123)
- `action`: Operation type (`borrow` or `lend`)

#### Auto-Message Generation

When URL parameters are detected:

1. **Immediate Context Display**: Shows asset details from landing page
2. **Action-Specific Guidance**: Tailored instructions for borrowing/lending
3. **Wallet-Aware Responses**: Different flows for connected vs. disconnected users

## AI Response System

### 🧠 Context Awareness

The AI system operates with multiple layers of context:

1. **Asset Context**: From URL parameters (token, pool, action)
2. **Wallet Context**: Connection status and address
3. **Conversation Context**: Previous messages and user intent

### 📋 Response Categories

#### Asset-Specific Responses

When asset context is present (`hasAssetContext = true`):

**Confirmation Responses** (`yes`, `proceed`, `continue`):

- Wallet not connected → Connection guidance
- Wallet connected → Transaction preparation flow

**Balance/Collateral Queries** (`balance`, `collateral`):

- Shows mock balance data
- Borrowing → Collateral requirements and health factor
- Lending → Available balance and yield estimates

**Rate Information** (`rate`, `apy`, `interest`):

- Current borrowing/lending rates for specific pool
- Rate breakdown and factors
- Pool utilization statistics

**Asset Price Queries** (`price` + matching token):

- Current market price
- Context-relevant trading information
- Pool-specific rate data

#### General Crypto Responses

**Portfolio Analysis** (`portfolio`):

- Wallet connection requirement for analysis
- Connected → Portfolio scanning and recommendations
- Not connected → Connection guidance

**Investment Strategies** (`invest`, `$100`):

- Asset context → Specific borrowing/lending strategy
- General → Risk-based investment recommendations

**Market Data** (`trending`, `memecoin`):

- Current trending tokens
- Performance metrics
- Risk warnings

**Buy/Sell Operations** (`buy`, `ethereum`, `eth`):

- Asset context → Pool-specific operations
- General → Standard trading flow

### 🎨 Response Formatting

#### Rich Text Features

- **Emojis**: Visual indicators for different sections
- **Bold Headers**: `**Section Title**`
- **Bullet Points**: Organized information lists
- **Status Indicators**: ✅ ⏳ ⚠️ for process states

#### Dynamic Data

- **Random APY/Rates**: Simulated market data (3-13% range)
- **Mock Balances**: Generated balance data for demos
- **Wallet Addresses**: Truncated format (0x1234...5678)

## Technical Implementation

### 🔧 State Management

```typescript
// Core state variables
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [input, setInput] = useState("");
const [isTyping, setIsTyping] = useState(false);
const [showWelcome, setShowWelcome] = useState(true);
```

### 🔌 Wallet Integration

**Privy Integration**:

```typescript
const { authenticated, login } = usePrivy();
const { wallets } = useWallets();
const primaryWallet = wallets[0];
const walletAddress = primaryWallet?.address;
```

**Wallet-Aware Features**:

- Different response flows for connected/disconnected users
- Personalized transaction summaries
- Balance checking capabilities

### ⚡ Response Simulation

**API Simulation**:

```typescript
const simulateAIResponse = async (userMessage: string) => {
  setIsTyping(true);

  // Simulate network delay (1-3 seconds)
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Pattern matching and context-aware response generation
  // ...

  setIsTyping(false);
  setMessages((prev) => [...prev, aiMessage]);
};
```

### 🎯 Auto-Scroll Implementation

```typescript
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  scrollToBottom();
}, [messages, isTyping]);
```

## User Experience Flows

### 🚀 Standard Chat Flow

1. **Landing**: User sees welcome screen with example prompts
2. **Input**: User types message or clicks example
3. **Processing**: Typing indicator appears (1-3s delay)
4. **Response**: AI provides contextual response
5. **Continuation**: User can ask follow-up questions

### 🎯 Asset-Specific Flow (from agent.xyz)

1. **Redirect**: User arrives with URL parameters

   ```
   /?token=ETH&pool=pool_123&action=borrow
   ```

2. **Auto-Context**: Chat immediately displays asset details

   ```
   📤 Asset Details from Landing Page

   Token: ETH
   Pool ID: pool_123
   Action: Borrowing
   ```

3. **Guided Flow**: AI provides specific next steps:

   - Wallet connection (if needed)
   - Balance/collateral checks
   - Transaction preparation
   - Execution guidance

4. **Contextual Responses**: All follow-up questions are asset-aware:
   - "What's the rate?" → ETH borrowing rates for pool_123
   - "Check my balance" → Collateral requirements for ETH borrowing
   - "Yes, proceed" → ETH borrowing transaction flow

### 💰 Wallet Connection Flow

**Not Connected**:

1. User asks asset-related question
2. AI explains wallet connection benefits
3. Guides to "Connect Wallet" button
4. Provides preview of post-connection features

**Connected**:

1. AI acknowledges wallet connection
2. Shows truncated address for verification
3. Provides personalized transaction summaries
4. Offers wallet-specific operations

## Example Conversations

### Asset-Specific Context (ETH Borrowing)

**Initial Message** (auto-generated):

```
📤 Asset Details from Landing Page

Token: ETH
Pool ID: pool_123
Action: Borrowing

I can help you proceed with borrowing ETH. Here's what I can do:

💰 Borrowing ETH:
• Check your collateral requirements
• Calculate borrowing capacity
• Show current interest rates
• Execute the borrowing transaction
• Monitor your health factor

⚠️ Next Steps:
1. Connect your wallet to proceed
2. I'll verify your collateral
3. Prepare the transaction
4. Execute borrowing

Would you like me to help you connect your wallet to get started?
```

**User**: "What's the current rate?"

**AI Response**:

```
📈 Interest Rates for ETH - Pool pool_123

💸 Borrowing Rates:
• Current Rate: 4.73% APR
• Rate Type: Variable
• Collateral Ratio: 150%
• Liquidation Threshold: 80%

Rate Factors:
• Pool utilization: 67.3%
• Available liquidity: High
• Market volatility: Moderate

These are competitive rates! Would you like to proceed with borrowing?
```

### General Crypto Assistance

**User**: "How should I invest $100?"

**AI Response**:

```
Great question! For a $100 investment, I'd recommend considering these strategies:

🟢 Conservative (Low Risk)
• 60% USDC staking (4-6% APY)
• 40% ETH (for growth potential)

🟡 Moderate (Medium Risk)
• 40% ETH
• 30% BTC
• 30% High-yield DeFi protocols

🔴 Aggressive (High Risk)
• 50% Promising altcoins
• 30% DeFi yield farming
• 20% Emerging protocols

What's your risk tolerance and investment timeline?
```

## Configuration & Customization

### 🎨 Supported Chains Configuration

```typescript
const SUPPORTED_CHAINS = [
  { name: "Base", color: "bg-blue-600" },
  { name: "Starknet", color: "bg-purple-500" },
  { name: "Somnia", color: "bg-pink-500" },
];
```

### 📝 Example Prompts

```typescript
const EXAMPLE_PROMPTS = [
  "How should I invest $100?",
  "What's the Bitcoin price?",
  "Show me trending memecoins",
  "Analyze my portfolio",
  "Help me buy Ethereum",
  "What are the best DeFi yields?",
];
```

### ⚙️ Response Timing

- **Typing Delay**: 1-3 seconds (simulates processing time)
- **Auto-scroll**: Smooth scrolling to new messages
- **Debounced Input**: Prevents spam submissions

## Future Enhancements

### 🔮 Planned Features

1. **Real Backend Integration**

   - Replace mock responses with actual API calls
   - Real-time market data integration
   - Actual transaction execution

2. **Enhanced Personalization**

   - User preference learning
   - Conversation history persistence
   - Custom response templates

3. **Advanced Analytics**

   - User interaction tracking
   - Response effectiveness metrics
   - A/B testing for message formats

4. **Multi-language Support**
   - Internationalization (i18n) setup
   - Language detection and switching
   - Localized financial terminology

### 🛠️ Technical Improvements

1. **Performance Optimization**

   - Message virtualization for long conversations
   - Lazy loading of historical messages
   - Response caching

2. **Accessibility Enhancements**

   - Screen reader support
   - Keyboard navigation
   - High contrast mode

3. **Error Handling**
   - Network failure recovery
   - Graceful degradation
   - User-friendly error messages

## Development Guidelines

### 🧪 Testing the Chat System

1. **Basic Chat Flow**:

   ```bash
   # Start development server
   npm run dev

   # Navigate to http://localhost:3001
   # Test example prompts and general responses
   ```

2. **Asset Context Testing**:

   ```bash
   # Test URL parameters
   http://localhost:3001/?token=ETH&pool=pool_123&action=borrow
   http://localhost:3001/?token=BTC&pool=pool_456&action=lend
   ```

3. **Wallet Integration Testing**:
   - Test responses with wallet connected/disconnected
   - Verify address truncation and display
   - Test wallet-aware response variations

### 📝 Code Maintenance

1. **Adding New Response Patterns**:

   - Update `simulateAIResponse` function
   - Add keyword detection logic
   - Include asset context awareness

2. **Modifying UI Components**:

   - Update styling in chat container
   - Modify message bubble designs
   - Adjust responsive breakpoints

3. **Extending Asset Support**:
   - Add new token symbols to recognition
   - Update asset-specific response templates
   - Include additional pool types

---

_Last updated: January 2025_
_Version: 1.0.0_
