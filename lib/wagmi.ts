import { http, createConfig } from "wagmi";
import { base, arbitrum, polygon, optimism, mainnet } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

// Project ID from WalletConnect (you'll need to get this)
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id";

// Prevent multiple initialization by creating config only once
let configInstance: any = null;

export const config =
  configInstance ||
  (configInstance = createConfig({
    chains: [base, arbitrum, polygon, optimism, mainnet],
    connectors: [
      metaMask(),
      coinbaseWallet({
        appName: "StratiFi",
        appLogoUrl: "/logo.png",
      }),
      walletConnect({
        projectId,
        showQrModal: false, // Prevent duplicate modals
      }),
    ],
    transports: {
      [base.id]: http(),
      [arbitrum.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [mainnet.id]: http(),
    },
  }));

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
