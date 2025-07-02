# Session Tracking & User Activity Design
 
## Overview

This document outlines the implementation strategy for adding session tracking and user activity persistence to the StratiFi chat interface using **Supabase**. The system will track lending/borrowing activities, maintain conversation history, and provide personalized experiences based on wallet-connected user sessions with real-time updates.

## Core Requirements

### 🎯 Functional Requirements

- **Session Persistence**: Store chat conversations linked to wallet addresses
- **Activity Tracking**: Record borrowing/lending transactions and status
- **Context Awareness**: AI responses should be aware of user's transaction history
- **Privacy**: Sessions only accessible when the associated wallet is connected
- **Performance**: Fast retrieval of session data without blocking the UI
- **Real-time Updates**: Live chat updates and activity status changes

### 🔐 Security Requirements

- **Wallet-Gated Access**: Sessions only visible to the wallet owner
- **Data Encryption**: Sensitive financial data encrypted at rest
- **Session Expiry**: Automatic cleanup of old inactive sessions
- **Audit Trail**: Track all session modifications for security
- **RLS Policies**: Row-level security to ensure data isolation

## Supabase Architecture

### 🏗️ Supabase Setup

#### Project Configuration

```javascript
// supabase/config.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

#### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 📊 Database Schema (Supabase Tables)

#### Users Table

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only see their own data
CREATE POLICY "Users can view own data" ON users
FOR ALL USING (auth.uid() = auth_user_id);

-- Create indexes
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_auth_id ON users(auth_user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE
ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Sessions Table

```sql
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

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only access their own sessions
CREATE POLICY "Users can manage own sessions" ON chat_sessions
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_sessions_last_message ON chat_sessions(last_message_at DESC);
CREATE INDEX idx_sessions_active ON chat_sessions(is_active, last_message_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE
ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Messages Table

```sql
-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only access messages from their sessions
CREATE POLICY "Users can access own session messages" ON chat_messages
  FOR ALL USING (
    session_id IN (
      SELECT s.id FROM chat_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_messages_role ON chat_messages(role);
```

#### User Activities Table

```sql
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

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only access their own activities
CREATE POLICY "Users can manage own activities" ON user_activities
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_activities_status ON user_activities(status);
CREATE INDEX idx_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_activities_type ON user_activities(activity_type);

-- Create trigger for updated_at
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE
ON user_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 🏗️ TypeScript Interfaces (Supabase Compatible)

```typescript
// types/supabase.ts
import { Database } from "./database.types"; // Generated by Supabase CLI

// Re-export generated types
export type Tables = Database["public"]["Tables"];
export type User = Tables["users"]["Row"];
export type UserInsert = Tables["users"]["Insert"];
export type UserUpdate = Tables["users"]["Update"];

export type ChatSession = Tables["chat_sessions"]["Row"];
export type ChatSessionInsert = Tables["chat_sessions"]["Insert"];
export type ChatSessionUpdate = Tables["chat_sessions"]["Update"];

export type ChatMessage = Tables["chat_messages"]["Row"];
export type ChatMessageInsert = Tables["chat_messages"]["Insert"];
export type ChatMessageUpdate = Tables["chat_messages"]["Update"];

export type UserActivity = Tables["user_activities"]["Row"];
export type UserActivityInsert = Tables["user_activities"]["Insert"];
export type UserActivityUpdate = Tables["user_activities"]["Update"];

// Custom interfaces for enhanced functionality
export interface UserPreferences {
  theme?: "dark" | "light";
  notifications?: boolean;
  defaultSlippage?: number;
  preferredChain?: string;
}

export interface SessionMetadata {
  initialContext?: {
    token?: string;
    poolId?: string;
    action?: string;
  };
  totalMessages?: number;
  lastActiveChain?: string;
}

export interface MessageMetadata {
  responseTime?: number;
  containsTransaction?: boolean;
  relatedActivity?: string;
  userAgent?: string;
}

export interface ActivityMetadata {
  network?: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  interestRate?: string;
  collateralRatio?: string;
}

// Extended interfaces with relations
export interface ChatSessionWithMessages extends ChatSession {
  messages?: ChatMessage[];
  messageCount?: number;
}

export interface UserWithSessions extends User {
  sessions?: ChatSession[];
  activities?: UserActivity[];
}
```

## Implementation Strategy

### 🚀 Phase 1: Supabase Services

#### Authentication Service

```typescript
// services/authService.ts
import { supabase } from "@/lib/supabase";
import { User } from "@/types/supabase";

class AuthService {
  // Sign in with wallet (custom auth)
  async signInWithWallet(
    walletAddress: string,
    signature: string
  ): Promise<User | null> {
    try {
      // Create or get user with custom auth
      const { data: authUser, error: authError } =
        await supabase.auth.signInWithPassword({
          email: `${walletAddress}@wallet.local`, // Custom email format
          password: signature,
        });

      if (authError) {
        // Create new user if doesn't exist
        const { data: newAuthUser, error: signUpError } =
          await supabase.auth.signUp({
            email: `${walletAddress}@wallet.local`,
            password: signature,
            options: {
              data: {
                wallet_address: walletAddress,
              },
            },
          });

        if (signUpError) throw signUpError;
      }

      // Get or create user record
      return await this.getOrCreateUser(walletAddress);
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  private async getOrCreateUser(walletAddress: string): Promise<User | null> {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (existingUser) {
      // Update last active
      const { data: updatedUser } = await supabase
        .from("users")
        .update({ last_active: new Date().toISOString() })
        .eq("id", existingUser.id)
        .select()
        .single();

      return updatedUser || existingUser;
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        wallet_address: walletAddress,
        auth_user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (createError) throw createError;
    return newUser;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  getCurrentUser(): Promise<User | null> {
    return supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return null;

      return supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single()
        .then(({ data }) => data);
    });
  }
}

export const authService = new AuthService();
```

#### Session Service (Supabase)

```typescript
// services/sessionService.ts
import { supabase } from "@/lib/supabase";
import {
  ChatSession,
  ChatSessionInsert,
  ChatMessage,
  ChatMessageInsert,
  ChatSessionWithMessages,
} from "@/types/supabase";

class SessionService {
  // Create new session
  async createSession(
    userId: string,
    initialContext?: any
  ): Promise<ChatSession> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        metadata: { initialContext },
        session_name: this.generateSessionName(initialContext),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user sessions with real-time subscription
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select(
        `
        *,
        messages:chat_messages(count)
      `
      )
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_message_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Subscribe to session updates
  subscribeToSessions(
    userId: string,
    callback: (sessions: ChatSession[]) => void
  ) {
    return supabase
      .channel("user-sessions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_sessions",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refresh sessions when changes occur
          this.getUserSessions(userId).then(callback);
        }
      )
      .subscribe();
  }

  // Get session with messages
  async getSessionWithMessages(
    sessionId: string
  ): Promise<ChatSessionWithMessages | null> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select(
        `
        *,
        messages:chat_messages(
          id,
          role,
          content,
          created_at,
          metadata
        )
      `
      )
      .eq("id", sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  // Add message to session
  async addMessage(message: ChatMessageInsert): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert(message)
      .select()
      .single();

    if (error) throw error;

    // Update session's last_message_at
    await supabase
      .from("chat_sessions")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", message.session_id);

    return data;
  }

  // Subscribe to messages in a session
  subscribeToMessages(
    sessionId: string,
    callback: (message: ChatMessage) => void
  ) {
    return supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  // Update session
  async updateSession(
    sessionId: string,
    updates: Partial<ChatSession>
  ): Promise<ChatSession> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update(updates)
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ is_active: false })
      .eq("id", sessionId);

    if (error) throw error;
  }

  private generateSessionName(context?: any): string {
    if (context?.token && context?.action) {
      return `${context.action.toUpperCase()} ${context.token}`;
    }
    return `Chat ${new Date().toLocaleDateString()}`;
  }
}

