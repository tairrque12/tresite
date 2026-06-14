"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const SPONSOR_DEADLINE = new Date("2026-07-01T00:00:00-05:00");

function calculateTimeLeft() {
  const now = new Date();
  const diff = SPONSOR_DEADLINE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function useReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function AnimatedElement({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ${className}`}
      style={{
        clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function DeadlineCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const boxes = [
    { value: timeLeft.days, label: "DAYS" },
    { value: timeLeft.hours, label: "HRS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEC" },
  ];

  return (
    <div data-testid="sponsor-countdown">
      <div className="flex gap-4">
        {boxes.map((box) => (
          <div key={box.label} className="text-center">
            <span className="font-display text-4xl text-white block">
              {mounted ? String(box.value).padStart(2, "0") : "--"}
            </span>
            <span className="font-body text-xs text-gray-500">{box.label}</span>
          </div>
        ))}
      </div>
      <p className="font-display text-xs text-gray-600 tracking-widest mt-2">
        UNTIL SPONSOR DEADLINE
      </p>
    </div>
  );
}

const tiers = [
  {
    id: "platinum",
    name: "PLATINUM",
    subtitle: "THE MVP SPONSOR",
    price: 250,
    badge: "LIMITED TO 5",
    benefits: [
      "Business logo featured on official Summit T-shirts",
      "Premier logo placement on all event marketing materials",
      "Logo displayed on event banner and signage",
      "Featured Sponsor Spotlight on social media",
      "Recognition during opening and closing ceremonies",
      "Opportunity to provide items for participant bags",
      "Certificate of Appreciation",
    ],
  },
  {
    id: "gold",
    name: "GOLD",
    subtitle: "THE LEADERSHIP SPONSOR",
    price: 150,
    benefits: [
      "Logo displayed on event signage",
      "Recognition on social media",
      "Recognition during the event",
      "Opportunity to provide items for participant bags",
      "Certificate of Appreciation",
    ],
  },
  {
    id: "silver",
    name: "SILVER",
    subtitle: "THE TEAM BUILDER SPONSOR",
    price: 100,
    benefits: [
      "Business name displayed on event signage",
      "Social media recognition",
      "Recognition during the event",
      "Certificate of Appreciation",
    ],
  },
  {
    id: "bronze",
    name: "BRONZE",
    subtitle: "THE FUTURE SPONSOR",
    price: 50,
    benefits: [
      "Name listed on sponsor board",
      "Social media recognition",
      "Certificate of Appreciation",
    ],
  },
  {
    id: "friend",
    name: "FRIEND",
    subtitle: "COMMUNITY SUPPORTER",
    price: 25,
    benefits: [
      "Name listed on sponsor board",
      "Recognition in event materials",
    ],
  },
];

function TierCard({
  tier,
  index,
}: {
  tier: (typeof tiers)[0];
  index: number;
}) {
  return (
    <AnimatedElement delay={index * 150}>
      <div
        data-testid={`tier-${tier.id}`}
        className="flex border-b border-[#1e6b3a]/20"
      >
        <div className="w-2 bg-[#1e6b3a]" />
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-[#1e6b3a]/20">
            {tier.badge && (
              <span className="inline-block bg-[#1e6b3a] text-white font-display text-xs tracking-widest px-3 py-1 mb-4">
                {tier.badge}
              </span>
            )}
            <h3
              className="font-display text-white leading-none"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              {tier.name}
            </h3>
            <p className="text-[#2d8a4e] text-xs font-body uppercase tracking-widest mt-1">
              {tier.subtitle}
            </p>
            <div className="mt-4 flex items-baseline">
              <span
                className="font-display text-white leading-none"
                style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
              >
                ${tier.price}
              </span>
              <span className="text-[#2d8a4e] text-2xl font-display">.00</span>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-8">
            <div className="space-y-0">
              {tier.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 py-2 border-b border-[#111]"
                >
                  <div className="w-0.5 h-4 bg-[#1e6b3a]" />
                  <span className="font-body text-gray-300 text-sm">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={`/api/checkout?tier=${tier.id}`}
              data-testid={`cta-${tier.id}`}
              className="block w-full mt-6 bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider py-4 text-center transition-colors"
            >
              BECOME A {tier.name} SPONSOR →
            </Link>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await fetch("/api/sponsor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit:", error);
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="font-display text-[#2d8a4e] text-2xl">MESSAGE SENT!</p>
        <p className="font-body text-gray-400 mt-2">
          Tre will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="contact-name"
          className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] disabled:opacity-50 text-white font-display tracking-wider py-4 transition-colors"
      >
        {isSubmitting ? "SENDING..." : "SEND MESSAGE →"}
      </button>
    </form>
  );
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Section 1 — Hero statement */}
      <section className="relative py-24 px-8 md:px-16 border-b border-[#1e6b3a]/30">
        <div className="max-w-6xl">
          <AnimatedElement delay={0}>
            <span className="font-display text-[#2d8a4e] tracking-widest text-sm">
              JULY 1ST DEADLINE
            </span>
          </AnimatedElement>

          <AnimatedElement delay={100}>
            <h1
              className="font-display text-white leading-none mt-4"
              style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
            >
              INVEST IN THE
            </h1>
          </AnimatedElement>
          <AnimatedElement delay={200}>
            <span
              className="block font-display text-[#1e6b3a] leading-none"
              style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
            >
              NEXT GENERATION
            </span>
          </AnimatedElement>

          <AnimatedElement delay={300}>
            <p className="font-body text-gray-400 text-base max-w-lg mt-6">
              Your sponsorship puts your brand in front of athletes, families,
              and community members while directly funding youth development in
              Lanett, AL.
            </p>
          </AnimatedElement>
        </div>

        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2">
          <DeadlineCountdown />
        </div>

        <div className="md:hidden mt-8">
          <DeadlineCountdown />
        </div>
      </section>

      {/* Section 2 — Sponsor tier cards */}
      <section className="pt-16 pb-8 px-8 md:px-16">
        <AnimatedElement delay={0}>
          <h2
            className="font-display text-white"
            style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
          >
            CHOOSE YOUR LEVEL
          </h2>
          <div className="w-20 h-px bg-[#1e6b3a] mt-4" />
        </AnimatedElement>
      </section>

      <section className="max-w-6xl mx-auto">
        {tiers.map((tier, index) => (
          <TierCard key={tier.id} tier={tier} index={index} />
        ))}
      </section>

      {/* Section 3 — Deadline urgency strip */}
      <section className="bg-[#1e6b3a] py-6 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3
              className="font-display text-white"
              style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
            >
              JULY 1ST DEADLINE
            </h3>
            <p className="font-body text-white/80 text-sm mt-1">
              Sponsors must commit by July 1st to be included on event T-shirts
              and printed materials.
            </p>
          </div>
          <a
            href="mailto:cliffstoryiii@gmail.com"
            className="inline-block bg-black text-white font-display tracking-wider px-8 py-3 hover:bg-[#111] transition-colors text-center"
          >
            CONTACT TRE TO SPONSOR
          </a>
        </div>
      </section>

      {/* Section 4 — Current sponsors wall */}
      <section className="px-8 md:px-16 py-16">
        <AnimatedElement delay={0}>
          <h2
            className="font-display text-white"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            CURRENT SPONSORS
          </h2>
          <div className="w-20 h-px bg-[#1e6b3a] mt-4 mb-8" />
        </AnimatedElement>

        <div className="flex flex-wrap gap-0">
          {/* Sweet Feet Academy - Confirmed Partner */}
          <div className="relative w-[200px] h-[100px] border border-[#1e6b3a]/30 bg-[#111] flex items-center justify-center">
            <span className="absolute top-2 right-2 bg-[#1e6b3a] text-white font-display text-[8px] tracking-widest px-2 py-0.5">
              PARTNER
            </span>
            <span className="font-body text-white text-xs text-center">
              SWEET FEET ACADEMY
            </span>
          </div>

          {/* Empty Platinum slots */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[200px] h-[100px] border border-dashed border-[#1e6b3a]/20 bg-[#111] flex items-center justify-center"
            >
              <span className="font-display text-gray-700 text-sm text-center">
                YOUR BRAND HERE
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5 — In-kind / custom contact */}
      <section className="px-8 md:px-16 py-16 border-t border-[#1e6b3a]/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[60%_40%] gap-12">
          <div>
            <AnimatedElement delay={0}>
              <h2
                className="font-display text-white"
                style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
              >
                DIFFERENT IDEA?
              </h2>
            </AnimatedElement>
            <AnimatedElement delay={100}>
              <p className="font-body text-gray-400 text-base max-w-md mt-4">
                Want to donate equipment, meals, or something else? We&apos;re
                open to it. Reach out directly and let&apos;s make it work.
              </p>
            </AnimatedElement>
          </div>

          <AnimatedElement delay={200}>
            <ContactForm />
          </AnimatedElement>
        </div>
      </section>
    </div>
  );
}
