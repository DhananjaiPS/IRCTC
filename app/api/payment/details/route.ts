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

    // 🔍 Deep inclusion: Booking ke saath Passengers aur Train details bhi fetch kar rahe hain
    const payment = await prisma.payment.findUnique({
      where: { bookingId: BigInt(bookingId) },
      include: { 
        booking: {
          include: {
             passengers: true, // 👈 Passengers details yahan se aayengi
             fromStation: true,
             toStation: true,
             trainInstance: {
               include: {
                 schedule: {
                   include: {
                     train: true // Train name aur number ke liye
                   }
                 }
               }
             }
          }
        } 
      }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // Response structure for your UI
    return NextResponse.json(serialize({
      success: true,
      amount: payment.booking.totalFare,
      pnr: payment.booking.pnr,
      status: payment.status,
      gatewayTransactionId: payment.gatewayTransactionId, // UI mein dikhane ke liye
      data: payment,
      book: payment.booking // Iske andar ab 'passengers' array milega
    }));

  } catch (error: any) {
    console.error("PAYMENT_DETAILS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}