import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from './generated/client';

import { withAccelerate } from "@prisma/extension-accelerate";
import prisma from "@/lib/prisma";

// const prisma = new PrismaClient({
//   accelerateUrl: process.env.DATABASE_URL,
// }).$extends(withAccelerate());

// === Include kycVerified ===
interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  idType?: "AADHAR" | "PAN" | "PASSPORT";
  idNumber?: string;
  kycVerified?: boolean;     // <-- IMPORTANT
}

const normalize = (v: any) =>
  v === "" || v === null || v === undefined ? undefined : v;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const clerk = await clerkClient();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data: ProfileData = await req.json();

  try {
    const payload = {
      clerkId: userId,
      fullName: normalize(data.fullName),
      email: normalize(data.email),
      phone: normalize(data.phone),
      gender: normalize(data.gender),
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      addressLine1: normalize(data.addressLine1),
      addressLine2: normalize(data.addressLine2),
      city: normalize(data.city),
      state: normalize(data.state),
      pincode: normalize(data.pincode),
      idType: normalize(data.idType),
      idNumber: normalize(data.idNumber),

      // === FIX: Save KYC status ===
      kycVerified: data.kycVerified ?? false,
    };

    const createdUser = await prisma.user.create({
      data: payload,
    });
    console.log(createdUser);

    await clerk.users.updateUser(userId, {
      unsafeMetadata: { isProfileComplete: true },
    });

    const response = NextResponse.json({
      success: true,
      data: createdUser,
    });

    response.cookies.set("token", JSON.stringify(createdUser));

    return response;
  } catch (error: any) {
    console.error("PRISMA ERROR:", JSON.stringify(error, null, 2));

    let message = "Profile creation failed due to an unexpected server error.";

    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "email") message = "This email is already registered.";
      else if (field === "phone") message = "This phone number is already registered.";
      else if (field === "idNumber") message = "This ID number is already registered.";
      else message = "A unique constraint conflict occurred.";
    }

    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}