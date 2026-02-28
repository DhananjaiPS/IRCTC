import { NextResponse } from "next/server";
import { checkPNRStatus } from "irctc-connect";
import prisma from "@/lib/prisma";

// Helper to serialize BigInt for local DB results
const serialize = (obj: any) => 
  JSON.parse(JSON.stringify(obj, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  ));

export async function POST(req: Request) {
  try {
    const { pnr } = await req.json();

    if (!pnr || pnr.length !== 10) {
      return NextResponse.json({ success: false, message: "Invalid PNR" }, { status: 400 });
    }

    // --- STEP 1: CHECK LOCAL DATABASE ---
    const localBooking = await prisma.booking.findUnique({
      where: { pnr: pnr.toUpperCase() },
      include: {
        schedule: {
          include: { train: true }
        },
        fromStation: true,
        toStation: true,
        passengers: {
          include: { seat: { include: { coach: true } } }
        },
        payment: true
      }
    });

    // Inside your localBooking logic in route.ts
if (localBooking) {
  const train = localBooking.schedule.train;
  const journeyDateStr = localBooking.schedule.startDate.toISOString().split('T')[0];

  // Create real Date objects by combining the journey date with the train's time
  const departureDate = new Date(`${journeyDateStr}T${train.departureTime || "00:00:00"}`);
  const arrivalDate = new Date(`${journeyDateStr}T${train.arrivalTime || "00:00:00"}`);

  // Handle cases where arrival is the next day (Optional logic)
  if (arrivalDate < departureDate) {
    arrivalDate.setDate(arrivalDate.getDate() + 1);
  }

  const formattedData = {
    pnr: localBooking.pnr,
    status: localBooking.status === "BOOKED" ? "Confirmed" : "Cancelled",
    train: {
      number: train.trainNo,
      name: train.name,
      class: localBooking.passengers[0]?.seat?.coach?.coachType || "N/A"
    },
    journey: {
      from: { name: localBooking.fromStation.name, code: localBooking.fromStation.id },
      to: { name: localBooking.toStation.name, code: localBooking.toStation.id },
      departure: departureDate.toISOString(), // Corrected Date
      arrival: arrivalDate.toISOString(),     // Corrected Date
      duration: calculateDuration(departureDate, arrivalDate)
    },
    // ... rest of your code
  };
  
  return NextResponse.json({ success: true, source: "LOCAL_DB", data: serialize(formattedData) });
}

// Simple helper to show duration
function calculateDuration(start: Date, end: Date) {
  const diff = Math.abs(end.getTime() - start.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${hours}h ${mins}m`;
}

    // --- STEP 2: FALLBACK TO EXTERNAL RAILWAY API ---
    // Only attempt if PNR is numeric (External PNRs are always numbers)
    if (/^\d+$/.test(pnr)) {
      const result = await checkPNRStatus(pnr);
      if (result?.success) {
        return NextResponse.json({
          success: true,
          source: "RAILWAY_API",
          data: result.data
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "PNR not found in our records or Railway servers."
    }, { status: 404 });

  } catch (err: any) {
    console.error("PNR Error:", err);
    return NextResponse.json({
      success: false,
      message: "Service temporarily unavailable."
    }, { status: 502 });
  }
}