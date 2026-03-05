import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Client } from "@upstash/qstash";

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN! });

interface PassengerInput {
  name: string;
  age: string | number;
  gender: string;
}
const RATE_PER_KM: Record<string, number> = {
  SL: 0.6,
  AC3: 1.5,
  AC2: 2.2,
  AC1: 3.5,
};

const serialize = (obj: any) =>
  JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trainNo, date, from, to, class: coachType, passengers } = body;

    const passengerCount = passengers?.length || 0;
    const journeyDate = new Date(date);
    journeyDate.setHours(0, 0, 0, 0);

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const validUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
    if (!validUser) return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    if (!validUser.kycVerified) return NextResponse.json({ error: "KYC verification required" }, { status: 403 });

    const result = await prisma.$transaction(async (tx) => {
      // 1. Train aur Schedule find karo
      const train = await tx.train.findUnique({
        where: { trainNo },
        include: { routes: true } // ✅ Added include to get route data
      });
      if (!train) throw new Error(`Train ${trainNo} not found`);
      const fromRoute = train.routes.find(r => r.stationId === from);
      const toRoute = train.routes.find(r => r.stationId === to);

      // Validate direction (Source sequence must be less than Destination sequence)
      if (!fromRoute || !toRoute || fromRoute.sequence >= toRoute.sequence) {
        return null;
      }

      // Calculation for Duration
      // Distance-based duration logic (can be replaced with time diff logic)
      const dist = toRoute.distanceFromStart - fromRoute.distanceFromStart;
      const schedule = await tx.trainSchedule.findFirst({
        where: {
          trainId: train.id,
          status: "RUNNING",
          startDate: { lte: journeyDate },
          OR: [{ endDate: null }, { endDate: { gte: journeyDate } }],
        },
      });
      if (!schedule) throw new Error("No active schedule for this date");

      // 2. TrainInstance Check karo (Seat Inventory yahin se manage hogi)
      // Isme availableSeats field ka use kar rahe hain
      const instance = await tx.trainInstance.findUnique({
        where: {
          scheduleId_journeyDate_coachType: {
            scheduleId: schedule.id,
            journeyDate: journeyDate,
            coachType: coachType,
          },
        },
      });

      if (!instance || instance.availableSeats < passengerCount) {
        throw new Error("TRAIN_FULL");
      }


      // 🔥 STEP 1: PESSIMISTIC LOCK (Koi aur is train ko touch nahi kar payega abhi)
      const instanceArray: any[] = await tx.$queryRaw`
    SELECT * FROM "TrainInstance" 
    WHERE "scheduleId" = ${schedule.id} 
    AND "journeyDate" = ${journeyDate} 
    AND "coachType" = ${coachType}
    FOR UPDATE
  `;
      const instance_Train = instanceArray[0];

      // Check karo seats hain ya nahi
      if (!instance_Train || instance_Train.availableSeats < passengerCount) {
        throw new Error("TRAIN_FULL");
      }

      // 🔥 STEP 2: SEAT HOLD (Inventory kam kar do turant)
      // await tx.trainInstance.update({
      //   where: { id: instance_Train.id },
      //   data: { availableSeats: { decrement: passengerCount } }
      // });

      // 3. Update TrainInstance Inventory (Atomic update to prevent overbooking)
      // const updatedInstance = await tx.trainInstance.update({
      //   where: { id: instance.id },
      //   data: {
      //     availableSeats: { decrement: passengerCount },
      //     bookedSeats: { increment: passengerCount },
      //   },
      // });




      // Same formula as Preview API
      const rate = RATE_PER_KM[coachType] || 0.5;
      const baseFarePerPerson = Math.round(dist * rate);
      const taxesPerPerson = Math.round(baseFarePerPerson * 0.05);
      const totalFarePerPerson = baseFarePerPerson + taxesPerPerson;

      const finalTotalFare = passengerCount * totalFarePerPerson;
      // 4. Create Booking
      const booking = await tx.booking.create({
        data: {
          pnr: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
          userId: validUser.id,
          scheduleId: schedule.id,
          trainInstanceId: instance.id,
          journeyDate: journeyDate,
          fromStationId: from,
          toStationId: to,
          status: "PAYMENT_PENDING",
          totalFare: finalTotalFare, // Update price as per your UI
        },
      });


      await tx.trainInstance.update({
        where: { id: booking.trainInstanceId! },
        data: {
          availableSeats: { decrement: passengerCount },
          bookedSeats: { increment: passengerCount },
        }
      });



      // 5. Create Passengers
      const passengerData = passengers.map((p: PassengerInput) => ({
        bookingId: booking.id,
        name: p.name,
        age: typeof p.age === 'string' ? parseInt(p.age) : p.age,
        gender: p.gender,
        status: "PAYMENT_PENDING",
      }));

      await tx.passenger.createMany({ data: passengerData });

      // 6. Payment Record
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: finalTotalFare,
          paymentMode: "ONLINE",
          gatewayTransactionId: `TXN_${randomUUID().split('-')[0].toUpperCase()}`,
          status: "PENDING",
        },
      });

      return { booking, payment };
    }, {
      isolationLevel: "ReadCommitted",
      timeout: 20000,
    });


    if (!result) {
      throw new Error("Transaction failed to return data");
    }
    //Redis 

    // Booking API mein Transaction ke baad:
    const bookingIdStr = result.booking.id.toString();

    // Ye line Redis mein key banayegi aur 15 min (900s) baad 
    // Upstash khud aapke /api/booking/rollback ko hit karega.
    // Transaction ke theek BAAD ye code dalo:


    await qstashClient.publishJSON({
      url: `https://irctc-lilac.vercel.app/api/train/book-ticket/rollback`, // 👈 Apna LIVE Vercel URL yahan dalo
      body: { bookingId: bookingIdStr },
      delay: 120, // 15 minutes (900 seconds)
      retries: 3,  // Agar server down ho toh 3 baar koshish karega
    });

    return NextResponse.json(serialize({
      success: true,
      pnr: result?.booking.pnr,
      ticketStatus: "CONFIRMED",
      amount: result?.payment.amount,
      bookingId: result?.booking.id,
      paymentUrl: `/payment/process?bookingId=${result?.booking.id}`,
    }));

  } catch (err: any) {
    console.error("BOOKING ERROR:", err.message);
    return NextResponse.json({
      error: err.message === "TRAIN_FULL" ? "Train is fully booked" : err.message,
      code: err.message === "TRAIN_FULL" ? "ERR_FULL" : "ERR_INTERNAL"
    }, { status: 400 });
  }
}