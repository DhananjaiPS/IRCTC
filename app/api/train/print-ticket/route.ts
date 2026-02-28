import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const serialize = (obj: any) =>
  JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawPnr = searchParams.get("pnr");

  if (!rawPnr) return NextResponse.json({ error: "PNR is required" }, { status: 400 });
  const pnr = rawPnr.toUpperCase();

  try {
    const booking = await prisma.booking.findUnique({
      where: { pnr },
      include: {
        user: true,
        // Yahan se mapping shuru hoti hai: Passenger -> Seat -> Coach
        passengers: { 
          include: { 
            seat: { 
              include: { coach: true } 
            } 
          } 
        },
        payment: true,
        fromStation: true,
        toStation: true,
        trainInstance: true, 
        schedule: {
          include: {
            train: {
              include: {
                routes: { orderBy: { sequence: 'asc' } }
              }
            }
          }
        }
      }
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // SeatAvailability table se confirm karne ke liye (Double Check)
    const seatMappings = await prisma.seatAvailability.findMany({
      where: { bookingId: booking.id },
      include: {
        seat: { include: { coach: true } }
      }
    });

    const responseData = serialize({ ...booking, seatMappings, gstData: {
      invoiceNumber: `PS26${booking.pnr}11`,
      supplierGstin: "07AAAGM0289C1ZL",
      sacCode: "996421"
    }});

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("API_PRINT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}