// app/api/set-user-cookie/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma"; // your Prisma client

export async function POST(req: Request) {
    try {
        const { clerkId } = await req.json();
        console.log(clerkId)
        if (!clerkId) return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 });

        // Fetch user from DB using Clerk ID
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });
        console.log("User", user)
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        const res = NextResponse.json({ success: true, user });
        res.cookies.set({
            name: "token",
            value: JSON.stringify({user
            }),
            path: "/",
            httpOnly: false, // allow JS access for testing
            secure: false,   // localhost
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });

        // Immediately read back cookie from response object
        const cookies = res.cookies.getAll();
        console.log("Cookies set in response:", cookies);
        console.log("Cookie set on server:", user);
        // const cookies = res.cookies.getAll();
        // console.log("Cookies set in response:", cookies);
        // return NextResponse.json({ success: true, msg: user });
        return res;
    } catch (error) {
        console.error("Error setting user cookie:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
