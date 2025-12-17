import { NextRequest, NextResponse } from "next/server";
import {
  searchTrainBetweenStations,
  getTrainInfo,
} from "irctc-connect";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /**
     * ==========================
     * SEARCH BY TRAIN NUMBER
     * ==========================
     * RETURNS FULL ROUTE
     */
    if (body.trainNo) {
      const result = await getTrainInfo(body.trainNo);

      if (!result?.success || !result?.data?.trainInfo) {
        return NextResponse.json({
          success: false,
          message: "Invalid train number",
        });
      }

      const info = result.data.trainInfo;

      return NextResponse.json({
        success: true,
        data: {
          trains: [
            {
              trainNo: info.train_no,
              trainName: info.train_name,
              from: info.from_stn_name,
              fromCode: info.from_stn_code,
              to: info.to_stn_name,
              toCode: info.to_stn_code,
              fromTime: info.from_time,
              toTime: info.to_time,
              travelTime: info.duration,
              runningDays: info.running_days,
              route: result.data.route || [], // ✅ FULL ROUTE
            },
          ],
        },
      });
    }

    /**
     * ==========================
     * SEARCH BY STATIONS
     * ==========================
     * DOES NOT RETURN ROUTE (IRCTC BEHAVIOR)
     */
    if (body.fromStationCode && body.toStationCode) {
      const result = await searchTrainBetweenStations(
        body.fromStationCode,
        body.toStationCode
      );

      const trains =
        result?.data?.trains ||
        result?.data?.trainList ||
        (Array.isArray(result?.data) ? result.data : []);

      if (!result?.success || trains.length === 0) {
        return NextResponse.json({
          success: false,
          message: result.data || "No trains found",
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          from: body.fromStationCode,
          to: body.toStationCode,
          trains: trains.map((t: any) => ({
            trainNo: t.trainNumber || t.train_no,
            trainName: t.trainName || t.train_name,
            from: t.from || "",
            fromCode: body.fromStationCode,
            to: t.to || "",
            toCode: body.toStationCode,
            fromTime: t.departure,
            toTime: t.arrival,
            travelTime: t.duration,
            runningDays: t.runningDays,
            route: result.data.route || [], // ❌ NO ROUTE FOR STATION SEARCH
          })),
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid search parameters",
    });
  } catch (error) {
    console.error("IRCTC API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
