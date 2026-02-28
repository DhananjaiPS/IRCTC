"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react"; // Import icon

const LogoutButton = () => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    // Clear your backend cookies
    await fetch("/api/sign-out", { method: "POST" });

    // Sign out from Clerk
    await signOut();

    // Optional: redirect to homepage
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center px-2 py-3  h-[3vh] bg-red-600 text-white rounded hover:bg-red-500 transition space-x-1"
    >
      {/* Show icon on all screens */}
      <LogOut className="w-4 h-4 sm:hidden" />

      {/* Show text only on sm+ screens */}
      <span className="hidden sm:inline text-sm font-semibold">Logout</span>
    </button>
  );
};

export default LogoutButton;
