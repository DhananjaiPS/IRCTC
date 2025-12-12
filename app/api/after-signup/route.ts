import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } =await  auth();

  if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

  // Check DB
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    // User NOT in DB → Redirect to profile setup page
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // If user exists AND metadata says profile done → send home
  return NextResponse.redirect(new URL("/", req.url));
}
