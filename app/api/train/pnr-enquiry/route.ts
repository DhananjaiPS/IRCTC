// app/api/pnr/route.ts
import { NextResponse } from "next/server";
import { checkPNRStatus } from "irctc-connect";

export async function POST(req: Request) {
  try {
    const { pnr } = await req.json();

    if (!pnr || pnr.length !== 10) {
      return NextResponse.json({
        success: false,
        message: "Invalid PNR number"
      }, { status: 400 });
    }

    const result = await checkPNRStatus(pnr);

    if (!result?.success) {
      return NextResponse.json({
        success: false,
        message: result?.error || "PNR service temporarily unavailable"
      }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: "PNR service blocked or unavailable. Try again later."
    }, { status: 502 });
  }
}
