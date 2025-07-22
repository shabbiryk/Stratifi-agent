"use client";

import { useEffect, useState } from "react";

interface ClientOnlyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnlyWrapper({
  children,
  fallback = null,
}: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Extra check for client-side APIs
    const checkClientReady = () => {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        setIsClientReady(true);
      }
    };

    // Small delay to ensure all client-side APIs are available
    const timer = setTimeout(checkClientReady, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted || !isClientReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
