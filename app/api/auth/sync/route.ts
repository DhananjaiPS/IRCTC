import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch the user from YOUR database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found in DB. Profile completion required." 
      }, { status: 404 });
    }

    // 2. Prepare the response
    const response = NextResponse.json({
      success: true,
      data: dbUser,
    });

    // 3. Set the cookie EXACTLY like your Signup code
    // We stringify and encode to handle special characters
    const cookieValue = encodeURIComponent(JSON.stringify(dbUser));
    
    response.cookies.set("token", cookieValue, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    console.log("token Created ")

    return response;
  } catch (error) {
    console.error("SYNC ERROR:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}