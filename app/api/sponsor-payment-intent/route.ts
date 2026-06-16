import { NextResponse } from "next/server";
import Stripe from "stripe";

const tierAmounts: Record<string, number> = {
  platinum: 25000,
  gold: 15000,
  silver: 10000,
  bronze: 5000,
  friend: 2500,
};

const tierNames: Record<string, string> = {
  platinum: "Platinum Sponsor",
  gold: "Gold Sponsor",
  silver: "Silver Sponsor",
  bronze: "Bronze Sponsor",
  friend: "Friend of the Summit",
};

export async function POST(request: Request) {
  console.log("Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("Key prefix:", process.env.STRIPE_SECRET_KEY?.substring(0, 8));

  let tier: string;
  try {
    const body = await request.json();
    tier = body.tier;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!tier || !tierAmounts[tier]) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured - missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: tierAmounts[tier],
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        tier,
        tierName: tierNames[tier],
        event: "Signal Caller Summit 2026",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
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
