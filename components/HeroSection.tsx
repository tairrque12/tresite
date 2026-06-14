"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const CAMP_DATE = new Date("2026-07-18T10:00:00-05:00");

function calculateTimeLeft() {
  const now = new Date();
  const diff = CAMP_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

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

function CountdownTimer() {
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
    <div
      data-testid="countdown-timer"
      className="flex divide-x divide-white/20"
    >
      {boxes.map((box) => (
        <div key={box.label} className="px-4 first:pl-0 text-center">
          <span className="font-display text-5xl text-white">
            {mounted ? String(box.value).padStart(2, "0") : "--"}
          </span>
          <span className="block font-body text-xs text-gray-400 mt-1">
            {box.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black">
      <div
        className="absolute inset-0 z-0 bg-[#111] flex items-center justify-center"
        role="img"
        aria-label="Team group photo background"
      >
        <span className="font-body text-gray-500 text-sm">IMG_0162.jpeg</span>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
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
            <CountdownTimer />
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
            <div className="flex items-center divide-x divide-white/30">
              <span className="pr-4 font-display text-white tracking-widest text-sm">
                JULY 18, 2026
              </span>
              <span className="px-4 font-display text-white tracking-widest text-sm">
                10:00 AM EST
              </span>
              <span className="pl-4 font-display text-white tracking-widest text-sm">
                LANETT, AL
              </span>
            </div>
            <Link
              href="/register"
              className="bg-white text-black font-display tracking-wider px-6 py-3 hover:bg-gray-200 transition-colors text-center"
            >
              REGISTER NOW →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
