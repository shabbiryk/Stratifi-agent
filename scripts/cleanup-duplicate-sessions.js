const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);

async function cleanupDuplicateSessions() {
  try {
    console.log("🧹 Starting cleanup of duplicate sessions...");

    // Get all sessions grouped by user_id and created_at (within 1 minute)
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching sessions:", error);
      return;
    }

    console.log(`📊 Found ${sessions.length} total active sessions`);

    // Group sessions by user and find duplicates created within 5 minutes
    const userSessions = {};
    const duplicatesToDelete = [];

    sessions.forEach((session) => {
      const userId = session.user_id;
      const createdAt = new Date(session.created_at);

      if (!userSessions[userId]) {
        userSessions[userId] = [];
      }

      userSessions[userId].push({
        ...session,
        createdAtDate: createdAt,
      });
    });

    // Find duplicates for each user
    Object.keys(userSessions).forEach((userId) => {
      const userSessionList = userSessions[userId].sort(
        (a, b) => b.createdAtDate - a.createdAtDate
      );

      console.log(`👤 User ${userId}: ${userSessionList.length} sessions`);

      // Keep the most recent session, mark others as duplicates if created within 5 minutes
      for (let i = 1; i < userSessionList.length; i++) {
        const currentSession = userSessionList[i];
        const previousSession = userSessionList[i - 1];

        const timeDiff =
          previousSession.createdAtDate - currentSession.createdAtDate;
        const minutesDiff = timeDiff / (1000 * 60);

        // If sessions were created within 5 minutes of each other, consider as duplicate
        if (minutesDiff <= 5) {
          duplicatesToDelete.push(currentSession.id);
          console.log(
            `🗑️  Marking duplicate session ${
              currentSession.id
            } for deletion (created ${minutesDiff.toFixed(
              1
            )} minutes after previous)`
          );
        }
      }
    });

    if (duplicatesToDelete.length === 0) {
      console.log("✅ No duplicate sessions found!");
      return;
    }

    console.log(
      `🔍 Found ${duplicatesToDelete.length} duplicate sessions to clean up`
    );

    // Ask for confirmation in production
    if (process.env.NODE_ENV === "production") {
      console.log(
        "⚠️  Production environment detected. Please run this manually after verification."
      );
      console.log("Sessions to delete:", duplicatesToDelete);
      return;
    }

    // Delete duplicate sessions
    const { error: deleteError } = await supabase
      .from("chat_sessions")
      .update({ is_active: false })
      .in("id", duplicatesToDelete);

    if (deleteError) {
      console.error("❌ Error deactivating duplicate sessions:", deleteError);
      return;
    }

    // Also delete associated messages
    const { error: messagesError } = await supabase
      .from("chat_messages")
      .delete()
      .in("session_id", duplicatesToDelete);

    if (messagesError) {
      console.error("❌ Error deleting associated messages:", messagesError);
      return;
    }

    console.log(
      `✅ Successfully cleaned up ${duplicatesToDelete.length} duplicate sessions and their messages`
    );

    // Show final stats
    const { data: finalSessions } = await supabase
      .from("chat_sessions")
      .select("user_id")
      .eq("is_active", true);

    const uniqueUsers = new Set(finalSessions.map((s) => s.user_id)).size;
    console.log(
      `📈 Final stats: ${finalSessions.length} active sessions for ${uniqueUsers} users`
    );
  } catch (error) {
    console.error("❌ Cleanup script error:", error);
  }
}

// Run the cleanup
cleanupDuplicateSessions();