export const sessionService = new SessionService();
```

#### Activity Service (Supabase)

```typescript
// services/activityService.ts
import { supabase } from "@/lib/supabase";
import {
  UserActivity,
  UserActivityInsert,
  UserActivityUpdate,
} from "@/types/supabase";

class ActivityService {
  // Get user activities
  async getUserActivities(userId: string): Promise<UserActivity[]> {
    const { data, error } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Record new activity
  async recordActivity(activity: UserActivityInsert): Promise<UserActivity> {
    const { data, error } = await supabase
      .from("user_activities")
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update activity status
  async updateActivity(
    activityId: string,
    updates: UserActivityUpdate
  ): Promise<UserActivity> {
    const { data, error } = await supabase
      .from("user_activities")
      .update(updates)
      .eq("id", activityId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Subscribe to activity updates
  subscribeToActivities(
    userId: string,
    callback: (activity: UserActivity) => void
  ) {
    return supabase
      .channel("user-activities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_activities",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as UserActivity);
        }
      )
      .subscribe();
  }

  // Get activities summary
  async getActivitiesSummary(userId: string) {
    const activities = await this.getUserActivities(userId);

    const summary = {
      totalBorrowed: 0,
      totalLent: 0,
      pendingTransactions: 0,
      activePositions: 0,
    };

    activities.forEach((activity) => {
      if (activity.status === "confirmed") {
        const amount = parseFloat(activity.amount || "0");
        if (activity.activity_type === "borrow") {
          summary.totalBorrowed += amount;
        } else if (activity.activity_type === "lend") {
          summary.totalLent += amount;
        }
        summary.activePositions += 1;
      } else if (activity.status === "pending") {
        summary.pendingTransactions += 1;
      }
    });

    return summary;
  }
}

export const activityService = new ActivityService();
```

### 🎯 Phase 2: Enhanced Chat Interface with Real-time

#### Updated ChatSection Component

```typescript
// components/sections/chat-section.tsx
import { useEffect, useState, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { RealtimeChannel } from "@supabase/supabase-js";
import { sessionService } from "@/services/sessionService";
import { activityService } from "@/services/activityService";
import { authService } from "@/services/authService";
import {
  ChatSession,
  ChatMessage,
  UserActivity,
  User,
  ChatSessionWithMessages,
} from "@/types/supabase";

interface ChatSectionProps {
  token?: string | null;
  poolId?: string | null;
  action?: string | null;
}

export function ChatSection({ token, poolId, action }: ChatSectionProps) {
  const { authenticated, user: privyUser } = usePrivy();
  const { wallets } = useWallets();

  // User and session state
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Real-time subscriptions
  const [sessionSubscription, setSessionSubscription] =
    useState<RealtimeChannel | null>(null);
  const [messageSubscription, setMessageSubscription] =
    useState<RealtimeChannel | null>(null);
  const [activitySubscription, setActivitySubscription] =
    useState<RealtimeChannel | null>(null);

  // Authentication and user setup
  useEffect(() => {
    if (authenticated && wallets[0]) {
      handleWalletConnection();
    } else {
      cleanup();
    }
  }, [authenticated, wallets]);

  const handleWalletConnection = async () => {
    try {
      const walletAddress = wallets[0].address;
      const authenticatedUser = await authService.signInWithWallet(
        walletAddress,
        "signature"
      );

      if (authenticatedUser) {
        setUser(authenticatedUser);
        await loadUserData(authenticatedUser.id);
        setupRealtimeSubscriptions(authenticatedUser.id);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      setIsLoadingSession(true);

      // Load sessions and activities
      const [sessionsData, activitiesData] = await Promise.all([
        sessionService.getUserSessions(userId),
        activityService.getUserActivities(userId),
      ]);

      setSessions(sessionsData);
      setUserActivities(activitiesData);

      // Handle URL context or load recent session
      if (token || poolId || action) {
        await createOrLoadContextSession(userId);
      } else if (sessionsData.length > 0) {
        await loadSession(sessionsData[0].id);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const setupRealtimeSubscriptions = (userId: string) => {
    // Subscribe to session updates
    const sessionSub = sessionService.subscribeToSessions(userId, setSessions);
    setSessionSubscription(sessionSub);

    // Subscribe to activity updates
    const activitySub = activityService.subscribeToActivities(
      userId,
      (activity) => {
        setUserActivities((prev) => {
          const index = prev.findIndex((a) => a.id === activity.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = activity;
            return updated;
          }
          return [activity, ...prev];
        });
      }
    );
    setActivitySubscription(activitySub);
  };

  const createOrLoadContextSession = async (userId: string) => {
    try {
      // Check for existing session with this context
      const existingSession = sessions.find((session) => {
        const context = session.metadata?.initialContext;
        return (
          context?.token === token &&
          context?.poolId === poolId &&
          context?.action === action
        );
      });

      if (existingSession) {
        await loadSession(existingSession.id);
      } else {
        // Create new session
        const newSession = await sessionService.createSession(userId, {
          token,
          poolId,
          action,
        });

        setCurrentSession(newSession);
        setSessions((prev) => [newSession, ...prev]);

        // Generate initial context message
        const contextMessage = generateAssetDetailsMessage(
          token!,
          poolId!,
          action!
        );
        await sessionService.addMessage({
          session_id: newSession.id,
          role: "ai",
          content: contextMessage,
          metadata: { containsTransaction: false },
        });
      }
    } catch (error) {
      console.error("Failed to create/load context session:", error);
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      // Cleanup previous message subscription
      if (messageSubscription) {
        messageSubscription.unsubscribe();
      }

      const sessionData = await sessionService.getSessionWithMessages(
        sessionId
      );

      if (sessionData) {
        setCurrentSession(sessionData);
        setMessages(sessionData.messages || []);
        setShowWelcome(sessionData.messages?.length === 0);

        // Subscribe to new messages in this session
        const messageSub = sessionService.subscribeToMessages(
          sessionId,
          (message) => {
            setMessages((prev) => [...prev, message]);
          }
        );
        setMessageSubscription(messageSub);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentSession || !user) return;

    const userMessage = input.trim();
    setInput("");
    setShowWelcome(false);

    try {
      // Add user message
      await sessionService.addMessage({
        session_id: currentSession.id,
        role: "user",
        content: userMessage,
        metadata: { userAgent: navigator.userAgent },
      });

      // Generate AI response
      await simulateAIResponse(userMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const simulateAIResponse = async (userMessage: string) => {
    if (!currentSession) return;

    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    try {
      // Generate context-aware response
      const aiResponse = generateContextAwareResponse(
        userMessage,
        userActivities,
        currentSession
      );

      // Add AI response
      await sessionService.addMessage({
        session_id: currentSession.id,
        role: "ai",
        content: aiResponse,
        metadata: {
          responseTime: Date.now(),
          containsTransaction:
            aiResponse.includes("transaction") ||
            aiResponse.includes("borrow") ||
            aiResponse.includes("lend"),
        },
      });
    } catch (error) {
      console.error("Failed to generate AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Cleanup subscriptions
  const cleanup = () => {
    sessionSubscription?.unsubscribe();
    messageSubscription?.unsubscribe();
    activitySubscription?.unsubscribe();
    setUser(null);
    setSessions([]);
    setMessages([]);
    setCurrentSession(null);
  };

  useEffect(() => {
    return cleanup;
  }, []);

  // Rest of component implementation...
  return (
    <div className="flex h-full">
      {/* Session Sidebar */}
      {user && (
        <SessionSidebar
          sessions={sessions}
          currentSession={currentSession}
          onSessionSelect={loadSession}
          onNewSession={() => createNewSession(user.id)}
          userActivities={userActivities}
        />
      )}

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {showWelcome ? (
            <WelcomeMessage token={token} action={action} />
          ) : (
            <MessageList
              messages={messages}
              isTyping={isTyping}
              activities={userActivities}
            />
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          disabled={!currentSession || isTyping}
        />
      </div>
    </div>
  );
}

// Helper functions...
const generateAssetDetailsMessage = (
  token: string,
  poolId: string,
  action: string
): string => {
  return `I see you're interested in ${action}ing ${token} in Pool ${poolId}. Let me help you with that!
  
Here are the current details for this pool:
• Token: ${token}
• Pool ID: ${poolId}
• Action: ${action.toUpperCase()}

What would you like to know more about?`;
};

const generateContextAwareResponse = (
  userMessage: string,
  activities: UserActivity[],
  session: ChatSession
): string => {
  // Enhanced AI response logic with activity context
  // Implementation details...
  return "Context-aware response based on user activities and session history.";
};
```

### 🎨 Phase 3: Enhanced UI Components with Real-time

#### Session Sidebar Component

```typescript
// components/chat/session-sidebar.tsx
import { useState, useEffect } from "react";
import { Plus, MessageSquare, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activityService } from "@/services/activityService";
import { ChatSession, UserActivity } from "@/types/supabase";

interface SessionSidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  userActivities: UserActivity[];
}

export function SessionSidebar({
  sessions,
  currentSession,
  onSessionSelect,
  onNewSession,
  userActivities,
}: SessionSidebarProps) {
  const [activitySummary, setActivitySummary] = useState({
    totalBorrowed: 0,
    totalLent: 0,
    pendingTransactions: 0,
    activePositions: 0,
  });

  useEffect(() => {
    // Calculate activity summary
    const summary = {
      totalBorrowed: 0,
      totalLent: 0,
      pendingTransactions: 0,
      activePositions: 0,
    };

    userActivities.forEach((activity) => {
      if (activity.status === "confirmed") {
        const amount = parseFloat(activity.amount || "0");
        if (activity.activity_type === "borrow") {
          summary.totalBorrowed += amount;
        } else if (activity.activity_type === "lend") {
          summary.totalLent += amount;
        }
        summary.activePositions += 1;
      } else if (activity.status === "pending") {
        summary.pendingTransactions += 1;
      }
    });

    setActivitySummary(summary);
  }, [userActivities]);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* New Chat Button */}
      <div className="p-4 border-b border-slate-800">
        <Button
          onClick={onNewSession}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h3 className="text-xs font-medium text-slate-400 mb-2">
            Recent Chats
          </h3>
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={currentSession?.id === session.id}
              onClick={() => onSessionSelect(session.id)}
            />
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="p-4 border-t border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-300">
              Your Activity
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-xs text-slate-400">Borrowed</div>
              <div className="text-sm font-medium text-red-400">
                ${activitySummary.totalBorrowed.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-xs text-slate-400">Lent</div>
              <div className="text-sm font-medium text-green-400">
                ${activitySummary.totalLent.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              {activitySummary.activePositions} active positions
            </span>
            {activitySummary.pendingTransactions > 0 && (
              <span className="text-yellow-400">
                {activitySummary.pendingTransactions} pending
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
}

function SessionItem({ session, isActive, onClick }: SessionItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded cursor-pointer mb-1 transition-colors
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {session.session_name || "Untitled Chat"}
          </div>
          <div className="text-xs opacity-70">
            {new Date(session.last_message_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Enhanced AI Capabilities with Supabase

### 🧠 Activity-Aware Responses

```typescript
// utils/activityAwareResponses.ts
import { UserActivity, ChatSession } from "@/types/supabase";

export function generateActivitySummary(activities: UserActivity[]): string {
  const borrowed = activities.filter(
    (a) => a.activity_type === "borrow" && a.status === "confirmed"
  );
  const lent = activities.filter(
    (a) => a.activity_type === "lend" && a.status === "confirmed"
  );
  const pending = activities.filter((a) => a.status === "pending");

  let summary = "📊 **Your Activity Summary**\n\n";

  if (borrowed.length > 0) {
    summary += "🔴 **Active Borrowings:**\n";
    borrowed.forEach((b) => {
      summary += `• ${b.amount} ${b.token_symbol} from Pool ${b.pool_id}\n`;
    });
    summary += "\n";
  }

  if (lent.length > 0) {
    summary += "🟢 **Active Lendings:**\n";
    lent.forEach((l) => {
      summary += `• ${l.amount} ${l.token_symbol} in Pool ${l.pool_id}\n`;
    });
    summary += "\n";
  }

  if (pending.length > 0) {
    summary += "⏳ **Pending Transactions:**\n";
    pending.forEach((p) => {
      summary += `• ${p.activity_type.toUpperCase()} ${p.amount} ${
        p.token_symbol
      }\n`;
    });
    summary += "\n";
  }

  if (activities.length === 0) {
    summary +=
      "You haven't made any transactions yet. Ready to get started?\n\n";
  }

  summary += "Would you like to:\n";
  summary += "• View detailed position analysis\n";
  summary += "• Start a new transaction\n";
  summary += "• Check current market rates\n";
  summary += "• Manage existing positions";

  return summary;
}

export function generateExistingPositionResponse(
  position: UserActivity,
  action: string
): string {
  const actionText = action === "borrow" ? "borrowing" : "lending";
  const opposite = action === "borrow" ? "lending" : "borrowing";

  return `I see you already have an active ${actionText} position with ${
    position.token_symbol
  }!

📋 **Existing Position:**
• Amount: ${position.amount} ${position.token_symbol}
• Pool: ${position.pool_id}
• Status: ${position.status}
• Started: ${new Date(position.created_at).toLocaleDateString()}

💡 **Options for Additional ${
    actionText.charAt(0).toUpperCase() + actionText.slice(1)
  }:**
• Increase your current position
• Start ${actionText} in a different pool
• Consider ${opposite} to balance your portfolio
• Check current rates and opportunities

Would you like me to:
• Show you the best rates for additional ${actionText}
• Analyze your current position performance
• Suggest portfolio optimization strategies
• Help you manage your existing position`;
}

// Real-time context generation
export function generateContextAwareResponse(
  userMessage: string,
  activities: UserActivity[],
  session: ChatSession
): string {
  const userLower = userMessage.toLowerCase();
  const hasAssetContext = session.metadata?.initialContext;

  // Activity-aware responses
  if (
    userLower.includes("my position") ||
    userLower.includes("my activities")
  ) {
    return generateActivitySummary(activities);
  }

  if (userLower.includes("history") || userLower.includes("previous")) {
    return generateUserHistory(activities);
  }

  // Check for asset-specific queries with user's existing positions
  if (hasAssetContext) {
    const { token, action } = hasAssetContext;
    const existingPosition = activities.find(
      (a) =>
        a.token_symbol.toLowerCase() === token?.toLowerCase() &&
        a.activity_type === action &&
        a.status === "confirmed"
    );

    if (
      existingPosition &&
      (userLower.includes("more") || userLower.includes("additional"))
    ) {
      return generateExistingPositionResponse(existingPosition, action!);
    }
  }

  // Fallback to standard response with activity context
  return generateStandardResponse(userMessage, { activities, session });
}

function generateUserHistory(activities: UserActivity[]): string {
  if (activities.length === 0) {
    return "You don't have any transaction history yet. Would you like to start with your first transaction?";
  }

  const recentActivities = activities.slice(0, 10);
  let history = "📜 **Your Recent Transaction History**\n\n";

  recentActivities.forEach((activity, index) => {
    const emoji =
      activity.activity_type === "borrow"
        ? "🔴"
        : activity.activity_type === "lend"
        ? "🟢"
        : "🔄";
    const statusEmoji =
      activity.status === "confirmed"
        ? "✅"
        : activity.status === "pending"
        ? "⏳"
        : "❌";

    history += `${emoji} ${statusEmoji} ${activity.activity_type.toUpperCase()} ${
      activity.amount
    } ${activity.token_symbol}\n`;
    history += `   Pool: ${activity.pool_id} • ${new Date(
      activity.created_at
    ).toLocaleDateString()}\n\n`;
  });

  history += "Would you like to:\n";
  history += "• View detailed analytics\n";
  history += "• Export your transaction history\n";
  history += "• Start a new transaction";

  return history;
}

function generateStandardResponse(
  userMessage: string,
  context: { activities: UserActivity[]; session: ChatSession }
): string {
  // Enhanced standard responses with activity context
  const { activities, session } = context;
  const hasActivities = activities.length > 0;

  if (userMessage.toLowerCase().includes("help")) {
    if (hasActivities) {
      return "I can help you with your DeFi activities! Based on your history, I can assist with managing your existing positions or starting new ones. What would you like to do?";
    } else {
      return "Welcome to StratiFi! I can help you with lending and borrowing activities. Would you like to start with exploring available pools?";
    }
  }

  // Default response
  return "I understand you'd like to know more. Could you please be more specific about what you're looking for? I can help with lending, borrowing, market analysis, and managing your positions.";
}
```

## Implementation Timeline

### 🗓️ Development Phases

#### Phase 1: Supabase Setup & Schema (Week 1)

- [ ] Supabase project creation and configuration
- [ ] Database schema setup with RLS policies
- [ ] Environment variables configuration
- [ ] Supabase client setup with authentication
- [ ] Generate TypeScript types from schema

#### Phase 2: Core Services Implementation (Week 2)

- [ ] Authentication service with wallet integration
- [ ] Session service with real-time subscriptions
- [ ] Activity service with real-time updates
- [ ] Basic error handling and logging

#### Phase 3: Frontend Integration (Week 3)

- [ ] Updated ChatSection component with Supabase
- [ ] Real-time message synchronization
- [ ] Session management UI components
- [ ] Activity-aware chat interface

#### Phase 4: Enhanced Features (Week 4)

- [ ] Session sidebar with real-time updates
- [ ] Advanced activity analytics
- [ ] Performance optimizations
- [ ] Real-time notifications and alerts

#### Phase 5: Testing & Deployment (Week 5)

- [ ] Unit tests for services
- [ ] Integration tests with Supabase
- [ ] Performance testing and optimization
- [ ] Production deployment and monitoring

## Security Considerations

### 🔒 Privacy & Security with Supabase

1. **Row-Level Security (RLS)**

   - Automatic data isolation per user
   - Users can only access their own sessions and activities
   - Database-level security enforcement
   - SQL policies prevent data leakage

2. **Authentication & Authorization**

   - Wallet-based authentication with Supabase Auth
   - JWT tokens for secure API access
   - Automatic session management
   - Multi-factor authentication support

3. **Data Protection**

   - End-to-end encryption with Supabase encryption
   - HTTPS-only communications
   - Sensitive data encrypted at column level
   - GDPR-compliant data handling

4. **Real-time Security**

   - Secure WebSocket connections
   - Real-time data filtered by RLS policies
   - Automatic connection authentication
   - Rate limiting on subscriptions

5. **Audit & Monitoring**
   - Built-in Supabase audit logs
   - Real-time monitoring dashboard
   - Automated security alerts
   - Performance metrics tracking

## Performance Optimizations

### ⚡ Efficiency Measures with Supabase

1. **Database Performance**

   - Optimized PostgreSQL with proper indexing
   - Query optimization with Supabase Query Planner
   - Connection pooling built-in
   - Automatic vacuum and maintenance

2. **Real-time Optimizations**

   - Efficient WebSocket connections
   - Selective real-time subscriptions
   - Message batching for high-frequency updates
   - Automatic reconnection handling

3. **Frontend Performance**

   - Optimistic UI updates
   - Background sync with Supabase
   - Lazy loading with infinite scroll
   - Cached queries with React Query

4. **Supabase-Specific Features**
   - Edge functions for computation
   - Built-in CDN for static assets
   - Geographic data replication
   - Automatic scaling and load balancing

## Monitoring & Analytics

### 📈 Metrics to Track with Supabase

1. **User Engagement**

   - Active sessions per user via Supabase Analytics
   - Message frequency and real-time activity
   - Feature adoption through event tracking
   - Session duration and return rates

2. **System Performance**

   - Real-time connection metrics
   - Database query performance dashboard
   - Error rates with detailed logs
   - WebSocket connection stability

3. **Business Metrics**
   - Transaction completion rates
   - User retention analytics
   - Most common user flows
   - Revenue attribution per session

### 🛠️ Setup Instructions

#### 1. Supabase Project Setup

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize Supabase project
supabase init stratifi-app
cd stratifi-app

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply database migrations
supabase db push
```

#### 2. Environment Configuration

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 3. Generate TypeScript Types

```bash
# Generate types from Supabase schema
npx supabase gen types typescript --project-id your-project-id > types/database.types.ts
```

#### 4. Install Dependencies

```bash
# Install Supabase packages
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Install additional packages for real-time features
npm install @tanstack/react-query
```

#### 5. Deployment Considerations

- **Environment Variables**: Set up production environment variables
- **Database Migrations**: Use Supabase migrations for schema changes
- **Monitoring**: Enable Supabase monitoring and alerts
- **Backups**: Configure automatic database backups
- **Security**: Review and test RLS policies before production

---

_This design provides a comprehensive foundation for implementing session tracking and user activity persistence using Supabase, with real-time capabilities, enhanced security through RLS, and simplified backend management._
