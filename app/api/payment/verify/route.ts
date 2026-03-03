import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    console.log("VERIFY BODY:", { bookingId, status });
    if (!bookingId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const bId = BigInt(bookingId);

    // Normalize status to uppercase to avoid "success" vs "SUCCESS" bugs
    const paymentStatus = status?.toUpperCase();

    // ... (Initial checks same)

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bId },
        include: {
          passengers: true,
          trainInstance: true,
          schedule: { include: { coaches: { include: { seats: true } } } }
        }
      });

      if (!booking || !booking.trainInstance) throw new Error("Booking not found");

      if (paymentStatus === "SUCCESS") {
        const passengerCount = booking.passengers.length;

        // 1. Inventory Update
        await tx.trainInstance.update({
          where: { id: booking.trainInstanceId! },
          data: {
            availableSeats: { decrement: passengerCount },
            bookedSeats: { increment: passengerCount },
          }
        });

        // 2. Class Variants Mapping
        const COACH_VARIANTS: Record<string, string[]> = {
          "AC3": ["AC3", "3A", "3-TIER"], "3A": ["AC3", "3A", "3-TIER"],
          "AC2": ["AC2", "2A", "2-TIER"], "2A": ["AC2", "2A", "2-TIER"],
          "AC1": ["AC1", "1A", "FIRST AC"], "1A": ["AC1", "1A", "FIRST AC"],
          "SL": ["SL", "SLEEPER"],
        };

        const requestedClass = booking.trainInstance.coachType.toUpperCase();
        const acceptableVariants = COACH_VARIANTS[requestedClass] || [requestedClass];

        const targetCoaches = booking.schedule.coaches.filter(c =>
          acceptableVariants.includes(c.coachType.toUpperCase())
        );

        // 3. Find Available Physical Seats
        const bookedSeats = await tx.seatAvailability.findMany({
          where: { trainInstanceId: booking.trainInstanceId, status: "BOOKED" },
          select: { seatId: true }
        });
        const bookedSeatIds = bookedSeats.map(s => s.seatId);
        const availablePhysicalSeats = targetCoaches.flatMap(c => c.seats).filter(s => !bookedSeatIds.includes(s.id));

        // 4. 🔥 SEAT ASSIGNMENTS (Individual Logic)
        const seatAssignments = booking.passengers.map((p, idx) => ({
          trainInstanceId: booking.trainInstanceId,
          bookingId: bId,
          passengerId: p.id,
          coachId: availablePhysicalSeats[idx] ? targetCoaches.find(c => c.seats.some(s => s.id === availablePhysicalSeats[idx].id))?.id : null,
          seatId: availablePhysicalSeats[idx]?.id || null,
          status: availablePhysicalSeats[idx] ? ("BOOKED" as const) : ("WAITLISTED" as const)
        }));

        await tx.seatAvailability.createMany({ data: seatAssignments });

        // 5. Update Payment Status
        await tx.payment.update({
          where: { bookingId: bId },
          data: { status: "SUCCESS", paymentTime: new Date() }
        });

        // 6. 🔥 FIX: Update Passengers Individually (Success Block ke andar)
        for (let i = 0; i < booking.passengers.length; i++) {
          const p = booking.passengers[i];
          const s = availablePhysicalSeats[i]; // Check if seat was actually found

          await tx.passenger.update({
            where: { id: p.id },
            data: {
              status: s ? "CONFIRMED" : "WAITLISTED",
              seatId: s ? s.id : null
            }
          });
        }

        return await tx.booking.update({
          where: { id: bId },
          data: { status: "BOOKED" }
        });

      } else {
        // 7. REAL Failure logic (Payment failed)
        await tx.payment.update({ where: { bookingId: bId }, data: { status: "FAILED" } });
        return await tx.booking.update({ where: { id: bId }, data: { status: "CANCELLED" } });
      }
    }, {
      isolationLevel: "ReadCommitted",
      maxWait: 5000,
      timeout: 15000,
    });

    return NextResponse.json({ success: true, pnr: result.pnr });

  } catch (err: any) {
    console.error("VERIFY_CRITICAL_ERROR:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}