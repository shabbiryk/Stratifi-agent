"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export default function WalletConnectButton() {
  const { login, authenticated, user, ready } = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, show a disabled button
  if (!mounted) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  // If Privy is not configured, show a disabled button
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Wallet Not Configured
      </Button>
    );
  }

  if (!ready) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (authenticated && user) {
    return (
      <Button variant="outline" className="bg-blue-500/10 hover:bg-blue-500/20">
        <Wallet className="mr-2 h-4 w-4" />
        {user.wallet?.address.slice(0, 6)}...{user.wallet?.address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={login} className="bg-blue-600 hover:bg-blue-700">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
