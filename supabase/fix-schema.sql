-- Fix schema for wallet-based authentication
-- Run this in your Supabase SQL Editor

-- 1. Disable RLS first
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities DISABLE ROW LEVEL SECURITY;

-- 2. Drop the foreign key constraint on auth_user_id
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_auth_user_id_fkey;

-- 3. Make auth_user_id nullable (allow NULL values)
ALTER TABLE users ALTER COLUMN auth_user_id DROP NOT NULL;

-- 4. Update the policies to reference wallet_address instead of auth_user_id
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can manage own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can access own session messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can manage own activities" ON user_activities;

-- Note: We'll keep RLS disabled for now while testing
-- You can re-enable it later with wallet-based policies if needed 