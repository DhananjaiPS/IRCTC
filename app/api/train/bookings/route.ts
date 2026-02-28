import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Handle BigInt for JSON responses
const serialize = (obj: any) =>
  JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));

// --- GET: Fetch User Bookings ---
// --- GET: Fetch User Bookings ---
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      include: {
        fromStation: true, 
        toStation: true,   
        schedule: { 
          include: { 
            train: true 
          } 
        },
        passengers: true,
        payment: true,
        // journeyDate field Booking model mein direct hai, isliye alag se include nahi chahiye
      },
      orderBy: { journeyDate: 'desc' } // Journey date ke hisaab se order karo
    });

    return NextResponse.json(serialize(bookings));
  } catch (error) {
    console.error("GET_BOOKINGS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PATCH: Cancel Ticket ---
export async function PATCH(req: Request) {
  try {
    const { pnr } = await req.json();
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { pnr },
        include: { seatAvailabilities: true }
      });

      if (!booking) throw new Error("Booking not found");
      if (booking.status === 'CANCELLED') throw new Error("Ticket is already cancelled");

      // 1. Update Booking Status
      await tx.booking.update({
        where: { pnr },
        data: { status: 'CANCELLED' }
      });

      // 2. Update All Passengers to CANCELLED (Uncommented for consistency)
      await tx.passenger.updateMany({
        where: { bookingId: booking.id },
        data: { status : 'CANCELLED' }
      });

      // 3. Release Slots back to the pool
      for (const sa of booking.seatAvailabilities) {
        await tx.seatAvailability.update({
          where: { id: sa.id },
          data: {
            status: sa.status === 'BOOKED' ? 'AVAILABLE' : sa.status,
            bookingId: null 
          }
        });
      }

      return { success: true };
    });

    return NextResponse.json({ message: "Ticket cancelled successfully", pnr });
  } catch (error: any) {
    console.error("CANCELLATION_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}