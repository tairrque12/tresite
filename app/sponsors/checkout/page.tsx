"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, CreditCard, Banknote, Loader2, Phone, ExternalLink } from "lucide-react";

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

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tierKey = searchParams.get("tier") || "friend";
  const tier = tiers[tierKey] || tiers.friend;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [formData, setFormData] = useState<SponsorFormData | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentLinkOpened, setPaymentLinkOpened] = useState(false);

  const handleCardSelection = () => {
    setPaymentMethod("card");
    setFormData(null);
    setShowPaymentForm(false);
    setPaymentLinkOpened(false);
  };

  const handleCashSelection = () => {
    setPaymentMethod("cash");
    setFormData(null);
    setShowPaymentForm(false);
    setPaymentLinkOpened(false);
  };

  const handleFormComplete = async (data: SponsorFormData) => {
    setFormData(data);
    setPaymentError(null);

    if (paymentMethod === "card") {
      setIsLoadingPayment(true);
      try {
        // Send sponsor info notification
        await fetch("/api/sponsor-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier: tierKey,
            paymentMethod: "card",
            ...data,
          }),
        });

        // Get Stripe Checkout session URL
        const response = await fetch(`/api/checkout?tier=${tierKey}`);

        if (!response.ok) {
          const result = await response.json();
          setPaymentError(result.error || "Failed to create checkout session");
          setIsLoadingPayment(false);
          return;
        }

        // The checkout API redirects, so we need to get the URL from the redirect
        // Instead, open in new tab
        const checkoutUrl = `/api/checkout?tier=${tierKey}`;
        window.open(checkoutUrl, "_blank");
        setPaymentLinkOpened(true);
        setShowPaymentForm(true);
      } catch (err) {
        console.error("Failed to create checkout session:", err);
        setPaymentError("Failed to connect to payment server. Please try again.");
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

  const handleOpenPaymentLink = () => {
    window.open(`/api/checkout?tier=${tierKey}`, "_blank");
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
            <span className="font-body text-gray-500 text-xs mt-1 block">
              Apple Pay, Google Pay, Cash App, and all major cards accepted on checkout
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

      {/* Error state */}
      {paymentError && (
        <div className="mt-8 p-4 bg-red-900/20 border border-red-500/50 text-red-400 font-body text-sm">
          {paymentError}
        </div>
      )}

      {/* Loading state while creating checkout session */}
      {paymentMethod === "card" && isLoadingPayment && (
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-body">Opening payment page...</span>
        </div>
      )}

      {/* Card Payment - Link opened in new tab */}
      {paymentMethod === "card" && showPaymentForm && paymentLinkOpened && (
        <div className="mt-8 border border-[#1e6b3a] p-6 bg-[#1e6b3a]/10">
          <h3 className="font-display text-white text-xl mb-4">PAYMENT PAGE OPENED</h3>
          <p className="font-body text-gray-300 mb-4">
            A secure Stripe checkout page has opened in a new tab. Complete your payment there.
          </p>
          <p className="font-body text-gray-400 text-sm mb-6">
            After payment, Stripe will confirm your sponsorship. You can close this page.
          </p>
          <button
            onClick={handleOpenPaymentLink}
            className="w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider py-4 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            OPEN PAYMENT PAGE AGAIN
          </button>
          <button
            onClick={() => router.push("/sponsors")}
            className="mt-4 w-full border border-[#1e6b3a]/50 hover:border-[#1e6b3a] text-white font-display tracking-wider py-4 transition-colors"
          >
            BACK TO SPONSORS
          </button>
        </div>
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
