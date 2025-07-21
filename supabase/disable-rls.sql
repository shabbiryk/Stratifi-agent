-- =====================================================
-- Disable RLS for Development (Wallet-Based Auth)
-- =====================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can manage own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can access own session messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can manage own activities" ON user_activities;

-- Disable Row Level Security for all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'RLS disabled successfully for wallet-based authentication!' as message; 