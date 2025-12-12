
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/after-signup",
  "/api/profile",
  "/api/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // FIX: auth() returns a real object
  const { userId, sessionClaims } = auth();

  const isProfileComplete = sessionClaims?.unsafeMetadata?.isProfileComplete;
  const path = req.nextUrl.pathname;

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Clerk automatically handles redirect for unauthenticated users
  if (!userId) {
    return NextResponse.next();
  }

  if (!isProfileComplete && path !== "/profile") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (isProfileComplete && path === "/profile") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Ensure this captures all routes including APIs
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
