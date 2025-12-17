import { NextResponse } from 'next/server';
import { trackTrain } from 'irctc-connect';

export async function POST(req: Request) {
  try {
    const { trainNo, date } = await req.json();

    if (!trainNo || !date) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const result = await trackTrain(trainNo, date);

    if (result.success) {
      return NextResponse.json(result); 
    } else {
      return NextResponse.json({ success: false, error: result.error || "No data" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}