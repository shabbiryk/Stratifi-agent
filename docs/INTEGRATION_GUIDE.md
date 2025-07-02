# StratiFi Chat Interface - Integration Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Component Integration](#component-integration)
7. [Landing Page Integration](#landing-page-integration)
8. [Customization Options](#customization-options)
9. [Testing & Validation](#testing--validation)
10. [Production Deployment](#production-deployment)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## 🔧 Prerequisites

### Required Technologies

- **Node.js**: 18.0 or higher
- **Next.js**: 13.0 or higher
- **React**: 18.0 or higher
- **TypeScript**: 5.0 or higher
- **Supabase**: Active project with database access

### Required Accounts

- [Supabase Account](https://supabase.com) (Free tier available)
- [Privy Account](https://privy.io) for wallet authentication

### Knowledge Requirements

- Basic React/Next.js development
- TypeScript fundamentals
- Understanding of wallet connections
- Basic SQL knowledge (helpful)

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd Stratifi_App
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

### 3. Database Setup

```bash
# Run schema in Supabase dashboard
# Import supabase/schema.sql
```

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:3001` to see the interface.

---

## 📖 Step-by-Step Setup

### Step 1: Project Dependencies

Install the required packages:

```bash
# Core Supabase packages
npm install @supabase/supabase-js @supabase/ssr

# Wallet authentication
npm install @privy-io/react-auth

# Utility packages
npm install dotenv

# UI components (if using shadcn/ui)
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### Step 2: Project Structure

Create the following directory structure:

```
your-project/
├── components/
│   ├── layouts/
│   │   ├── main-layout.tsx
│   │   └── components/
│   │       └── top-bar.tsx
│   ├── sections/
│   │   └── chat-section.tsx
│   └── ui/
│       └── (shadcn components)
├── hooks/
│   └── use-session.ts
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── types/
│   └── session.ts
└── supabase/
    └── schema.sql
```

### Step 3: Core Files Setup

#### 3.1 Supabase Client (`lib/supabase.ts`)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

#### 3.2 TypeScript Interfaces (`types/session.ts`)

```typescript
export interface User {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  preferences: Record<string, any>;
}

export interface ChatSession {
  id: string;
  user_id: string;
  session_name: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  is_active: boolean;
  metadata: {
    initialContext?: {
      token?: string;
      poolId?: string;
      action?: string;
    };
  };
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface UserActivity {
  id: string;
  user_id: string;
  session_id: string | null;
  activity_type: "borrow" | "lend" | "repay" | "withdraw" | "liquidation";
  token_symbol: string;
  pool_id: string;
  amount: string | null;
  transaction_hash: string | null;
  status: "pending" | "confirmed" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}
```

#### 3.3 Session Hook (`hooks/use-session.ts`)

```typescript
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, ChatSession, ChatMessage } from "@/types/session";

export const useSession = () => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Authentication
  const signInWithWallet = useCallback(async (walletAddress: string) => {
    try {
      let { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (existingUser) {
        const { data: updatedUser } = await supabase
          .from("users")
          .update({ last_active: new Date().toISOString() })
          .eq("id", existingUser.id)
          .select()
          .single();

        setUser(updatedUser || existingUser);
        return updatedUser || existingUser;
      } else {
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({ wallet_address: walletAddress })
          .select()
          .single();

        if (createError) throw createError;
        setUser(newUser);
        return newUser;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return null;
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setSessions([]);
    setCurrentSession(null);
    setMessages([]);
  }, []);

  // Session management
  const createSession = useCallback(
    async (userId: string, initialContext?: any) => {
      const sessionName = generateSessionName(initialContext);

      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: userId,
          session_name: sessionName,
          metadata: { initialContext },
        })
        .select()
        .single();

      if (data) {
        setCurrentSession(data);
        setSessions((prev) => [data, ...prev]);
      }

      return data;
    },
    []
  );

  const loadSessions = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Load sessions error:", error);
    }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Load messages error:", error);
    }
  }, []);

  const addMessage = useCallback(
    async (
      content: string,
      role: "user" | "ai",
      sessionToUse?: ChatSession
    ) => {
      const targetSession = sessionToUse || currentSession;

      if (!targetSession) {
        console.error("No current session to add message to");
        return null;
      }

      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .insert({
            session_id: targetSession.id,
            role,
            content,
            metadata: { userAgent: navigator.userAgent },
          })
          .select()
          .single();

        if (error) throw error;

        await supabase
          .from("chat_sessions")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", targetSession.id);

        setMessages((prev) => [...prev, data]);
        return data;
      } catch (error) {
        console.error("Add message error:", error);
        return null;
      }
    },
    [currentSession]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Helper function
  const generateSessionName = (initialContext?: any): string => {
    if (initialContext?.token && initialContext?.action) {
      return `${initialContext.action.toUpperCase()} ${initialContext.token.toUpperCase()}`;
    }
    return `Chat ${new Date().toLocaleDateString()}`;
  };

  return {
    user,
    sessions,
    currentSession,
    messages,
    signInWithWallet,
    signOut,
    createSession,
    loadSessions,
    loadMessages,
    setCurrentSession,
    clearMessages,
    addMessage,
  };
};
```

---

## 🌐 Environment Configuration

### Environment Variables

Create `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Privy Configuration (optional)
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Getting Supabase Credentials

1. **Sign up** at [supabase.com](https://supabase.com)
2. **Create new project**
3. **Navigate to Settings > API**
4. **Copy the following**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🗄️ Database Setup

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Create new query**
4. **Copy and paste** the following schema:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create user_activities table
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  activity_type VARCHAR(20) NOT NULL CHECK (
    activity_type IN ('borrow', 'lend', 'repay', 'withdraw', 'liquidation')
  ),
  token_symbol VARCHAR(10) NOT NULL,
  pool_id VARCHAR(50) NOT NULL,
  amount DECIMAL(36, 18),
  transaction_hash VARCHAR(66),
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'failed', 'cancelled')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_sessions_last_message ON chat_sessions(last_message_at DESC);
CREATE INDEX idx_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_activities_status ON user_activities(status);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE
ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE
ON user_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

5. **Execute the query**

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Verification

Test your database connection:

```javascript
// test-connection.js
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count(*)")
      .single();

    if (error) throw error;
    console.log("✅ Database connection successful");
    console.log("📊 Users count:", data.count);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();
```

Run: `node test-connection.js`

---

## 🧩 Component Integration

### Step 1: Main Layout

Create `components/layouts/main-layout.tsx`:

```typescript
import { ReactNode } from "react";
import { TopBar } from "./components/top-bar";

interface MainLayoutProps {
  children: ReactNode;
  sessions?: any[];
  currentSession?: any;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
  showChatHistory?: boolean;
}

export function MainLayout({
  children,
  sessions = [],
  currentSession,
  onSessionSelect,
  onNewSession,
  showChatHistory = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <TopBar
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={onSessionSelect}
        onNewSession={onNewSession}
        showChatHistory={showChatHistory}
      />
      <main className="h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
```

### Step 2: Chat Section

Copy the complete `components/sections/chat-section.tsx` from the codebase. This is the main chat interface component.

### Step 3: Top Bar

Copy the complete `components/layouts/components/top-bar.tsx` from the codebase. This handles session history and wallet connection.

### Step 4: Page Integration

Update your main page (`app/page.tsx`):

```typescript
"use client";

import { ChatSection } from "@/components/sections/chat-section";
import { MainLayout } from "@/components/layouts";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback } from "react";

function HomeContent() {
  const searchParams = useSearchParams();

  // Extract parameters from URL
  const token = searchParams.get("token");
  const poolId = searchParams.get("pool");
  const action = searchParams.get("action");

  // State for managing chat sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // Handle session changes from ChatSection
  const handleSessionsChange = useCallback((newSessions: any[]) => {
    setSessions(newSessions);
  }, []);

  const handleCurrentSessionChange = useCallback((newSession: any) => {
    setCurrentSession(newSession);
  }, []);

  // Handle session selection from TopBar history
  const handleSessionSelect = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s: any) => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
      }
    },
    [sessions]
  );

  // Handle new session creation from TopBar
  const handleNewSession = useCallback(async () => {
    setCurrentSession(null);
  }, []);

  return (
    <MainLayout
      sessions={sessions}
      currentSession={currentSession}
      onSessionSelect={handleSessionSelect}
      onNewSession={handleNewSession}
      showChatHistory={true}
    >
      <ChatSection
        token={token}
        poolId={poolId}
        action={action}
        onSessionsChange={handleSessionsChange}
        onCurrentSessionChange={handleCurrentSessionChange}
        externalCurrentSession={currentSession}
      />
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
```

---

## 🔗 Landing Page Integration

### Step 1: Update Your Landing Page

Add redirection logic to your existing landing page:

```typescript
// components/protocol-card.tsx
interface ProtocolCardProps {
  name: string;
  token: string;
  poolId: string;
  apy: string;
  onViewDetails: (token: string, poolId: string, action: string) => void;
}

export function ProtocolCard({
  name,
  token,
  poolId,
  apy,
  onViewDetails,
}: ProtocolCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-gray-600">Token: {token}</p>
      <p className="text-gray-600">APY: {apy}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onViewDetails(token, poolId, "lend")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Lend Details
        </button>
        <button
          onClick={() => onViewDetails(token, poolId, "borrow")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Borrow Details
        </button>
      </div>
    </div>
  );
}
```

### Step 2: Landing Page Component

```typescript
// pages/landing.tsx
import { useRouter } from "next/navigation";
import { ProtocolCard } from "@/components/protocol-card";

const PROTOCOLS = [
  { name: "Aave ETH", token: "eth", poolId: "aave-eth", apy: "5.2%" },
  { name: "Compound BTC", token: "btc", poolId: "compound-btc", apy: "4.8%" },
  { name: "Aave USDC", token: "usdc", poolId: "aave-usdc", apy: "3.5%" },
];

export default function LandingPage() {
  const router = useRouter();

  const handleViewDetails = (token: string, poolId: string, action: string) => {
    // Redirect to chat interface with context
    const chatUrl = `/?token=${token}&pool=${poolId}&action=${action}`;
    router.push(chatUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">DeFi Protocols</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROTOCOLS.map((protocol) => (
            <ProtocolCard
              key={protocol.poolId}
              {...protocol}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 3: URL Structure

Ensure your URLs follow this pattern:

```
Landing Page: https://yourapp.com/protocols
Chat Interface: https://yourapp.com/?token=eth&pool=aave-eth&action=lend
```

---

## 🎨 Customization Options

### UI Styling

Customize the appearance by modifying:

```typescript
// components/sections/chat-section.tsx - Welcome Screen
const SUPPORTED_CHAINS = [
  { name: "Ethereum", color: "bg-blue-600" },
  { name: "Polygon", color: "bg-purple-600" },
  { name: "Arbitrum", color: "bg-cyan-600" },
  // Add your supported chains
];

const EXAMPLE_PROMPTS = [
  "How should I invest $100?",
  "What's the current Bitcoin price?",
  "Show me my portfolio",
  // Customize your example prompts
];
```

### AI Response Customization

Modify the AI response logic:

```typescript
// components/sections/chat-section.tsx - simulateAIResponse
const simulateAIResponse = async (
  userMessage: string,
  sessionToUse?: ChatSession
) => {
  // Add your custom AI response logic
  // Connect to OpenAI, Claude, or your preferred AI service

  const aiResponse = await generateAIResponse(userMessage, {
    assetContext: { token, poolId, action },
    userHistory: userActivities,
    sessionContext: currentSession?.metadata,
  });

  await addMessage(aiResponse, "ai", targetSession);
};
```

### Asset Context Customization

Customize the asset context message:

```typescript
// components/sections/chat-section.tsx - generateAssetDetailsMessage
const generateAssetDetailsMessage = (
  token: string,
  poolId: string,
  action: string
) => {
  // Customize based on your protocols and assets
  const protocolInfo = getProtocolInfo(poolId);
  const assetInfo = getAssetInfo(token);

  return `🎯 **${action.toUpperCase()} ${token.toUpperCase()}**
  
**Protocol**: ${protocolInfo.name}
**Pool**: ${poolId}
**Current APY**: ${protocolInfo.apy}

${
  action === "lend"
    ? "Start earning passive income"
    : "Access liquidity for your needs"
}

What would you like to know more about?`;
};
```

---

## ✅ Testing & Validation

### 1. Connection Test

```bash
# Test database connection
node -e "
require('dotenv').config({path:'.env.local'});
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('users').select('count(*)').then(({data,error}) => console.log(error || 'Connected successfully', data));
"
```

### 2. Manual Testing Scenarios

#### Scenario 1: Direct Access

1. Visit `http://localhost:3001/`
2. Should show welcome screen
3. Click example prompt
4. Should create session and show response

#### Scenario 2: Asset Context

1. Visit `http://localhost:3001/?token=eth&pool=aave-eth&action=lend`
2. Should create asset context session
3. Should show asset-specific message

#### Scenario 3: Session History

1. Connect wallet
2. Create multiple sessions
3. Click history icon in TopBar
4. Should show session list with count badge

### 3. Database Validation

```javascript
// validate-data.js
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function validateData() {
  const { data: users } = await supabase.from("users").select("*");
  const { data: sessions } = await supabase.from("chat_sessions").select("*");
  const { data: messages } = await supabase.from("chat_messages").select("*");

  console.log(`Users: ${users?.length || 0}`);
  console.log(`Sessions: ${sessions?.length || 0}`);
  console.log(`Messages: ${messages?.length || 0}`);

  // Check asset context sessions
  const assetSessions =
    sessions?.filter(
      (s) =>
        s.metadata?.initialContext &&
        Object.keys(s.metadata.initialContext).length > 0
    ) || [];

  console.log(`Asset Context Sessions: ${assetSessions.length}`);
  assetSessions.forEach((s) => {
    const ctx = s.metadata.initialContext;
    console.log(
      `  - ${s.session_name}: ${ctx.token}-${ctx.poolId}-${ctx.action}`
    );
  });
}

validateData();
```

---

## 🚀 Production Deployment

### 1. Environment Setup

Update `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Redeploy with environment variables
vercel --prod
```

### 3. Database Migration

For production database:

1. **Create production Supabase project**
2. **Run schema migration**
3. **Update environment variables**
4. **Test connection**

### 4. Performance Optimization

```typescript
// Enable React optimization
import { memo, useMemo, useCallback } from "react";

// Memoize expensive components
export const ChatSection = memo(function ChatSection(props) {
  // Component implementation
});

// Optimize session loading
const loadSessionsOptimized = useCallback(async (userId: string) => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, session_name, last_message_at, metadata")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("last_message_at", { ascending: false })
    .limit(50); // Limit recent sessions

  // Implement pagination for large datasets
}, []);
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Cannot connect to Supabase"

**Solution**: Check environment variables

```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 2. "No current session to add message to"

**Solution**: Check session creation logic

```typescript
// Ensure session exists before adding messages
if (!currentSession) {
  const newSession = await createSession(user.id);
  await addMessage(content, role, newSession);
}
```

#### 3. "Too many sessions created"

**Solution**: Check for infinite loops

- Verify useEffect dependencies
- Check assetContextHandled ref implementation

#### 4. "Messages not appearing"

**Solution**: Check message loading

```typescript
// Debug message loading
useEffect(() => {
  console.log("Current session:", currentSession?.id);
  console.log("Messages:", messages.length);
}, [currentSession, messages]);
```

### Debug Tools

#### 1. Console Logging

Enable comprehensive logging:

```typescript
// Add to useSession hook
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Session operation:", { action, sessionId, userId });
}
```

#### 2. Supabase Dashboard

Monitor your database:

1. **Go to Supabase Dashboard**
2. **Navigate to Table Editor**
3. **Check data in real-time**
4. **Monitor API logs**

#### 3. Network Tab

Check browser network tab for:

- Failed API requests
- CORS issues
- Authentication problems

---

## 🏆 Best Practices

### 1. Performance

- **Pagination**: Implement for large session lists
- **Lazy Loading**: Load messages on demand
- **Memoization**: Use React.memo for expensive components
- **Debouncing**: Debounce user input

### 2. Security

- **Environment Variables**: Never expose service role key in frontend
- **Input Validation**: Validate all user inputs
- **Rate Limiting**: Implement request rate limiting
- **Data Sanitization**: Sanitize all user content

### 3. User Experience

- **Loading States**: Show loading indicators
- **Error Handling**: Provide meaningful error messages
- **Offline Support**: Handle network disconnections
- **Responsive Design**: Ensure mobile compatibility

### 4. Development

- **TypeScript**: Use strict TypeScript configuration
- **Testing**: Write unit tests for critical functions
- **Documentation**: Keep documentation updated
- **Version Control**: Use semantic versioning

### 5. Monitoring

- **Error Tracking**: Implement error monitoring (Sentry)
- **Analytics**: Track user interactions
- **Performance**: Monitor Core Web Vitals
- **Database**: Monitor Supabase metrics

---

## 📞 Support

### Resources

- **Documentation**: Refer to this guide and code comments
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

### Getting Help

1. **Check console logs** for error messages
2. **Verify environment variables** are correctly set
3. **Test database connection** with provided scripts
4. **Compare with working examples** in this guide

This comprehensive integration guide should enable anyone to understand, integrate, and customize the StratiFi chat interface system successfully.
