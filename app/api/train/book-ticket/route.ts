import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// BigInt Serialization Helper
function serializeBigInt(data: any) {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}
const RATE_PER_KM: Record<string, number> = {
  SL: 0.6,
  AC3: 1.5,
  AC2: 2.2,
  AC1: 3.5,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromCode = searchParams.get("from"); 
    const toCode = searchParams.get("to");     
    const date = searchParams.get("date"); // "2026-02-27"
    const requestedClass = searchParams.get("class") === "All Classes" ? null : searchParams.get("class");

    if (!fromCode || !toCode || !date) {
      return NextResponse.json({ success: false, message: "Missing params" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    const dayOfWeek = parsedDate.getDay(); // 0-6

    // 1. Fetching Trains with Routes and Schedules
    const trains = await prisma.train.findMany({
      where: {
        AND: [
          { routes: { some: { stationId: fromCode } } },
          { routes: { some: { stationId: toCode } } },
          {
            schedules: {
              some: {
                daysOfWeek: { has: dayOfWeek },
                startDate: { lte: parsedDate },
                OR: [
                  { endDate: null },
                  { endDate: { gte: parsedDate } }
                ],
                status: "RUNNING"
              }
            }
          }
        ]
      },
      include: {
        routes: {
          orderBy: { sequence: 'asc' }
        },
        schedules: {
          where: {
            daysOfWeek: { has: dayOfWeek },
            status: "RUNNING"
          },
          include: {
            trainInstances: {
              where: {
                journeyDate: parsedDate,
                ...(requestedClass && { coachType: requestedClass })
              }
            }
          }
        }
      }
    });

    // 

    // 2. Logic to filter correct direction and calculate meta-data
    const records = trains.map((train) => {
      const fromRoute = train.routes.find(r => r.stationId === fromCode);
      const toRoute = train.routes.find(r => r.stationId === toCode);

      // Validate direction (Source sequence must be less than Destination sequence)
      if (!fromRoute || !toRoute || fromRoute.sequence >= toRoute.sequence) {
        return null;
      }

      // Calculation for Duration
      // Distance-based duration logic (can be replaced with time diff logic)
      const dist = toRoute.distanceFromStart - fromRoute.distanceFromStart;
      // const dayGap = toRoute.day - fromRoute.day; // Assuming day logic exists in Route (or logic it)
      
      const arrivalDate = new Date(parsedDate);
      // Logic: If toRoute.sequence is much later, it might be next day
      // Based on your schema, we use sequences or specific 'day' field if added.
      // For now, assuming day 1 to day 2 logic:
      arrivalDate.setDate(arrivalDate.getDate() + (toRoute.sequence > fromRoute.sequence && fromRoute.departureTime! > toRoute.arrivalTime! ? 1 : 0));

      // 3. Availability from TrainInstance
      const instance = train.schedules[0]?.trainInstances[0];

      return {
        trainNo: train.trainNo,
        name: train.name,
        type: train.type,
        departure: train.departureTime, // Base train time
        arrival: train.arrivalTime,
        duration: `${Math.floor(dist / 50)}h ${dist % 50}m`, // Example duration logic
        fromStn: fromCode,
        toStn: toCode,
        journeyDate: date,
        destinationDate: arrivalDate.toISOString().split('T')[0],
        dayCount: arrivalDate.getDate() - parsedDate.getDate(),
        availability: {
          coachType: instance?.coachType || requestedClass || "SL",
          status: (instance?.availableSeats ?? 0) > 0 ? "AVAILABLE" : "WL",
          count: instance?.availableSeats ?? 0
        },
        fare: 250 + (RATE_PER_KM[instance?.coachType || requestedClass || "SL"] || 0) * 1.5 // Dynamic fare based on distance
      };
    }).filter(Boolean);

    return NextResponse.json(serializeBigInt({ success: true, record: records }));

  } catch (error: any) {
    console.error("Search Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}