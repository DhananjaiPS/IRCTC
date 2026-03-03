import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    try {
        // Aapne jo naye details bheje hain unhe yahan destructure kiya
        const { bookingId, amount, pnr, origin, destination, transactionId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            // Title mein PNR
                            name: `Railway Ticket | PNR: ${pnr}`,
                            
                            // Description mein Origin aur Destination dikha diya
                            description: `Journey: ${origin} to ${destination} | ID: ${bookingId}`,
                            
                            // Image fix: Agar localhost hai toh ye nahi dikhegi, 
                            // Live hone par automatic utha lega.
                            images: [`${process.env.NEXT_PUBLIC_BASE_URL}/book3.jpg`],
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/ticket/${bookingId}?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/process?bookingId=${bookingId}`,
            
            // Metadata hidden rehta hai par dashboard mein kaam aata hai
            metadata: { 
                bookingId,
                pnr,
                transactionId 
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}