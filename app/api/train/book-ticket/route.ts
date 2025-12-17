import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Convert BigInt values to string so JSON serialization works
 */
function serializeBigInt(data: any) {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const fromCode = searchParams.get("from");
    const toCode = searchParams.get("to");
    const date = searchParams.get("date");

    // ✅ Validate required params
    if (!fromCode || !toCode || !date) {
      return NextResponse.json(
        { success: false, message: "Missing required search parameters." },
        { status: 400 }
      );
    }

    // ✅ Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date format." },
        { status: 400 }
      );
    }

    // 0 = Sunday, 1 = Monday, ...
    const dayIndex = parsedDate.getDay();

    // ✅ Prisma query (IRCTC-grade logic)
    const res = await prisma.train.findMany({
      where: {
        sourceStationId: fromCode,
        destinationStationId: toCode,

        // Filter trains that actually run on this day
        schedules: {
          some: {
            daysOfWeek: {
              has: dayIndex,
            },
          },
        },
      },
      include: {
        // Include only schedules valid for this day
        schedules: {
          where: {
            daysOfWeek: {
              has: dayIndex,
            },
          },
        },
      },
    });

    // ✅ Serialize BigInt → string
    const safeResponse = serializeBigInt(res);

    return NextResponse.json({
      success: true,
      record: safeResponse,
    });
  } catch (error) {
    console.error("Train search error:", error);

    return NextResponse.json(
      {
        success: false,
        record: [],
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}




//  try {
//         // 1️⃣ Search trains using IRCTC API
//         const searchResult = await searchTrainBetweenStations(fromCode, toCode);

//         if (!searchResult.success || !Array.isArray(searchResult.data) || searchResult.data.length === 0) {
//             return NextResponse.json({ success: true, trains: [] }, { status: 200 });
//         }

//         const trains = searchResult.data;
//         const coachCode = getCoachCode(selectedClass);
//         const formattedDate = date.split('-').reverse().join('-'); // DD-MM-YYYY → YYYY-MM-DD

//         // 2️⃣ Fetch Prisma DB trains
//         const dbTrainNos = trains.map((t: any) => t.train_no);
//         const dbTrains = await prisma.train.findMany({
//             where: { trainNo: { in: dbTrainNos } },
//             include: { schedules: true }
//         });

//         // 3️⃣ Fetch availability & seat matrix for each train
//         const results = await Promise.all(
//             trains.map(async (train: any) => {
//                 let availability: any[] = [];
//                 let fare: any = null;

//                 try {
//                     const availResult = await getAvailability(
//                         train.train_no,
//                         fromCode,
//                         toCode,
//                         formattedDate,
//                         coachCode,
//                         quota
//                     );

//                     if (availResult.success) {
//                         availability = availResult.data.availability;
//                         fare = availResult.data.fare;
//                     }
//                 } catch (err) {
//                     console.error(`Availability error for ${train.train_no}:`, err);
//                 }

//                 // Merge Prisma DB schedules
//                 const dbTrain = dbTrains.find(t => t.trainNo === train.train_no);

//                 return {
//                     trainNumber: train.train_no,
//                     trainName: train.train_name,
//                     departure: train.from_time,
//                     arrival: train.to_time,
//                     duration: train.travel_time,
//                     runningDays: train.running_days,
//                     coach: coachCode,
//                     availability, // array of seat availability per date
//                     fare,         // fare info
//                     schedules: dbTrain?.schedules || [],
//                     // Optional: Build seat matrix from availability
//                     seatMatrix: availability.map(day => ({
//                         date: day.date,
//                         seats: day.availabilityText.split(',').map((s:any) => s.trim()) // e.g., "AVAILABLE 10" → ["AVAILABLE 10"]
//                     }))
//                 };
//             })
//         );

//         return NextResponse.json({ success: true, trains: results }, { status: 200 });

//     } catch (error) {
//         console.error("Train API / DB Error:", error);
//         return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
//     } finally {
//         await prisma.$disconnect();
//     }
