-- Recreate tables for wallet-based authentication
-- Run this in your Supabase SQL Editor

-- First, DROP existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- USERS TABLE (Simplified)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'
);

-- Create indexes for users table
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

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

-- Create indexes for user_activities table
CREATE INDEX idx_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_activities_status ON user_activities(status);
CREATE INDEX idx_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_activities_type ON user_activities(activity_type);

-- Create trigger for updated_at on user_activities
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE
ON user_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DISABLE RLS (for wallet-based auth)
-- =====================================================
-- Note: Tables are created without RLS by default
-- These commands ensure RLS is disabled if it was enabled elsewhere
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- ENABLE REALTIME (for live updates)
-- =====================================================
ALTER publication supabase_realtime ADD TABLE chat_sessions;
ALTER publication supabase_realtime ADD TABLE chat_messages;
ALTER publication supabase_realtime ADD TABLE user_activities;

-- =====================================================
-- TABLES RECREATED SUCCESSFULLY!
-- =====================================================
-- The following tables have been created:
-- 1. users - stores wallet addresses and user preferences
-- 2. chat_sessions - stores chat conversation sessions
-- 3. chat_messages - stores individual messages in sessions
-- 4. user_activities - stores DeFi transaction activities
--
-- All tables have RLS DISABLED for wallet-based authentication
-- Realtime is ENABLED for live updates
-- ===================================================== 