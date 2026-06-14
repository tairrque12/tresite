import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export async function POST() {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        event: "Signal Caller Summit",
        date: "July 18, 2026",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
