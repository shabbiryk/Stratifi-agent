// Test database connection after recreating tables
// Run with: node test-database.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

async function testDatabase() {
  console.log("🧪 Testing database after table recreation...\n");

  try {
    // Test 1: Create a test user
    console.log("1. Testing user creation...");
    const testWallet = "0x1234567890123456789012345678901234567890";

    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        wallet_address: testWallet,
      })
      .select()
      .single();

    if (userError) {
      console.error("❌ User creation failed:", userError.message);
      return;
    }

    console.log("✅ User created:", newUser.id);

    // Test 2: Create a test session
    console.log("\n2. Testing session creation...");
    const { data: newSession, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: newUser.id,
        session_name: "Test Session",
        metadata: { test: true },
      })
      .select()
      .single();

    if (sessionError) {
      console.error("❌ Session creation failed:", sessionError.message);
      return;
    }

    console.log("✅ Session created:", newSession.id);

    // Test 3: Create a test message
    console.log("\n3. Testing message creation...");
    const { data: newMessage, error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: newSession.id,
        role: "user",
        content: "Hello, this is a test message!",
      })
      .select()
      .single();

    if (messageError) {
      console.error("❌ Message creation failed:", messageError.message);
      return;
    }

    console.log("✅ Message created:", newMessage.id);

    // Test 4: Query all data
    console.log("\n4. Testing data retrieval...");

    const { data: users } = await supabase.from("users").select("*");
    const { data: sessions } = await supabase.from("chat_sessions").select("*");
    const { data: messages } = await supabase.from("chat_messages").select("*");

    console.log(
      `✅ Found ${users?.length} users, ${sessions?.length} sessions, ${messages?.length} messages`
    );

    // Cleanup test data
    console.log("\n5. Cleaning up test data...");
    await supabase.from("users").delete().eq("id", newUser.id);
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests passed! Your database is working correctly!");
    console.log("🚀 You can now connect your wallet and start chatting!");
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

testDatabase();
