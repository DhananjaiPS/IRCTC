"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    // Only fetch if loaded and user exists to set the "token" cookie
    if (isLoaded && userId) {
      fetch("/api/auth/sync");
    }
  }, [userId, isLoaded]);

  return <>{children}</>;
}