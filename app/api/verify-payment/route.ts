import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get("payment_intent");

  if (!paymentIntentId) {
    return NextResponse.json({ status: "failed", error: "No payment intent" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ status: "failed", error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ status: "failed", error: "Verification failed" }, { status: 500 });
  }
}
