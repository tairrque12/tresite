import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  console.log("Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("Key prefix:", process.env.STRIPE_SECRET_KEY?.substring(0, 8));

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured - missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
  } catch (error: unknown) {
    console.error("Payment intent error:", error);
    const stripeError = error as { message?: string; type?: string; code?: string };
    return NextResponse.json(
      {
        error: stripeError.message || "Failed to create payment intent",
        type: stripeError.type,
        code: stripeError.code,
      },
      { status: 500 }
    );
  }
}
