import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateAgentRequest {
  userWalletAddress: string;
  chain_id: number;
}

interface CreateAgentResponse {
  success: boolean;
  agent_id?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userWalletAddress, chain_id }: CreateAgentRequest =
      await request.json();

    if (!userWalletAddress || !chain_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: userWalletAddress, chain_id",
        } as CreateAgentResponse,
        { status: 400 }
      );
    }

    // Step 1: Check if user exists in Table 1 (users table)
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", userWalletAddress.toLowerCase())
      .maybeSingle();

    let userId: string;

    if (userError) {
      console.error("Error checking user:", userError);
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
        } as CreateAgentResponse,
        { status: 500 }
      );
    }

    if (!existingUser) {
      // User doesn't exist, try to create new user
      const { data: newUser, error: createUserError } = await supabase
        .from("users")
        .insert({
          wallet_address: userWalletAddress.toLowerCase(),
          preferences: { chain_id },
        })
        .select("id")
        .single();

      if (createUserError) {
        // Check if this is a duplicate key error (race condition)
        if (createUserError.code === "23505") {
          console.log("User already exists (race condition), fetching existing user:", userWalletAddress);
          // Fetch the existing user that was created by another request
          const { data: fetchedUser, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("wallet_address", userWalletAddress.toLowerCase())
            .single();
          
          if (fetchError || !fetchedUser) {
            console.error("Error fetching existing user after race condition:", fetchError);
            return NextResponse.json(
              {
                success: false,
                error: "Failed to create or fetch user",
              } as CreateAgentResponse,
              { status: 500 }
            );
          }
          
          userId = fetchedUser.id;
        } else {
          console.error("Error creating user:", createUserError);
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create user",
            } as CreateAgentResponse,
            { status: 500 }
          );
        }
      } else {
        userId = newUser.id;
      }
    } else {
      userId = existingUser.id;
    }

    // Step 2: Check if agent wallet already exists for this user
    const { data: existingAgent, error: agentError } = await supabase
      .from("agent_wallets")
      .select("agent_id")
      .eq("user_wallet_address", userWalletAddress.toLowerCase())
      .single();

    if (!agentError && existingAgent) {
      // Agent already exists, return existing agent_id
      return NextResponse.json({
        success: true,
        agent_id: existingAgent.agent_id,
      } as CreateAgentResponse);
    }

    // Step 3: Create new agent wallet using viem (better than ethers!)
    let privateKey: string;
    let account: any;
    let agentId: string;

    try {
      privateKey = generatePrivateKey();
      account = privateKeyToAccount(privateKey as `0x${string}`);
      agentId = randomBytes(16).toString("hex"); // Generate unique agent ID
      console.log("Successfully generated wallet:", {
        agentId,
        address: account.address,
      });
    } catch (walletError) {
      console.error("Error generating wallet:", walletError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to generate wallet: ${
            walletError instanceof Error ? walletError.message : "Unknown error"
          }`,
        } as CreateAgentResponse,
        { status: 500 }
      );
    }

    // Step 4: Store agent wallet in database
    const { error: insertError } = await supabase.from("agent_wallets").insert({
      agent_id: agentId,
      wallet_private_key: privateKey,
      wallet_public_key: account.address as string,
      user_wallet_address: userWalletAddress.toLowerCase(),
      chain_id: chain_id,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error creating agent wallet:", {
        error: insertError,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Failed to create agent wallet: ${
            insertError.message || insertError.details || "Unknown error"
          }`,
        } as CreateAgentResponse,
        { status: 500 }
      );
    }

    // Step 5: Initialize user profile if not exists
    const { error: profileError } = await supabase.from("user_profiles").upsert(
      {
        user_wallet_address: userWalletAddress.toLowerCase(),
        risk_profile: "moderate", // Default risk profile
        other_user_info: JSON.stringify({
          created_via_agent: true,
          chain_id: chain_id,
          agent_created_at: new Date().toISOString(),
        }),
      },
      {
        onConflict: "user_wallet_address",
      }
    );

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // Don't fail the request for profile creation error
    }

    return NextResponse.json({
      success: true,
      agent_id: agentId,
    } as CreateAgentResponse);
  } catch (error) {
    console.error("Error in create_agent:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return NextResponse.json(
      {
        success: false,
        error: `Internal server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      } as CreateAgentResponse,
      { status: 500 }
    );
  }
}
