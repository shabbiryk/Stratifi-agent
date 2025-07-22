-- =====================================================
-- Add Agent-Specific Tables to Existing Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- AGENT WALLETS TABLE
-- Stores agent wallets created for users
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_wallets (
  agent_id VARCHAR(32) PRIMARY KEY,
  wallet_private_key TEXT NOT NULL,
  wallet_public_key VARCHAR(42) NOT NULL,
  user_wallet_address VARCHAR(42) NOT NULL,
  chain_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Foreign key to users table
  FOREIGN KEY (user_wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create indexes for agent_wallets table
CREATE INDEX IF NOT EXISTS idx_agent_wallets_user_address ON agent_wallets(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_agent_wallets_chain_id ON agent_wallets(chain_id);
CREATE INDEX IF NOT EXISTS idx_agent_wallets_active ON agent_wallets(is_active);

-- Create trigger for updated_at on agent_wallets
CREATE TRIGGER update_agent_wallets_updated_at BEFORE UPDATE
ON agent_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- AGENT SCRATCHPAD TABLE
-- Stores session-specific agent context and memory
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_scratchpad (
  session_id UUID PRIMARY KEY,
  agent_scratchpad TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key to chat_sessions table
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Create trigger for updated_at on agent_scratchpad
CREATE TRIGGER update_agent_scratchpad_updated_at BEFORE UPDATE
ON agent_scratchpad FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- USER PROFILES TABLE
-- Stores user preferences and risk profiles
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  user_wallet_address VARCHAR(42) PRIMARY KEY,
  risk_profile VARCHAR(20) DEFAULT 'moderate' CHECK (
    risk_profile IN ('conservative', 'moderate', 'aggressive')
  ),
  investment_goals TEXT DEFAULT '',
  preferred_chains INTEGER[] DEFAULT ARRAY[8453, 42161], -- Base, Arbitrum by default
  max_investment_amount DECIMAL(36, 18) DEFAULT 0,
  auto_compound BOOLEAN DEFAULT true,
  other_user_info TEXT DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key to users table
  FOREIGN KEY (user_wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create indexes for user_profiles table
CREATE INDEX IF NOT EXISTS idx_user_profiles_risk ON user_profiles(risk_profile);
CREATE INDEX IF NOT EXISTS idx_user_profiles_chains ON user_profiles USING GIN(preferred_chains);

-- Create trigger for updated_at on user_profiles
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE
ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE REALTIME for new tables
-- =====================================================
ALTER publication supabase_realtime ADD TABLE agent_wallets;
ALTER publication supabase_realtime ADD TABLE agent_scratchpad;
ALTER publication supabase_realtime ADD TABLE user_profiles;

-- =====================================================
-- RLS Policies (if RLS is enabled)
-- =====================================================
-- Note: Adjust these if you have RLS enabled in your setup

-- Agent wallets - users can only see their own agents
-- CREATE POLICY "Users can manage own agent wallets" ON agent_wallets
--   FOR ALL USING (
--     user_wallet_address IN (
--       SELECT wallet_address FROM users WHERE auth_user_id = auth.uid()
--     )
--   );

-- Agent scratchpad - users can only access scratchpad for their sessions
-- CREATE POLICY "Users can manage own agent scratchpad" ON agent_scratchpad
--   FOR ALL USING (
--     session_id IN (
--       SELECT s.id FROM chat_sessions s
--       JOIN users u ON s.user_id = u.id
--       WHERE u.auth_user_id = auth.uid()
--     )
--   );

-- User profiles - users can only manage their own profiles
-- CREATE POLICY "Users can manage own profiles" ON user_profiles
--   FOR ALL USING (
--     user_wallet_address IN (
--       SELECT wallet_address FROM users WHERE auth_user_id = auth.uid()
--     )
--   );

-- If RLS is disabled (as in your current setup), these policies are not needed

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Agent-specific tables added successfully!' as message,
       'Tables created: agent_wallets, agent_scratchpad, user_profiles' as details; 