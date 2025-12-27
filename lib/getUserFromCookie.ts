"use server"
import { cookies } from "next/headers";

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  return {
    name: "Demo User",
    email: "demo@gmail.com",
    token,
  };
}
