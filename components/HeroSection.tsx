"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

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

function NextSummitCTA() {
  return (
    <div data-testid="next-summit-cta" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex flex-col">
        <span className="font-display text-2xl sm:text-3xl text-white tracking-wide">
          SIGNAL CALLER SUMMIT 2026 COMPLETE
        </span>
        <span className="font-body text-sm text-gray-400 mt-1">
          Be the first to know about the next summit
        </span>
      </div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          href="/register?waitlist=true"
          className="border border-white/30 text-white font-display tracking-wider px-5 py-2.5 hover:bg-white/10 transition-colors text-sm whitespace-nowrap inline-block"
        >
          JOIN WAITLIST →
        </Link>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
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

      <div className="relative z-10 min-h-screen flex flex-col justify-center pl-8 md:pl-16 pr-4 pt-20 pb-48">
        <AnimatedText delay={0}>
          <span
            className="block font-display leading-none tracking-tight text-white"
            style={{ fontSize: "clamp(72px, 14vw, 160px)" }}
          >
            STORY&apos;S
          </span>
        </AnimatedText>
        <AnimatedText delay={100}>
          <span
            className="block font-display leading-none tracking-tight text-[#1e6b3a]"
            style={{ fontSize: "clamp(72px, 14vw, 160px)" }}
          >
            SIGNAL
          </span>
        </AnimatedText>
        <AnimatedText delay={200}>
          <span
            className="block font-display leading-none tracking-tight text-white"
            style={{ fontSize: "clamp(72px, 14vw, 160px)" }}
          >
            CALLER
          </span>
        </AnimatedText>
        <AnimatedText delay={300}>
          <span
            className="block font-display leading-none tracking-tight text-stroke"
            style={{ fontSize: "clamp(72px, 14vw, 160px)" }}
          >
            SUMMIT
          </span>
        </AnimatedText>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="px-8 md:px-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <NextSummitCTA />
            <span className="font-display text-xs tracking-widest text-gray-500">
              PARTNERED WITH SWEET FEET ACADEMY
            </span>
          </div>
        </div>

        <div
          data-testid="info-strip"
          className="bg-[#1e6b3a]/90 backdrop-blur-sm"
        >
          <div className="px-8 md:px-16 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="font-display text-white tracking-widest text-sm">
              BE FIRST TO KNOW ABOUT THE NEXT SUMMIT
            </span>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/register?waitlist=true"
                className="bg-white text-black font-display tracking-wider px-6 py-3 hover:bg-gray-200 transition-colors text-center inline-block"
              >
                JOIN WAITLIST →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
