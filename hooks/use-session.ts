import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, ChatSession, ChatMessage } from "@/types/session";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Sign in with wallet
  const signInWithWallet = useCallback(async (walletAddress: string) => {
    try {
      console.log("🔍 Checking for existing user with wallet:", walletAddress);

      // Check if user exists - use maybeSingle() to avoid throwing error
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ Error fetching user:", fetchError);
        throw fetchError;
      }

      if (existingUser) {
        console.log("✅ Found existing user:", existingUser.id);
        // Update last_active timestamp
        const { data: updatedUser } = await supabase
          .from("users")
          .update({ last_active: new Date().toISOString() })
          .eq("id", existingUser.id)
          .select()
          .single();

        const userToSet = updatedUser || existingUser;
        setUser(userToSet);
        return userToSet;
      }

      // Create new user if doesn't exist
      console.log("➕ Creating new user for wallet:", walletAddress);
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          wallet_address: walletAddress,
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Error creating user:", createError);
        throw createError;
      }

      console.log("✅ Created new user:", newUser.id);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("❌ Sign in error:", error);
      return null;
    }
  }, []);

  // Load user sessions
  const loadSessions = useCallback(async (userId: string) => {
    try {
      console.log("📂 Loading sessions for user:", userId);
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("last_message_at", { ascending: false });

      if (error) {
        console.error("❌ Error loading sessions:", error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} sessions`);
      setSessions(data || []);
    } catch (error) {
      console.error("❌ Load sessions error:", error);
    }
  }, []);

  // Create new session
  const createSession = useCallback(async (userId: string, context?: any) => {
    try {
      console.log(
        "➕ Creating new session for user:",
        userId,
        "with context:",
        context
      );
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: userId,
          metadata: context ? { initialContext: context } : {},
          session_name: context?.token
            ? `${context.action?.toUpperCase()} ${context.token}`
            : `Chat ${new Date().toLocaleDateString()}`,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating session:", error);
        throw error;
      }

      console.log("✅ Created session:", data.id);
      setCurrentSession(data);
      setSessions((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("❌ Create session error:", error);
      return null;
    }
  }, []);

  // Load session messages
  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Load messages error:", error);
    }
  }, []);

  // Add message to current session or specified session
  const addMessage = useCallback(
    async (
      content: string,
      role: "user" | "ai",
      sessionToUse?: ChatSession
    ) => {
      const targetSession = sessionToUse || currentSession;

      if (!targetSession) {
        console.error("❌ No current session to add message to");
        return null;
      }

      try {
        console.log(`💬 Adding ${role} message to session:`, targetSession.id);
        const { data, error } = await supabase
          .from("chat_messages")
          .insert({
            session_id: targetSession.id,
            role,
            content,
            metadata: { userAgent: navigator.userAgent },
          })
          .select()
          .single();

        if (error) {
          console.error("❌ Error adding message:", error);
          throw error;
        }

        // Update session's last_message_at
        await supabase
          .from("chat_sessions")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", targetSession.id);

        console.log("✅ Message added:", data.id);
        setMessages((prev) => [...prev, data]);
        return data;
      } catch (error) {
        console.error("❌ Add message error:", error);
        return null;
      }
    },
    [currentSession]
  );

  // Clear messages (useful for new sessions)
  const clearMessages = useCallback(() => {
    console.log("🧹 Clearing messages");
    setMessages([]);
  }, []);

  // Sign out
  const signOut = useCallback(() => {
    console.log("👋 Signing out user");
    setUser(null);
    setSessions([]);
    setCurrentSession(null);
    setMessages([]);
    setLoading(false);
  }, []);

  // Set loading to false on component mount
  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    user,
    sessions,
    currentSession,
    messages,
    loading,
    signInWithWallet,
    loadSessions,
    createSession,
    loadMessages,
    addMessage,
    clearMessages,
    signOut,
    setCurrentSession,
  };
}
