import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* ------------ GET ------------ */
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const profile = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  return NextResponse.json(profile);
}

/* ------------ UPDATE ------------ */
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const body = await req.json();

  await prisma.user.update({
    where: { clerkId: user.id },
    data: body,
  });

  return NextResponse.json({ success: true });
}
