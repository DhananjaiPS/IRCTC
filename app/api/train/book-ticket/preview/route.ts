import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
const RATE_PER_KM: Record<string, number> = {
  SL: 0.6,
  AC3: 1.5,
  AC2: 2.2,
  AC1: 3.5,
};

export async function POST(req: Request) {
  try {
   

    const { trainNo, date, from, to, class: coachType } = await req.json();
    const journeyDate = new Date(date);
    journeyDate.setHours(0, 0, 0, 0);

    const train = await prisma.train.findUnique({
      where: { trainNo },
      include: {
        routes: true,
        schedules: {
          where: {
            status: "RUNNING",
            startDate: { lte: journeyDate },
            OR: [{ endDate: null }, { endDate: { gte: journeyDate } }],
          },
          include: {
            trainInstances: {
              where: { journeyDate, coachType },
            },
          },
        },
      },
    });

    if (!train || !train.schedules.length)
      return NextResponse.json({ success: false, error: "Train not running" });

    const instance = train.schedules[0].trainInstances[0];
    if (!instance)
      return NextResponse.json({ success: false, error: "No inventory" });

    const fromR = train.routes.find((r) => r.stationId === from);
    const toR = train.routes.find((r) => r.stationId === to);

    if (!fromR || !toR)
      return NextResponse.json({ success: false, error: "Invalid route" });

    const distance = Math.abs(toR.distanceFromStart - fromR.distanceFromStart);
    const rate = RATE_PER_KM[coachType] || 0.5;

    const baseFare = Math.round(distance * rate);
    const taxes = Math.round(baseFare * 0.05);
    const totalPerPerson = baseFare + taxes;

    return NextResponse.json({
      success: true,
      preview: {
        train: { no: train.trainNo, name: train.name },
        journey: { from, to, date, coach: coachType },
        fareDetails: {
          baseFare,
          taxes,
          total: totalPerPerson
        },
        availability: {
          status:
            instance.availableSeats > 0
              ? "AVAILABLE"
              : instance.racSeats > 0
                ? "RAC"
                : "WAITLIST",
          count: instance.availableSeats,
        },
        instanceId: instance.id.toString(),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}