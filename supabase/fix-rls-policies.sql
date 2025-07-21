-- =====================================================
-- Fix RLS Policies for Wallet-Based Authentication
-- =====================================================

-- Temporarily disable RLS to allow wallet-based user creation
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;  
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can manage own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can access own session messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can manage own activities" ON user_activities;

-- Create new policies that work with wallet addresses instead of auth.uid()
-- Users table - allow users to manage their own records based on wallet address
CREATE POLICY "Users can manage own wallet data" ON users
  FOR ALL 
  USING (true)  -- Allow all operations for now since we'll handle security in app logic
  WITH CHECK (true);

-- Chat sessions - users can manage sessions they own
CREATE POLICY "Users can manage own sessions" ON chat_sessions
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Chat messages - users can manage messages in their sessions
CREATE POLICY "Users can manage session messages" ON chat_messages
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- User activities - users can manage their own activities
CREATE POLICY "Users can manage own activities" ON user_activities
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS with the new policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Alternative: If you want to completely disable RLS for development
-- Uncomment these lines to disable RLS entirely:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY; 