import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to handle BigInt serialization
const serialize = (obj: any) =>
  JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Ek hi query mein Payment aur Booking fetch karlo
    const payment = await prisma.payment.findUnique({
      where: { bookingId: BigInt(bookingId) },
      include: { 
        booking: {
          include: {
             trainInstance: true // Optional: if you need train info
          }
        } 
      }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // Response ko serialize function se wrap karlo
    return NextResponse.json(serialize({
      success: true,
      amount: payment.booking.totalFare,
      pnr: payment.booking.pnr,
      status: payment.status,
      data: payment,
      book: payment.booking
    }));

  } catch (error: any) {
    console.error("PAYMENT_DETAILS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}