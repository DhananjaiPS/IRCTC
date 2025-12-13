'use client';

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      unsafeMetadata={{
        isProfileComplete: false, // frontend metadata (copied to user)
      }}
      fallbackRedirectUrl="/after-signup"
      forceRedirectUrl="/after-signup"
    />
  );
}
