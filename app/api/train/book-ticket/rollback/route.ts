import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { bookingId } = await req.json();
        if (!bookingId) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });

        const bId = typeof bookingId === "string" ? BigInt(bookingId) : BigInt(bookingId);

        const result = await prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: bId },
                include: {
                    payment: true,
                    _count: { select: { passengers: true } }
                },
            });

            if (!booking) return { success: false, message: "Booking record not found" };

            const isPaid = booking.payment?.status === "SUCCESS";
            const isConfirmed = booking.status === "BOOKED";

            if (isPaid || isConfirmed) {
                return { success: false, message: "Rollback aborted: Booking is already confirmed/paid." };
            }

            if (booking.status === "CANCELLED") {
                return { success: false, message: "Booking already cancelled." };
            }

            if (booking.status === "PAYMENT_PENDING") {
                const passengerCount = booking._count.passengers || 0;

                // 1. Capture Updated Instance
                let updatedInstance = null;
                if (booking.trainInstanceId) {
                    updatedInstance = await tx.trainInstance.update({
                        where: { id: booking.trainInstanceId },
                        data: {
                            availableSeats: { increment: passengerCount },
                            bookedSeats: { decrement: passengerCount }
                        }
                    });
                }

                // 2. Capture Updated Booking
                const updatedBooking = await tx.booking.update({
                    where: { id: bId },
                    data: { status: "CANCELLED" }
                });

                // 3. Update Payment
                if (booking.payment) {
                    await tx.payment.update({
                        where: { bookingId: bId },
                        data: { status: "FAILED" }
                    });
                }

                // 4. Capture Passengers Update count
                const passengersUpdated = await tx.passenger.updateMany({
                    where: { bookingId: bId },
                    data: { status: "CANCELLED" }
                });

                // Ab saare variables available hain return karne ke liye
                return {
                    success: true,
                    action: "ROLLBACK_EXECUTED",
                    pnr: booking.pnr,
                    changes: {
                        bookingId: bId.toString(),
                        seatsReleased: passengerCount,
                        passengersAffected: passengersUpdated.count, 
                        newAvailableSeats: updatedInstance?.availableSeats ?? "N/A",
                        newBookingStatus: updatedBooking.status
                    }
                };
            }

            return { success: false, message: "Booking status not eligible for rollback." };
        });

        return NextResponse.json(JSON.parse(JSON.stringify(result, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )));

    } catch (err: any) {
        console.error("Rollback Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}