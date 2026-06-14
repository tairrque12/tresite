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
  const { tier } = await request.json();

  if (!tier || !tierAmounts[tier]) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
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
  } catch (error) {
    console.error("PaymentIntent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
