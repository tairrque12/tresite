"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type AudienceType = "parent" | "athlete" | "sponsor" | null;

const audienceContent = {
  default: {
    headline: "SIGNAL CALLER SUMMIT 2026 COMPLETE",
    subtext: "Be the first to know about the next summit",
    ctaText: "JOIN WAITLIST →",
    ctaLink: "/register?waitlist=true",
  },
  parent: {
    headline: "GIVE YOUR ATHLETE THE EDGE",
    subtext:
      "D1-level coaching, character development, and mentorship from Clifford Story III — Tuskegee University athlete and 4x Lanett HS record holder. More than drills: faith, discipline, and life skills.",
    ctaText: "JOIN WAITLIST →",
    ctaLink: "/register?waitlist=true",
  },
  athlete: {
    headline: "TRAIN LIKE YOU MEAN IT",
    subtext:
      "Footwork, throwing mechanics, route running — coached by someone who's been where you want to go. Walk away sharper, stronger, and ready for the next level.",
    ctaText: "JOIN WAITLIST →",
    ctaLink: "/register?waitlist=true",
  },
  sponsor: {
    headline: "INVEST IN THE NEXT GENERATION",
    subtext:
      "Partner with a camp that's shaping young athletes across the Southeast. Get visibility with families who value excellence, faith, and community.",
    ctaText: "VIEW SPONSORSHIP OPTIONS →",
    ctaLink: "/sponsors",
  },
};

const audienceOptions: { value: AudienceType; label: string }[] = [
  { value: "parent", label: "I'M A PARENT" },
  { value: "athlete", label: "I'M AN ATHLETE" },
  { value: "sponsor", label: "I'M A SPONSOR" },
];

function useClipReveal() {
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

interface AnimatedTextProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
}

function AnimatedText({ children, delay, className = "" }: AnimatedTextProps) {
  const { ref, isVisible } = useClipReveal();

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

function useAudienceSelection() {
  const [audience, setAudience] = useState<AudienceType>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("audienceSelection") as AudienceType;
    if (stored && ["parent", "athlete", "sponsor"].includes(stored)) {
      setAudience(stored);
    }
  }, []);

  const selectAudience = (value: AudienceType) => {
    setAudience(value);
    if (value) {
      sessionStorage.setItem("audienceSelection", value);
    } else {
      sessionStorage.removeItem("audienceSelection");
    }
  };

  return { audience, selectAudience };
}

function AudienceSelector({
  selected,
  onSelect,
}: {
  selected: AudienceType;
  onSelect: (value: AudienceType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {audienceOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onSelect(selected === option.value ? null : option.value)}
          className={`font-display text-xs tracking-wider px-3 py-1.5 border transition-colors ${
            selected === option.value
              ? "bg-[#1e6b3a] border-[#1e6b3a] text-white"
              : "border-white/30 text-white/70 hover:border-white/50 hover:text-white"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

const fadeSlide = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function NextSummitCTA({
  audience,
  onSelectAudience,
}: {
  audience: AudienceType;
  onSelectAudience: (value: AudienceType) => void;
}) {
  const content = audience ? audienceContent[audience] : audienceContent.default;

  return (
    <div data-testid="next-summit-cta" className="flex flex-col gap-4">
      <AudienceSelector selected={audience} onSelect={onSelectAudience} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={audience || "default"}
            className="flex flex-col"
            variants={fadeSlide}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display text-xl sm:text-2xl text-white tracking-wide">
              {content.headline}
            </span>
            <span className="font-body text-sm text-gray-400 mt-1 max-w-md">
              {content.subtext}
            </span>
          </motion.div>
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="shrink-0"
        >
          <Link
            href={content.ctaLink}
            className="border border-white/30 text-white font-display tracking-wider px-5 py-2.5 hover:bg-white/10 transition-colors text-sm whitespace-nowrap inline-block"
          >
            {content.ctaText}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function InfoStrip({ audience }: { audience: AudienceType }) {
  const content = audience ? audienceContent[audience] : audienceContent.default;

  const stripText =
    audience === "sponsor"
      ? "PARTNER WITH US TO SHAPE THE NEXT GENERATION"
      : "BE FIRST TO KNOW ABOUT THE NEXT SUMMIT";

  return (
    <div
      data-testid="info-strip"
      className="bg-[#1e6b3a]/90 backdrop-blur-sm"
    >
      <div className="px-8 md:px-16 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={audience || "default"}
            className="font-display text-white tracking-widest text-sm"
            variants={fadeSlide}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {stripText}
          </motion.span>
        </AnimatePresence>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            href={content.ctaLink}
            className="bg-white text-black font-display tracking-wider px-6 py-3 hover:bg-gray-200 transition-colors text-center inline-block"
          >
            {content.ctaText}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { audience, selectAudience } = useAudienceSelection();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/images/group-pic.jpeg"
          alt="Group photo background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-[center_top] md:object-center"
        />
      </motion.div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col pl-8 md:pl-16 pr-4 pt-20">
        {/* Headline section - centered vertically with flex-grow */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatedText delay={0}>
            <span
              className="block font-display leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(48px, 12vw, 160px)" }}
            >
              STORY&apos;S
            </span>
          </AnimatedText>
          <AnimatedText delay={100}>
            <span
              className="block font-display leading-none tracking-tight text-[#1e6b3a]"
              style={{ fontSize: "clamp(48px, 12vw, 160px)" }}
            >
              SIGNAL
            </span>
          </AnimatedText>
          <AnimatedText delay={200}>
            <span
              className="block font-display leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(48px, 12vw, 160px)" }}
            >
              CALLER
            </span>
          </AnimatedText>
          <AnimatedText delay={300}>
            <span
              className="block font-display leading-none tracking-tight text-stroke"
              style={{ fontSize: "clamp(48px, 12vw, 160px)" }}
            >
              SUMMIT
            </span>
          </AnimatedText>
        </div>

        {/* CTA section - fixed at bottom with space for InfoStrip */}
        <div className="pb-20 md:pb-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <NextSummitCTA audience={audience} onSelectAudience={selectAudience} />
            <span className="font-display text-xs tracking-widest text-gray-500">
              PARTNERED WITH SWEET FEET ACADEMY
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <InfoStrip audience={audience} />
      </div>
    </section>
  );
}
