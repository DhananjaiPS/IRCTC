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

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch Booking + Passengers
      const booking = await tx.booking.findUnique({
        where: { id: bId },
        include: {
          passengers: true,
          trainInstance: true,
          schedule: { include: { coaches: { include: { seats: true } } } }
        }
      });

      if (!booking || !booking.trainInstance) throw new Error("Booking or Instance not found");

      // 2. CHECK STATUS
      if (paymentStatus === "SUCCESS") {
        const passengerCount = booking.passengers.length;

        // 🔥 FORCE UPDATE INVENTORY: Isse count 100% kam hoga
        const updatedInstance = await tx.trainInstance.update({
          where: { id: booking.trainInstanceId! },
          data: {
            availableSeats: { decrement: passengerCount },
            bookedSeats: { increment: passengerCount },
          }
        });

        console.log(`DECREMENTED: ${passengerCount} seats. New count: ${updatedInstance.availableSeats}`);

        // 3. Seat Allocation (Physical)
        const targetCoaches = booking.schedule.coaches.filter(c => c.coachType === booking.trainInstance?.coachType);
        const bookedSeats = await tx.seatAvailability.findMany({
          where: { trainInstanceId: booking.trainInstanceId, status: "BOOKED" },
          select: { seatId: true }
        });
        const bookedSeatIds = bookedSeats.map(s => s.seatId);
        const availablePhysicalSeats = targetCoaches.flatMap(c => c.seats).filter(s => !bookedSeatIds.includes(s.id));

        const seatAssignments = booking.passengers.map((p, idx) => ({
          trainInstanceId: booking.trainInstanceId,
          bookingId: bId,
          passengerId: p.id,
          coachId: availablePhysicalSeats[idx] ? targetCoaches.find(c => c.seats.some(s => s.id === availablePhysicalSeats[idx].id))?.id : null,
          seatId: availablePhysicalSeats[idx]?.id || null,
          status: availablePhysicalSeats[idx] ? ("BOOKED" as const) : ("WAITLISTED" as const)
        }));

        await tx.seatAvailability.createMany({ data: seatAssignments });

        // 4. Update Other Tables
        await tx.payment.update({
          where: { bookingId: bId },
          data: { status: "SUCCESS", paymentTime: new Date() }
        });

        await tx.passenger.updateMany({
          where: { bookingId: bId },
          data: { status: "CONFIRMED" }
        });

        return await tx.booking.update({
          where: { id: bId },
          data: { status: "BOOKED" }
        });

      } else {
        // Failure logic
        await tx.payment.update({ where: { bookingId: bId }, data: { status: "FAILED" } });
        return await tx.booking.update({ where: { id: bId }, data: { status: "CANCELLED" } });
      }
    }, {
      isolationLevel: "ReadCommitted",
      maxWait: 5000, // Connection milne ke liye 5 sec tak wait karega
      timeout: 15000, // Pura transaction finish karne ke liye 15 sec dega
      // isolationLevel: "Serializable" ko hata do (Default use hone do)
    });

    return NextResponse.json({ success: true, pnr: result.pnr });

  } catch (err: any) {
    console.error("VERIFY_CRITICAL_ERROR:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}