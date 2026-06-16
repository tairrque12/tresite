"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Check, XCircle, Loader2, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

const tierPrices: Record<string, number> = {
  platinum: 250,
  gold: 150,
  silver: 100,
  bronze: 50,
  friend: 25,
};

const tierNames: Record<string, string> = {
  platinum: "PLATINUM",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
  friend: "FRIEND",
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "friend";
  const paymentIntent = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  const [logoUploaded, setLogoUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "succeeded" | "failed">("loading");

  const showLogoUpload = tier === "platinum" || tier === "gold";

  useEffect(() => {
    // Verify payment status
    const verifyPayment = async () => {
      // If no payment_intent in URL, payment wasn't completed
      if (!paymentIntent) {
        setPaymentStatus("failed");
        return;
      }

      // Check redirect_status from Stripe
      if (redirectStatus === "succeeded") {
        setPaymentStatus("succeeded");
        // Fire confetti only on confirmed success
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#1e6b3a", "#2d8a4e", "#ffffff"],
        });
      } else if (redirectStatus === "failed" || redirectStatus === "canceled") {
        setPaymentStatus("failed");
      } else {
        // For other cases (like Cash App redirect without completion), verify with API
        try {
          const response = await fetch(`/api/verify-payment?payment_intent=${paymentIntent}`);
          const result = await response.json();

          if (result.status === "succeeded") {
            setPaymentStatus("succeeded");
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#1e6b3a", "#2d8a4e", "#ffffff"],
            });
          } else {
            setPaymentStatus("failed");
          }
        } catch {
          setPaymentStatus("failed");
        }
      }
    };

    verifyPayment();
  }, [paymentIntent, redirectStatus]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("tier", tier);

    try {
      await fetch("/api/sponsor-logo", {
        method: "POST",
        body: formData,
      });
      setLogoUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setUploading(false);
  };

  // Loading state
  if (paymentStatus === "loading") {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <Loader2 className="w-16 h-16 text-[#2d8a4e] animate-spin mx-auto mb-8" />
        <h1 className="font-display text-3xl text-white mb-4">
          VERIFYING PAYMENT...
        </h1>
        <p className="font-body text-gray-400">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  // Payment failed or not completed
  if (paymentStatus === "failed") {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="font-display text-4xl text-white mb-4">
          PAYMENT NOT COMPLETED
        </h1>

        <p className="font-body text-gray-400 mb-8">
          Your payment was not completed. This can happen if you closed the payment window
          or if there was an issue with the payment method.
        </p>

        <Link
          href="/sponsors"
          className="inline-flex items-center gap-2 bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          TRY AGAIN
        </Link>
      </div>
    );
  }

  // Payment succeeded
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 bg-[#1e6b3a] rounded-full flex items-center justify-center mx-auto mb-8">
        <Check className="w-10 h-10 text-white" />
      </div>

      <h1 className="font-display text-5xl text-white mb-4">
        THANK YOU FOR INVESTING
      </h1>

      <p className="font-display text-2xl text-[#2d8a4e] mb-2">
        {tierNames[tier]} SPONSOR
      </p>

      <p className="font-display text-4xl text-white mb-8">
        ${tierPrices[tier]}.00
      </p>

      <p className="font-body text-gray-400 mb-12">
        Clifford Story, III will be in touch within 24 hours.
      </p>

      {showLogoUpload && !logoUploaded && (
        <div className="border border-[#1e6b3a]/30 p-8">
          <h3 className="font-display text-white text-xl mb-4">
            UPLOAD YOUR LOGO
          </h3>
          <p className="font-body text-gray-400 text-sm mb-6">
            Upload your logo for placement on event materials.
          </p>
          <label className="block w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider py-4 cursor-pointer transition-colors">
            {uploading ? "UPLOADING..." : "SELECT LOGO FILE"}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {logoUploaded && (
        <div className="border border-[#1e6b3a] p-8">
          <p className="font-display text-[#2d8a4e] text-xl">
            LOGO UPLOADED SUCCESSFULLY!
          </p>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Suspense
        fallback={
          <div className="max-w-lg mx-auto px-6 py-24 text-center">
            <Loader2 className="w-16 h-16 text-[#2d8a4e] animate-spin mx-auto mb-8" />
            <p className="text-gray-400">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
