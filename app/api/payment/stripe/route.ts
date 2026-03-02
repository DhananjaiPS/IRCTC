import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { bookingId, amount, pnr } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "inr",
        product_data: { name: `Food Order - PNR: ${pnr}` },
        unit_amount: amount * 100, // Amount in Paisa
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/ticket/${bookingId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?bookingId=${bookingId}`,
    metadata: { bookingId },
  });

  return NextResponse.json({ url: session.url });
}