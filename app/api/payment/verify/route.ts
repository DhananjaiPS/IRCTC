import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import redisClient from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    console.log("VERIFY BODY:", { bookingId, status });
    if (!bookingId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const bId = BigInt(bookingId);
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

      if (!booking || !booking.trainInstance) throw new Error("Booking not found");

      if (paymentStatus === "SUCCESS") {




        // 1. Redis timer band karo (Taki background worker ise cancel na kare)
        // Verify API (Payment Success hone par):
        const bookingIdStr = bookingId.toString();

        // 1. Stop the "Rollback Timer" in Redis
        await redisClient.del(`pending_booking:${bookingIdStr}`);


        const passengerCount = booking.passengers.length;

        // 2. Inventory Update
        // await tx.trainInstance.update({
        //   where: { id: booking.trainInstanceId! },
        //   data: {
        //     availableSeats: { decrement: passengerCount },
        //     bookedSeats: { increment: passengerCount },
        //   }
        // });

        // 3. Class Variants Mapping (AC2/2A etc.)
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

        // 4. Find Available Physical Seats
        const bookedSeats = await tx.seatAvailability.findMany({
          where: { trainInstanceId: booking.trainInstanceId, status: "BOOKED" },
          select: { seatId: true }
        });
        const bookedSeatIds = bookedSeats.map(s => s.seatId);

        // Ye rahi hamari fresh seats ki list
        let availablePhysicalSeats = targetCoaches
          .flatMap(c => c.seats)
          .filter(s => !bookedSeatIds.includes(s.id));

        const seatAssignments = [];

        // 5. 🔥 FIX: Loop for unique seat assignment
        for (const p of booking.passengers) {
          // List ki pehli seat uthao
          const currentSeat = availablePhysicalSeats.shift();

          if (currentSeat) {
            // Seat mili toh record banao
            seatAssignments.push({
              trainInstanceId: booking.trainInstanceId,
              bookingId: bId,
              passengerId: p.id,
              coachId: currentSeat.coachId,
              seatId: currentSeat.id,
              status: "BOOKED" as const
            });

            // Passenger table update (Confirmed)
            await tx.passenger.update({
              where: { id: p.id },
              data: { status: "CONFIRMED", seatId: currentSeat.id }
            });
          } else {
            // No seat left - Waitlist
            seatAssignments.push({
              trainInstanceId: booking.trainInstanceId,
              bookingId: bId,
              passengerId: p.id,
              coachId: null,
              seatId: null,
              status: "WAITLISTED" as const
            });

            await tx.passenger.update({
              where: { id: p.id },
              data: { status: "WAITLISTED", seatId: null }
            });
          }
        }

        // 6. Create all SeatAvailability records at once
        if (seatAssignments.length > 0) {
          await tx.seatAvailability.createMany({ data: seatAssignments });
        }

        // 7. Update Payment Record
        await tx.payment.update({
          where: { bookingId: bId },
          data: { status: "SUCCESS", paymentTime: new Date() }
        });

        // 8. Finalize Booking Status
        return await tx.booking.update({
          where: { id: bId },
          data: { status: "BOOKED" }
        });

      } else {
        // Payment Failure Case - Immediate Rollback
        const bookingIdStr = bookingId.toString();

        // Stop QStash from running later (optional but good for clean logs)
        await redisClient.del(`pending_booking:${bookingIdStr}`);

        const passengerCount = booking.passengers.length;

        // 1. Release inventory NOW
        await tx.trainInstance.update({
          where: { id: booking.trainInstanceId! },
          data: {
            availableSeats: { increment: passengerCount },
            bookedSeats: { decrement: passengerCount },
          }
        });




        //         QStash vs Manual Cancel (Difference)
        // QStash Case: User ne payment page khola aur browser band kar diya. 15 minute baad QStash aayega aur seats release karega.

        // Manual Cancel (Verify else block): User ne payment karne ki koshish ki, bank ne "Transaction Failed" ka error turant bhej diya. Aapka verify route hit hua aur aapko pata chal gaya ki payment fail ho gayi hai.

        // 2. Sahi Approach Kya Hai?
        // Agar aapko Verify API mein turant pata chal gaya hai ki payment fail ho chuki hai, toh 15 minute tak seats block karke rakhna acchi baat nahi hai. Isse do nuksan honge:

        // System Efficiency: Wo seats 15 minute tak "jail" mein rahengi, koi aur unhe book nahi kar payega.

        // User Experience: Agar user dubara try karna chahe, toh shayad usse seats "Full" dikhein kyunki uski purani seats abhi tak release nahi hui hain.

        // 3. Recommendation
        // Aapka logic sahi hai ki QStash "Safety Net" hai, lekin Verify API ke else block mein bhi inventory release kar deni chahiye.

        // 2. Update statuses
        await tx.payment.update({ where: { bookingId: bId }, data: { status: "FAILED" } });
        await tx.passenger.updateMany({ where: { bookingId: bId }, data: { status: "CANCELLED" } });

        return await tx.booking.update({
          where: { id: bId },
          data: { status: "CANCELLED" }
        });
      }
    }, {
      isolationLevel: "ReadCommitted", // High traffic ke liye ReadCommitted best hai
      maxWait: 5000,
      timeout: 20000,
    });

    return NextResponse.json({ success: true, pnr: result.pnr });

  } catch (err: any) {
    console.error("VERIFY_CRITICAL_ERROR:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}