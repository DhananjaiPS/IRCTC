// /api/current-user.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return NextResponse.json({ user: null });

  const user = JSON.parse(tokenCookie.value).user || JSON.parse(tokenCookie.value);
  return NextResponse.json({ user });
}
