"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base, arbitrum, polygon, optimism } from "@privy-io/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={
        process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clnoklnw602hhl60fmb0ejm8i"
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
  );
}
