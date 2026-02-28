import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, sessionClaims } = await auth();

  // PRODUCTION TIP: Check if user is actually an admin
  // if (sessionClaims?.metadata?.role !== "admin") ... 
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        attachments: { select: { id: true, filename: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Handle BigInt serialization safely
    const serialized = JSON.parse(JSON.stringify(complaints, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ complaints: serialized });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}