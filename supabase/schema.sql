-- =====================================================
-- StratiFi App - Supabase Database Schema
-- Session Tracking & User Activity Tables
-- =====================================================

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only see their own data
CREATE POLICY "Users can view own data" ON users
FOR ALL USING (auth.uid() = auth_user_id);

-- Create indexes for users table
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_auth_id ON users(auth_user_id);

-- Create trigger for updated_at on users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CHAT SESSIONS TABLE
-- =====================================================
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

-- Enable RLS on chat_sessions table
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only access their own sessions
CREATE POLICY "Users can manage own sessions" ON chat_sessions
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Create indexes for chat_sessions table
CREATE INDEX idx_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_sessions_last_message ON chat_sessions(last_message_at DESC);
CREATE INDEX idx_sessions_active ON chat_sessions(is_active, last_message_at DESC);

-- Create trigger for updated_at on chat_sessions
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE
ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on chat_messages table
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

-- Create indexes for chat_messages table
CREATE INDEX idx_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_messages_role ON chat_messages(role);

-- =====================================================
-- USER ACTIVITIES TABLE
-- =====================================================
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

-- Enable RLS on user_activities table
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only access their own activities
CREATE POLICY "Users can manage own activities" ON user_activities
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Create indexes for user_activities table
CREATE INDEX idx_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_activities_status ON user_activities(status);
CREATE INDEX idx_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_activities_type ON user_activities(activity_type);

-- Create trigger for updated_at on user_activities
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE
ON user_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE REALTIME (for live updates)
-- =====================================================
ALTER publication supabase_realtime ADD TABLE chat_sessions;
ALTER publication supabase_realtime ADD TABLE chat_messages;
ALTER publication supabase_realtime ADD TABLE user_activities;

-- =====================================================
-- SETUP COMPLETE
-- Your database is ready for session tracking!
-- ===================================================== 