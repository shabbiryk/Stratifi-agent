here's the demo:




# StratiFi Chat Interface

A sophisticated conversational AI interface for DeFi operations with persistent session tracking, wallet-based authentication, and context-aware responses.

## 🌟 Overview

The StratiFi Chat Interface bridges the gap between complex DeFi protocols and user-friendly conversation. Users can seamlessly transition from protocol selection on landing pages to contextual AI conversations that understand their specific lending/borrowing intentions.

### Key Features

- **🔗 Seamless Landing Page Integration**: Direct redirection with asset context preservation
- **💰 Wallet-Based Authentication**: Secure, decentralized user identification
- **📱 Persistent Session Tracking**: Conversations saved and resumable across sessions
- **🎯 Context-Aware AI**: Responses tailored to specific assets and user actions
- **⚡ Real-time Updates**: Live message synchronization via Supabase
- **📊 Activity Tracking**: Complete DeFi transaction history integration
- **🎨 Modern UI**: Clean, icon-based interface inspired by leading chat applications

## 🏗️ System Architecture

### Component Flow

```
Landing Page → URL Parameters → Chat Interface → Supabase Database
     ↓              ↓               ↓               ↓
Protocol Cards → ?token=eth&    → ChatSection → Persistent Storage
  Selection       pool=aave-eth    Component      & Real-time Sync
                 &action=lend
```

### Data Flow

The system intelligently handles two primary user journeys:

1. **Asset Context Journey**: Users arrive from landing pages with specific DeFi intentions
2. **General Chat Journey**: Users access the interface directly for exploratory conversations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Next.js 13+
- Supabase account
- Privy account (for wallet auth)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Stratifi_App

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Fill in your Supabase and Privy credentials

# Database setup
# Copy and execute supabase/schema.sql in your Supabase dashboard

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see the interface in action.

## 📖 Documentation

### Core Documentation

- **[Complete Implementation Guide](docs/COMPLETE_IMPLEMENTATION_GUIDE.md)** - Comprehensive setup and architecture guide
- **[Code Flow Documentation](docs/CODE_FLOW_DOCUMENTATION.md)** - Detailed component relationships and data flow
- **[Integration Guide](docs/INTEGRATION_GUIDE.md)** - Step-by-step integration instructions
- **[Session Tracking Design](docs/SESSION_TRACKING_DESIGN.md)** - Database schema and session management

### Key Components

#### 1. Session Management (`hooks/use-session.ts`)

Centralized hook managing user authentication, session creation, and message handling.

```typescript
const {
  user,
  sessions,
  currentSession,
  messages,
  signInWithWallet,
  createSession,
  addMessage,
} = useSession();
```

#### 2. Chat Interface (`components/sections/chat-section.tsx`)

Main conversation interface with asset context detection and AI response simulation.

#### 3. TopBar (`components/layouts/components/top-bar.tsx`)

Clean header with session history, new chat creation, and wallet connection.

## 🗄️ Database Schema

### Tables Overview

```sql
users            -- Wallet-based user accounts
├── chat_sessions    -- Conversation sessions with metadata
│   ├── chat_messages    -- Individual user/AI messages
│   └── user_activities  -- DeFi transaction tracking
```

### Key Features

- **Asset Context Storage**: Sessions preserve landing page parameters
- **Message History**: Complete conversation persistence
- **Activity Tracking**: DeFi transaction integration ready
- **Real-time Updates**: Live synchronization across devices

## 🔄 User Flows

### Asset Context Flow

1. User selects protocol on landing page
2. Redirected to chat with URL: `/?token=eth&pool=aave-eth&action=lend`
3. System creates/loads asset-specific session
4. AI provides contextual welcome message
5. Conversation continues with asset awareness

### General Chat Flow

1. User visits chat interface directly
2. Shows welcome screen with example prompts
3. User interaction creates general session
4. Standard AI conversation flow

## 🎯 URL Structure

### Landing Page Integration

Your landing page should redirect users with this URL structure:

```
Base URL: https://yourapp.com/
Asset Context: /?token={TOKEN}&pool={POOL_ID}&action={ACTION}

Examples:
- /?token=eth&pool=aave-eth&action=lend
- /?token=btc&pool=compound-btc&action=borrow
- /?token=usdc&pool=aave-usdc&action=lend
```

### Implementation Example

```typescript
// Landing page redirect logic
const handleViewDetails = (token: string, poolId: string, action: string) => {
  const chatUrl = `/?token=${token}&pool=${poolId}&action=${action}`;
  router.push(chatUrl);
};
```

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Customization Points

#### 1. AI Response Logic

```typescript
// components/sections/chat-section.tsx
const simulateAIResponse = async (userMessage: string) => {
  // Replace with your AI service integration
  // OpenAI, Claude, Hugging Face, etc.
};
```

