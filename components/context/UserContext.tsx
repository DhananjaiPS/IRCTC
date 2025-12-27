'use client'

import { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

export type UserType = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  walletBalance?: number;
  kycVerified?: boolean;
};

export type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  // --- Initialize user from cookie synchronously ---
  const token = Cookies.get("token");
  let initialUser: UserType | null = null;

  if (token) {
    try {
      const parsed = JSON.parse(token);
      initialUser = parsed.user || parsed;
    } catch (e) {
      console.warn("Failed to parse cookie token on init:", e);
    }
  }

  const [user, setUser] = useState<UserType | null>(initialUser);

  // --- Keep user in sync if cookie changes (optional) ---
  useEffect(() => {
    const cookieListener = () => {
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const parsed = JSON.parse(token);
        setUser(parsed.user || parsed);
      } catch {}
    };

    window.addEventListener("cookieChange", cookieListener); // custom event if you trigger cookie updates
    return () => window.removeEventListener("cookieChange", cookieListener);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
