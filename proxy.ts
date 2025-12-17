import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes that should NEVER be blocked
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/after-signup",
  "/auth/profile",
  "/api/(.*)",
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  const { userId, sessionClaims } = auth();

  // If route is public → allow immediately
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is not logged in → Clerk will handle redirect
  if (!userId) {
    return NextResponse.next();
  }

  /**
   * Read metadata safely
   */
  const unsafeMetadata =
    sessionClaims?.unsafeMetadata as { isProfileComplete?: boolean } | undefined;

  const isProfileComplete = unsafeMetadata?.isProfileComplete === true;

  const pathname = req.nextUrl.pathname;

  /**
   * Only redirect:
   * - user is authenticated
   * - profile is NOT complete
   * - user is NOT already on /auth/profile
   */
  if (!isProfileComplete && pathname !== "/auth/profile") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/profile";

    // Preserve original destination
    redirectUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  /**
   * Prevent completed users from revisiting profile setup
   */
  if (isProfileComplete && pathname === "/auth/profile") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /**
     * Run only on application routes
     * Exclude static assets & _next internals
     */
    "/((?!_next|.*\\..*).*)",
  ],
};
