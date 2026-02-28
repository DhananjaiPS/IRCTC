"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const CustomUserButtonFallback = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return null;

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 text-white">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: "30px",
              height: "30px",
            },
            userButtonPopoverCard: {
              backgroundColor: "blue",
              border: "2px solid #E32636",
            },
          },
        }}
      >
        {/* ⭐ ADD CUSTOM MENU HERE */}
        <UserButton.MenuItems>
          <UserButton.Action
            label="Profile"
            labelIcon={
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"   // ⭐ size control here
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 21a8 8 0 0 1 13.292-6" />
    <circle cx="10" cy="8" r="5" />
    <path d="m16 19 2 2 4-4" />
  </svg>
}

            onClick={() => router.push("/profile_view")}
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
};
