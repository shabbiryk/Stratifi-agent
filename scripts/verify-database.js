const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyDatabase() {
  console.log("🔍 Verifying Supabase database setup...\n");

  const tables = ["users", "chat_sessions", "chat_messages", "user_activities"];

  try {
    for (const table of tables) {
      console.log(`Checking table: ${table}`);

      const { data, error } = await supabase
        .from(table)
        .select("*", { count: "exact" })
        .limit(1);

      if (error) {
        console.log(`❌ Table '${table}' - ERROR: ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' - EXISTS and accessible`);
      }
    }

    console.log("\n🎯 Database verification complete!");
    console.log("\nIf all tables show ✅, your database is ready!");
    console.log(
      "If any show ❌, please run the schema.sql in your Supabase dashboard."
    );
  } catch (error) {
    console.error("❌ Database verification failed:", error.message);
  }
}

verifyDatabase();
