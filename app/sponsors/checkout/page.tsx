"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, CreditCard, Banknote } from "lucide-react";

const tiers: Record<string, { name: string; price: number; subtitle: string }> = {
  platinum: { name: "PLATINUM", price: 250, subtitle: "THE MVP SPONSOR" },
  gold: { name: "GOLD", price: 150, subtitle: "THE LEADERSHIP SPONSOR" },
  silver: { name: "SILVER", price: 100, subtitle: "THE TEAM BUILDER SPONSOR" },
  bronze: { name: "BRONZE", price: 50, subtitle: "THE FUTURE SPONSOR" },
  friend: { name: "FRIEND", price: 25, subtitle: "COMMUNITY SUPPORTER" },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tierKey = searchParams.get("tier") || "friend";
  const tier = tiers[tierKey] || tiers.friend;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripeCheckout = () => {
    setIsProcessing(true);
    window.location.href = `/api/checkout?tier=${tierKey}`;
  };

  const handleCashSelection = () => {
    setPaymentMethod("cash");
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
          onClick={handleStripeCheckout}
          disabled={isProcessing}
          className="w-full flex items-center gap-4 p-6 border border-[#1e6b3a]/30 hover:border-[#1e6b3a] bg-[#111] hover:bg-[#1a1a1a] transition-all group"
        >
          <div className="w-12 h-12 bg-[#1e6b3a] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-display text-white text-xl block">
              {isProcessing ? "REDIRECTING..." : "PAY WITH CARD"}
            </span>
            <span className="font-body text-gray-400 text-sm">
              Secure checkout via Stripe
            </span>
          </div>
          <span className="font-display text-[#2d8a4e] text-xl group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        <button
          onClick={handleCashSelection}
          className="w-full flex items-center gap-4 p-6 border border-[#1e6b3a]/30 hover:border-[#1e6b3a] bg-[#111] hover:bg-[#1a1a1a] transition-all group"
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
          <span className="font-display text-[#2d8a4e] text-xl group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>

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
