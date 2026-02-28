import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/profile(.*)",   // ✅ allow profile always
  "/api(.*)",
]);

type Claims = {
  publicMetadata?: {
    isProfileComplete?: boolean;
  };
};

// add like if user hows role is ADMIN_SUPPORT then only he is aloow to see /admin/support ro
// simple userID jo clerk se aa rhi h use le use db call kr ek or fidi kr us euser ko or fir uska rol echeck kr le agar usk arole ADMIN_SUPPORT ho tbhi use allow kr ki wo use route ko vist rik ske les nhi 

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  console.log(userId);
  const raw = req.cookies.get("token")?.value;

  let userData: any = null;

  if (raw) {
    try {
      const decoded = decodeURIComponent(raw); // step 1
      userData = JSON.parse(decoded);          // step 2
    } catch {
      userData = null;
    }
  }
  if(userId===userData?.clerkId){
    console.log("User data matches");
  } else {
    console.warn("User data does NOT match Clerk ID:", { userId, userData });
  }
  // console.log(userData);
  // const 
  // ✅ public routes skip everything
  if (userId===userData?.clerkId || isPublicRoute(req)) {
    return NextResponse.next();
  }

  // ✅ not logged in → let Clerk handle it
  if (!userId) {
    return NextResponse.next();
  }

  const claims = sessionClaims as Claims | null;

  // safer boolean conversion
  const complete = Boolean(
    claims?.publicMetadata?.isProfileComplete
  );

  // ✅ only redirect if NOT complete
  if (userId!=userData?.clerkId || !complete) {
    const profileUrl = new URL("/profile", req.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
