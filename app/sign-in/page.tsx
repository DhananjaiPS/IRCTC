'use client'

import { useUser, SignIn } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, user } = useUser();
  console.log("User Sign in :",isSignedIn,user);

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id }), // send Clerk ID
      });
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) return <SignIn />;

  return <div>Welcome, {user?.fullName}!</div>;
}
