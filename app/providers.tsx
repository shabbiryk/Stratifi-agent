"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base, baseSepolia } from "viem/chains";
import { addRpcUrlOverrideToChain } from "@privy-io/chains";
import { useEffect, useState } from "react";

// Configure networks with custom RPC URLs
const baseOverride = addRpcUrlOverrideToChain(
  base,
  process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"
);

const baseSepoliaOverride = addRpcUrlOverrideToChain(
  baseSepolia,
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org"
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, just render children
  if (!mounted) {
    return <>{children}</>;
  }

  // Only render PrivyProvider if we have an App ID
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        appearance: {
          theme: "dark",
          accentColor: "#3b82f6",
        },
        supportedChains: [baseOverride, baseSepoliaOverride],
        defaultChain: baseOverride,
        loginMethods: ["wallet", "email", "google", "discord"],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
