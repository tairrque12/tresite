"use client";

import Image from "next/image";
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

function useIntersectionObserver(threshold = 0.1) {
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
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

interface AnimatedElementProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
}

function AnimatedElement({ children, delay, className = "" }: AnimatedElementProps) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
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
      className="flex justify-center gap-3 max-w-xs mx-auto"
    >
      {boxes.map((box) => (
        <div
          key={box.label}
          className="flex flex-col items-center bg-[#111] border border-[#1e6b3a] rounded-lg px-4 py-3"
        >
          <span className="text-white font-bold text-2xl">
            {mounted ? String(box.value).padStart(2, "0") : "--"}
          </span>
          <span className="text-xs text-gray-400">{box.label}</span>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-16">
      <AnimatedElement delay={0} className="mb-6">
        <Image
          src="/images/logo.png"
          alt="Story's Signal Caller Summit"
          width={160}
          height={160}
          className="h-[120px] w-auto md:h-[160px]"
          priority
        />
      </AnimatedElement>

      <AnimatedElement delay={100} className="mb-8">
        <p className="text-[#2d8a4e] text-sm md:text-base uppercase tracking-widest text-center max-w-xs">
          Developing Quarterbacks. Building Leaders. Inspiring Excellence.
        </p>
      </AnimatedElement>

      <AnimatedElement delay={200} className="text-center mb-8">
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-2">
          July 18th, 2026
        </h1>
        <p className="text-gray-400 text-sm mb-1">10:00 AM EST</p>
        <p className="text-gray-300 text-sm mb-1">
          Story Field at Morgan Washburn Stadium
        </p>
        <p className="text-gray-400 text-xs">Lanett, AL</p>
      </AnimatedElement>

      <AnimatedElement delay={300} className="mb-8">
        <CountdownTimer />
      </AnimatedElement>

      <AnimatedElement delay={400} className="flex flex-col md:flex-row gap-4 w-full max-w-xs md:max-w-md mb-8">
        <Link
          href="/register"
          className="min-h-[48px] px-8 bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white rounded-md font-semibold w-full flex items-center justify-center transition-colors"
        >
          Register Now
        </Link>
        <Link
          href="#about"
          className="min-h-[48px] px-8 border border-[#2d8a4e] text-[#2d8a4e] rounded-md font-semibold w-full flex items-center justify-center transition-colors hover:bg-[#2d8a4e]/10"
        >
          Learn More
        </Link>
      </AnimatedElement>

      <AnimatedElement delay={500}>
        <div className="border border-gray-700 text-gray-400 text-xs rounded-full px-4 py-2">
          Partnered with Sweet Feet Academy
        </div>
      </AnimatedElement>
    </section>
  );
}
