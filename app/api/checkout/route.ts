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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier");

  if (!tier || !tierAmounts[tier]) {
    return NextResponse.redirect(new URL("/sponsors", request.url));
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Signal Caller Summit - ${tierNames[tier]}`,
              description: `Sponsorship for Signal Caller Summit 2026`,
            },
            unit_amount: tierAmounts[tier],
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/sponsors/success?tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/sponsors`,
      metadata: {
        tier,
        event: "Signal Caller Summit 2026",
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }

    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
