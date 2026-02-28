import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rating, title, comment, trainId, stationId } = await req.json();

    // Find our internal user ID from the Clerk ID
    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const review = await prisma.review.create({
      data: {
        userId: dbUser.id,
        rating: Number(rating),
        title,
        comment,
        trainId: trainId ? BigInt(trainId) : null,
        stationId: stationId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}