#### 2. Asset Context Messages

```typescript
const generateAssetDetailsMessage = (
  token: string,
  poolId: string,
  action: string
) => {
  // Customize based on your protocols
  return `Welcome message for ${action}ing ${token} in ${poolId}`;
};
```

#### 3. Example Prompts

```typescript
const EXAMPLE_PROMPTS = [
  "How should I invest $100?",
  "What's the current Bitcoin price?",
  // Add your custom prompts
];
```

## 🧪 Testing

### Manual Testing Scenarios

1. **Direct Access Test**

   ```
   Visit: http://localhost:3001/
   Expected: Welcome screen with example prompts
   ```

2. **Asset Context Test**

   ```
   Visit: http://localhost:3001/?token=eth&pool=aave-eth&action=lend
   Expected: Asset-specific session with context message
   ```

3. **Session Persistence Test**
   ```
   1. Create session and send messages
   2. Refresh page or revisit
   3. Expected: Session history preserved
   ```

### Database Validation

```bash
# Test database connection
node -e "
require('dotenv').config({path:'.env.local'});
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('users').select('count(*)').then(console.log);
"
```

## 🏛️ Project Structure

```
Stratifi_App/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page with URL parameter handling
│   └── providers.tsx           # Context providers
├── components/
│   ├── layouts/
│   │   ├── main-layout.tsx     # Main app layout
│   │   └── components/
│   │       └── top-bar.tsx     # Header with chat history
│   ├── sections/
│   │   └── chat-section.tsx    # Main chat interface
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── use-session.ts          # Core session management
├── lib/
│   ├── supabase.ts            # Database client
│   └── utils.ts               # Utility functions
├── types/
│   └── session.ts             # TypeScript interfaces
├── supabase/
│   └── schema.sql             # Database schema
└── docs/                      # Comprehensive documentation
```

## 🚀 Production Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Redeploy with production settings
vercel --prod
```

### Database Migration

1. Create production Supabase project
2. Execute `supabase/schema.sql` in production
3. Update environment variables
4. Test connection

## 🔍 Troubleshooting

### Common Issues

#### Sessions Not Creating

- **Check**: Environment variables configuration
- **Check**: Database connection and permissions
- **Check**: Wallet authentication flow

#### Messages Not Appearing

- **Check**: Current session state
- **Check**: Database message insertion
- **Check**: Component re-rendering

#### Asset Context Not Working

- **Check**: URL parameter extraction
- **Check**: useEffect dependencies
- **Check**: Asset context session logic

### Debug Tools

1. **Console Logs**: Comprehensive logging throughout the application
2. **Supabase Dashboard**: Real-time database monitoring
3. **Browser DevTools**: Network tab for API request debugging

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch
3. **Implement** changes with tests
4. **Update** documentation
5. **Submit** pull request

### Code Standards

- **TypeScript**: Strict typing required
- **Comments**: Document complex logic
- **Testing**: Add tests for new features
- **Documentation**: Update relevant docs

## 📊 Analytics & Monitoring

The system is designed to track:

- **User Engagement**: Session frequency, message patterns
- **Asset Context Usage**: Popular protocols and actions
- **Conversation Flow**: AI effectiveness and user satisfaction
- **Performance Metrics**: Response times and error rates

## 🔐 Security Considerations

- **Wallet-Based Authentication**: Decentralized user identification
- **Environment Variables**: Secure credential management
- **Input Validation**: All user inputs sanitized
- **Database Security**: Row-level security policies

## 📞 Support

### Resources

- **[Complete Documentation](docs/)** - Comprehensive guides and tutorials
- **[Supabase Docs](https://supabase.com/docs)** - Database and real-time features
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation

### Getting Help

1. Check the comprehensive documentation in the `docs/` folder
2. Review console logs for error messages
3. Verify environment variables and database connection
4. Compare implementation with provided examples

# Morpho Agent (uAgents + The Graph)

This project includes a Python agent (using [uAgents](https://docs.agentverse.ai/docs/uAgents/asimini-agent)) that answers questions about the Morpho protocol by fetching live data from The Graph's Morpho subgraph.

## Setup

1. **Install Python dependencies**

   ```sh
   pip install -r agent/requirements.txt
   ```

2. **Set your API keys**
   - `THE_GRAPH_API_KEY`: Get from [The Graph](https://thegraph.com/)
   - `ASI_ONE_API_KEY`: Get from [ASI:One](https://asi1.ai/dashboard/api-keys)

   You can set these as environment variables or directly in `agent/agent.py` for testing.

3. **Run the agent**

   ```sh
   python agent/agent.py
   ```

The agent will listen for chat messages about Morpho protocol and respond with live data from the Morpho subgraph.

---

**Built with ❤️ for the DeFi community**

_Transforming complex protocol interactions into natural conversations._
