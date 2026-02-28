import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const serialize = (obj: any) => 
  JSON.parse(JSON.stringify(obj, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  ));

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: {
        schedule: {
          include: {
            train: true
          }
        },
        fromStation: true,
        toStation: true,
        passengers: true, // Simple passengers fetch
        payment: true,
        // 🔥 YE WOH TABLE HAI JAHAN REAL SEAT ALLOCATION HAI
        seatAvailabilities: {
          include: {
            seat: {
              include: { coach: true }
            }
          }
        }
      }
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json(serialize(booking));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}