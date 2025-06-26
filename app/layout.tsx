import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ConditionalNavbar from "@/components/conditional-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StratiFi AI Agent",
  description:
    "Advanced DeFi yield optimization powered by AI. Maximize your returns with intelligent strategy selection and real-time market analysis.",
  generator: "Stratefi",
  keywords: [
    "DeFi",
    "Yield Farming",
    "AI",
    "Cryptocurrency",
    "Blockchain",
    "Web3",
  ],
  openGraph: {
    title: "StratiFi AI Agent - DeFAI",
    description:
      "Advanced DeFi yield optimization powered by AI. Maximize your returns with intelligent strategy selection and real-time market analysis.",
    type: "website",
    locale: "en_US",
    siteName: "StratiFi",
  },
  twitter: {
    card: "summary_large_image",
    title: "StratiFi AI Agent - DeFAI",
    description:
      "Advanced DeFi yield optimization powered by AI. Maximize your returns with intelligent strategy selection and real-time market analysis.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ConditionalNavbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
