import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { trainNo, date, from, to, class: coachType } = await req.json();
    
    // Normalize date to 00:00:00 for DB comparison
    const journeyDate = new Date(date);
    journeyDate.setHours(0, 0, 0, 0);
    
    const now = new Date();

    /* ---------------- 1. Train & Time Validation ---------------- */
    const train = await prisma.train.findUnique({ 
      where: { trainNo },
      include: { schedules: true } 
    });
    
    if (!train) return NextResponse.json({ error: "Train not found" }, { status: 404 });

    // Time Check (Past Departure)
    const [h, m] = (train.departureTime || "00:00").split(":").map(Number);
    const depDateTime = new Date(journeyDate);
    depDateTime.setHours(h, m, 0, 0);

    if (depDateTime < now) {
      return NextResponse.json({ error: "Train has already departed", isPast: true }, { status: 400 });
    }

    /* ---------------- 2. Fetch Inventory (The New Way) ---------------- */
    // Hum direct TrainInstance table check karenge instead of counting thousands of rows
    const inventory = await prisma.trainInstance.findFirst({
      where: {
        journeyDate: journeyDate,
        coachType: coachType,
        schedule: {
          trainId: train.id,
          status: "RUNNING"
        }
      }
    });

    if (!inventory) {
      return NextResponse.json({ 
        error: "No seats found for this date/class. Check if train runs on this day.",
        availableCount: 0 
      }, { status: 400 });
    }

    /* ---------------- 3. Status Logic ---------------- */
    let status = "AVAILABLE";
    let displayCount = inventory.availableSeats;

    if (inventory.availableSeats <= 0) {
      if (inventory.racSeats > 0) {
        status = "RAC";
        displayCount = inventory.racSeats;
      } else if (inventory.wlSeats >= 0) { // wlSeats starting from 0, incrementing
        status = "WAITLIST";
        displayCount = inventory.wlSeats + 1; // Showing current WL position
      } else {
        status = "FULL";
        displayCount = 0;
      }
    }

    /* ---------------- 4. Fare Calculation ---------------- */
    // Note: Isko baad mein distance-based (Route table) kar sakte hain
    const fareMap: Record<string, number> = { 
      SL: 450, "AC3": 1200, "AC2": 1800, "AC1": 2500, "3E": 1100 
    };
    const fare = fareMap[coachType] ?? 500;

    return NextResponse.json({
      success: true,
      trainName: train.name,
      availableCount: displayCount,
      fare,
      status, // Returns: AVAILABLE, RAC, or WAITLIST
      instanceId: inventory.id.toString() // String conversion for BigInt safety
    });

  } catch (err: any) {
    console.error("Search Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}