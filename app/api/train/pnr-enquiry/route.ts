import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const serialize = (obj: any) =>
  JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export async function POST(req: Request) {
  try {
    const { pnr } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { pnr: pnr.toUpperCase() },
      include: {
        fromStation: true,
        toStation: true,
        schedule: { include: { train: true } },
        passengers: {
          include: {
            seat: { include: { coach: true } }
          }
        },
        seatAvailabilities: {
          include: {
            seat: { include: { coach: true } }
          }
        }
      },
    });

    if (!booking) return NextResponse.json({ success: false, message: "Invalid PNR" }, { status: 404 });

    const train = booking.schedule.train;
    const journeyDate = booking.journeyDate!;
    const dateStr = journeyDate.toISOString().split('T')[0];
    
    const departureDate = new Date(`${dateStr}T${train.departureTime || "00:00:00"}`);
    let arrivalDate = new Date(`${dateStr}T${train.arrivalTime || "00:00:00"}`);

    // Fix: If arrival time is numerically before departure, it's next day
    if (arrivalDate <= departureDate) {
      arrivalDate.setDate(arrivalDate.getDate() + 1);
    }

    const formattedData = {
      pnr: booking.pnr,
      bookedAt: booking.bookedAt,
      train: {
        name: train.name,
        no: train.trainNo,
        class: booking.seatAvailabilities[0]?.seat?.coach?.coachType || "SL"
      },
      journey: {
        from: { id: booking.fromStation.id, name: booking.fromStation.name },
        to: { id: booking.toStation.id, name: booking.toStation.name },
        departure: departureDate.toISOString(),
        arrival: arrivalDate.toISOString(),
        duration: calculateDuration(departureDate, arrivalDate)
      },
      // ✅ FIX: Safe mapping to prevent "Property coach does not exist" error
      passengers: booking.passengers.map((p) => {
        // Look for the seat in SeatAvailability first (Live status)
        const sAvail = booking.seatAvailabilities.find(sa => sa.passengerId === p.id);
        
        // TypeScript safe access using Optional Chaining (?.)
        const seatObj = sAvail?.seat || p.seat;
        const coachObj = seatObj?.coach;

        return {
          name: p.name,
          age: p.age,
          gender: p.gender,
          status: p.status, 
          coach: coachObj?.coachNumber || "---",
          seat: seatObj?.seatNo || "---",
          berth: seatObj?.berthType || "---"
        };
      })
    };

    return NextResponse.json({ success: true, data: serialize(formattedData) });
  } catch (e) {
    console.error("PNR_API_ERROR:", e);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

function calculateDuration(start: Date, end: Date) {
  const diff = Math.abs(end.getTime() - start.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${hours}h ${mins}m`;
}