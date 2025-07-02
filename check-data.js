// Quick check to see if data was stored
// Run with: node check-data.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  console.log("🔍 Checking if your wallet data was stored...\n");

  try {
    // Check users
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    console.log(`👥 Users found: ${users?.length || 0}`);
    if (users?.length > 0) {
      users.forEach((user, i) => {
        console.log(
          `  ${i + 1}. ${user.wallet_address} (${new Date(
            user.created_at
          ).toLocaleString()})`
        );
      });
    }

    // Check sessions
    const { data: sessions } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    console.log(`\n💬 Sessions found: ${sessions?.length || 0}`);
    if (sessions?.length > 0) {
      sessions.forEach((session, i) => {
        console.log(
          `  ${i + 1}. ${session.session_name || "Untitled"} (${new Date(
            session.created_at
          ).toLocaleString()})`
        );
      });
    }

    // Check messages
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    console.log(`\n📝 Recent messages: ${messages?.length || 0}`);
    if (messages?.length > 0) {
      messages.forEach((msg, i) => {
        console.log(
          `  ${i + 1}. ${msg.role}: ${msg.content.substring(0, 50)}...`
        );
      });
    }

    if (users?.length === 0) {
      console.log("\n❌ No data found. Make sure you:");
      console.log("1. Ran the SQL fix in Supabase dashboard");
      console.log("2. Connected your wallet in the app");
      console.log("3. Started a chat conversation");
    } else {
      console.log(
        "\n✅ Great! Your wallet connection is storing data properly!"
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkData();
