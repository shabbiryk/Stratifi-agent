// Basic Supabase types for session management
export interface User {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  preferences?: UserPreferences;
  auth_user_id?: string;
}

export interface UserPreferences {
  theme?: "dark" | "light";
  notifications?: boolean;
  defaultSlippage?: number;
  preferredChain?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  session_name?: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  is_active: boolean;
  metadata?: SessionMetadata;
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

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  responseTime?: number;
  containsTransaction?: boolean;
  relatedActivity?: string;
  userAgent?: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  session_id?: string;
  activity_type: "borrow" | "lend" | "repay" | "withdraw" | "liquidation";
  token_symbol: string;
  pool_id: string;
  amount?: string;
  transaction_hash?: string;
  status: "pending" | "confirmed" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
  metadata?: ActivityMetadata;
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
