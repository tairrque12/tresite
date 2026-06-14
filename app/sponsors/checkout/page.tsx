"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, CreditCard, Banknote, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const tiers: Record<string, { name: string; price: number; subtitle: string }> = {
  platinum: { name: "PLATINUM", price: 250, subtitle: "THE MVP SPONSOR" },
  gold: { name: "GOLD", price: 150, subtitle: "THE LEADERSHIP SPONSOR" },
  silver: { name: "SILVER", price: 100, subtitle: "THE TEAM BUILDER SPONSOR" },
  bronze: { name: "BRONZE", price: 50, subtitle: "THE FUTURE SPONSOR" },
  friend: { name: "FRIEND", price: 25, subtitle: "COMMUNITY SUPPORTER" },
};

function PaymentForm({ tierKey }: { tierKey: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/sponsors/success?tier=${tierKey}`,
      },
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="bg-[#111] border border-[#1e6b3a]/30 p-6 rounded">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 text-red-400 font-body text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-6 w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display tracking-wider py-4 transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            PROCESSING...
          </>
        ) : (
          `PAY NOW`
        )}
      </button>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tierKey = searchParams.get("tier") || "friend";
  const tier = tiers[tierKey] || tiers.friend;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const handleCardSelection = async () => {
    setPaymentMethod("card");
    setIsLoadingPayment(true);

    try {
      const response = await fetch("/api/sponsor-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      console.error("Failed to create payment intent:", err);
    }

    setIsLoadingPayment(false);
  };

  const handleCashSelection = () => {
    setPaymentMethod("cash");
    setClientSecret(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/sponsors"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-body text-sm">Back to Sponsors</span>
      </Link>

      <div className="border border-[#1e6b3a]/30 p-8 mb-8">
        <span className="text-[#2d8a4e] text-xs font-body uppercase tracking-widest">
          {tier.subtitle}
        </span>
        <h1
          className="font-display text-white leading-none mt-2"
          style={{ fontSize: "clamp(48px, 8vw, 72px)" }}
        >
          {tier.name}
        </h1>
        <div className="flex items-baseline mt-4">
          <span
            className="font-display text-white leading-none"
            style={{ fontSize: "clamp(56px, 10vw, 96px)" }}
          >
            ${tier.price}
          </span>
          <span className="text-[#2d8a4e] text-3xl font-display">.00</span>
        </div>
      </div>

      <h2 className="font-display text-white text-2xl mb-6">SELECT PAYMENT METHOD</h2>

      <div className="space-y-4">
        <button
          onClick={handleCardSelection}
          disabled={isLoadingPayment}
          className={`w-full flex items-center gap-4 p-6 border transition-all group ${
            paymentMethod === "card"
              ? "border-[#1e6b3a] bg-[#1e6b3a]/10"
              : "border-[#1e6b3a]/30 hover:border-[#1e6b3a] bg-[#111] hover:bg-[#1a1a1a]"
          }`}
        >
          <div className="w-12 h-12 bg-[#1e6b3a] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-display text-white text-xl block">
              {isLoadingPayment ? "LOADING..." : "PAY WITH CARD"}
            </span>
            <span className="font-body text-gray-400 text-sm">
              Card, Apple Pay, Google Pay
            </span>
          </div>
          {paymentMethod !== "card" && (
            <span className="font-display text-[#2d8a4e] text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          )}
        </button>

        <button
          onClick={handleCashSelection}
          className={`w-full flex items-center gap-4 p-6 border transition-all group ${
            paymentMethod === "cash"
              ? "border-[#1e6b3a] bg-[#1e6b3a]/10"
              : "border-[#1e6b3a]/30 hover:border-[#1e6b3a] bg-[#111] hover:bg-[#1a1a1a]"
          }`}
        >
          <div className="w-12 h-12 bg-[#1e6b3a] flex items-center justify-center">
            <Banknote className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-display text-white text-xl block">PAY IN PERSON</span>
            <span className="font-body text-gray-400 text-sm">
              Cash, check, or card at the event
            </span>
          </div>
          {paymentMethod !== "cash" && (
            <span className="font-display text-[#2d8a4e] text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          )}
        </button>
      </div>

      {paymentMethod === "card" && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#1e6b3a",
                colorBackground: "#111",
                colorText: "#ffffff",
                colorDanger: "#ef4444",
                fontFamily: "Inter, system-ui, sans-serif",
                borderRadius: "0px",
              },
            },
          }}
        >
          <PaymentForm tierKey={tierKey} />
        </Elements>
      )}

      {paymentMethod === "card" && isLoadingPayment && (
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-body">Loading payment form...</span>
        </div>
      )}

      {paymentMethod === "cash" && (
        <div className="mt-8 border border-[#1e6b3a] p-6 bg-[#1e6b3a]/10">
          <h3 className="font-display text-white text-xl mb-4">PAY IN PERSON</h3>
          <p className="font-body text-gray-300 mb-4">
            Contact Tre directly to arrange payment:
          </p>
          <div className="space-y-2 mb-6">
            <p className="font-body text-white">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:cliffstoryiii@gmail.com"
                className="text-[#2d8a4e] hover:underline"
              >
                cliffstoryiii@gmail.com
              </a>
            </p>
            <p className="font-body text-white">
              <strong>Amount:</strong> ${tier.price}.00
            </p>
            <p className="font-body text-white">
              <strong>Tier:</strong> {tier.name} Sponsor
            </p>
          </div>
          <p className="font-body text-gray-400 text-sm">
            Payment must be received by July 1st to be included on event materials.
          </p>
          <button
            onClick={() => router.push("/sponsors")}
            className="mt-6 w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider py-4 transition-colors"
          >
            BACK TO SPONSORS
          </button>
        </div>
      )}
    </div>
  );
}

export default function SponsorCheckoutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-14">
        <Suspense
          fallback={
            <div className="max-w-2xl mx-auto px-6 py-12">
              <p className="text-gray-400">Loading...</p>
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
