"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, CreditCard, Banknote, Loader2, Phone } from "lucide-react";
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

interface TierConfig {
  name: string;
  price: number;
  subtitle: string;
  fields: string[];
}

const tiers: Record<string, TierConfig> = {
  platinum: {
    name: "PLATINUM",
    price: 250,
    subtitle: "THE MVP SPONSOR",
    fields: ["businessName", "contactName", "email", "phone", "website", "logoNote"],
  },
  gold: {
    name: "GOLD",
    price: 150,
    subtitle: "THE LEADERSHIP SPONSOR",
    fields: ["businessName", "contactName", "email", "phone", "website"],
  },
  silver: {
    name: "SILVER",
    price: 100,
    subtitle: "THE TEAM BUILDER SPONSOR",
    fields: ["businessName", "contactName", "email", "phone"],
  },
  bronze: {
    name: "BRONZE",
    price: 50,
    subtitle: "THE FUTURE SPONSOR",
    fields: ["name", "email", "phone"],
  },
  friend: {
    name: "FRIEND",
    price: 25,
    subtitle: "COMMUNITY SUPPORTER",
    fields: ["name", "email"],
  },
};

const fieldLabels: Record<string, { label: string; type: string; placeholder: string }> = {
  businessName: { label: "Business Name", type: "text", placeholder: "Your Business Name" },
  contactName: { label: "Contact Name", type: "text", placeholder: "Your Full Name" },
  name: { label: "Your Name", type: "text", placeholder: "Your Full Name" },
  email: { label: "Email Address", type: "email", placeholder: "you@example.com" },
  phone: { label: "Phone Number", type: "tel", placeholder: "(555) 555-5555" },
  website: { label: "Website (optional)", type: "url", placeholder: "https://yourbusiness.com" },
  logoNote: { label: "Logo Notes (optional)", type: "text", placeholder: "Any notes about your logo submission" },
};

interface SponsorFormData {
  [key: string]: string;
}

function SponsorForm({
  tier,
  onFormComplete,
}: {
  tier: TierConfig;
  onFormComplete: (data: SponsorFormData) => void;
}) {
  const [formData, setFormData] = useState<SponsorFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    tier.fields.forEach((field) => {
      const isOptional = field === "website" || field === "logoNote";
      if (!isOptional && !formData[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onFormComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h3 className="font-display text-white text-xl mb-4">SPONSOR INFORMATION</h3>
      {tier.fields.map((field) => {
        const config = fieldLabels[field];
        return (
          <div key={field}>
            <label className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block">
              {config.label}
            </label>
            <input
              type={config.type}
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={config.placeholder}
              className={`w-full bg-[#111] border ${
                errors[field] ? "border-red-500" : "border-[#1e6b3a]/30"
              } focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3`}
            />
            {errors[field] && (
              <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
            )}
          </div>
        );
      })}
      <button
        type="submit"
        className="w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider py-4 transition-colors mt-6"
      >
        CONTINUE TO PAYMENT →
      </button>
    </form>
  );
}

function PaymentForm({
  tierKey,
  formData,
}: {
  tierKey: string;
  formData: SponsorFormData;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // Send sponsor info to Clifford before processing payment
    try {
      await fetch("/api/sponsor-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierKey,
          paymentMethod: "card",
          ...formData,
        }),
      });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }

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
      <h3 className="font-display text-white text-xl mb-4">PAYMENT DETAILS</h3>
      <div className="bg-[#111] border border-[#1e6b3a]/30 p-6">
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
  const [formData, setFormData] = useState<SponsorFormData | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleCardSelection = () => {
    setPaymentMethod("card");
    setClientSecret(null);
    setFormData(null);
    setShowPaymentForm(false);
  };

  const handleCashSelection = () => {
    setPaymentMethod("cash");
    setClientSecret(null);
    setFormData(null);
    setShowPaymentForm(false);
  };

  const handleFormComplete = async (data: SponsorFormData) => {
    setFormData(data);

    if (paymentMethod === "card") {
      setIsLoadingPayment(true);
      try {
        const response = await fetch("/api/sponsor-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: tierKey }),
        });

        const result = await response.json();
        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
          setShowPaymentForm(true);
        }
      } catch (err) {
        console.error("Failed to create payment intent:", err);
      }
      setIsLoadingPayment(false);
    } else if (paymentMethod === "cash") {
      // Send notification to Clifford for cash payment
      try {
        await fetch("/api/sponsor-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier: tierKey,
            paymentMethod: "cash (in-person)",
            ...data,
          }),
        });
      } catch (err) {
        console.error("Failed to send notification:", err);
      }
      setShowPaymentForm(true);
    }
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
            <span className="font-display text-white text-xl block">PAY WITH CARD</span>
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

      {/* Sponsor Form - shows after selecting payment method, before payment */}
      {paymentMethod && !showPaymentForm && (
        <SponsorForm
          tier={tier}
          onFormComplete={handleFormComplete}
        />
      )}

      {/* Loading state while creating payment intent */}
      {paymentMethod === "card" && isLoadingPayment && (
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-body">Loading payment form...</span>
        </div>
      )}

      {/* Card Payment Form */}
      {paymentMethod === "card" && showPaymentForm && clientSecret && formData && (
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
          <PaymentForm tierKey={tierKey} formData={formData} />
        </Elements>
      )}

      {/* Cash Payment Confirmation */}
      {paymentMethod === "cash" && showPaymentForm && formData && (
        <div className="mt-8 border border-[#1e6b3a] p-6 bg-[#1e6b3a]/10">
          <h3 className="font-display text-white text-xl mb-4">INFORMATION SUBMITTED!</h3>
          <p className="font-body text-gray-300 mb-4">
            Clifford Story, III has been notified of your sponsorship interest. Reach out to him directly to arrange payment:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#2d8a4e]" />
              <a
                href="tel:706-330-4198"
                className="font-display text-white text-xl hover:text-[#2d8a4e] transition-colors"
              >
                (706) 330-4198
              </a>
            </div>
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
