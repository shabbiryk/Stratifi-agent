"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, arbitrum, polygon, optimism } from "@privy-io/chains";
import { config } from "@/lib/wagmi";
import ClientOnly from "@/components/client-only";

// Create a client - singleton to prevent multiple initializations
let queryClientInstance: QueryClient | null = null;
const getQueryClient = () => {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
        },
      },
    });
  }
  return queryClientInstance;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={getQueryClient()}>
          <PrivyProvider
            appId={
              process.env.NEXT_PUBLIC_PRIVY_APP_ID ||
              "clnoklnw602hhl60fmb0ejm8i"
            }
            config={{
              // Appearance customization
              appearance: {
                theme: "dark",
                accentColor: "#3b82f6",
                logo: "/logo.png",
                // Configure wallet options
                walletList: [
                  "metamask",
                  "coinbase_wallet",
                  "wallet_connect",
                  "rainbow",
                  "detected_ethereum_wallets",
                ],
              },
              // Login methods
              loginMethods: ["wallet", "email"],
              // Embedded wallets configuration
              embeddedWallets: {
                createOnLogin: "users-without-wallets",
                showWalletUIs: true,
              },
              // Supported chains
              supportedChains: [base, arbitrum, polygon, optimism],
            }}
          >
            {children}
          </PrivyProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClientOnly>
  );
}
