"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

interface AnimatedTextProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
}

function AnimatedText({ children, delay, className = "" }: AnimatedTextProps) {
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

const tracks = [
  {
    title: "QB TRAINING",
    description:
      "Footwork, throwing mechanics, pocket presence, and reading defenses with coaches who've played at the highest levels.",
    number: "01",
  },
  {
    title: "WR TRAINING",
    description:
      "Route running, catching technique, release moves, and building chemistry with quarterbacks.",
    number: "02",
  },
  {
    title: "LEADERSHIP",
    description:
      "Decision-making, communication, team motivation, and what it means to lead on and off the field.",
    number: "03",
  },
  {
    title: "CHARACTER",
    description:
      "Faith, discipline, accountability, and building the mental foundation that separates good from great.",
    number: "04",
  },
];

export function WhatIsSection() {
  return (
    <section id="what-is" className="bg-black py-24 md:py-32">
      <div className="px-8 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <AnimatedText delay={0}>
              <span className="font-display text-[#2d8a4e] tracking-widest text-sm">
                WHAT IS
              </span>
            </AnimatedText>
            <AnimatedText delay={100}>
              <h2
                className="font-display text-white leading-none"
                style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
              >
                SIGNAL CALLER SUMMIT
              </h2>
            </AnimatedText>
          </div>

          <div className="flex flex-col justify-end">
            <AnimatedText delay={200}>
              <p className="font-body text-gray-300 text-lg leading-relaxed mb-8">
                A one-day intensive camp designed for quarterbacks and wide
                receivers who want more than just drills. We combine elite-level
                football training with leadership development and character
                building — because the best players are built from the inside
                out.
              </p>
            </AnimatedText>
            <AnimatedText delay={300}>
              <Link
                href="/register"
                className="inline-block bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-4 transition-colors w-fit"
              >
                REGISTER NOW →
              </Link>
            </AnimatedText>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1e6b3a]/30">
          {tracks.map((track, i) => (
            <AnimatedText key={track.title} delay={400 + i * 100}>
              <div
                data-testid="track-card"
                className="bg-black p-8 h-full flex flex-col"
              >
                <span className="font-display text-[#1e6b3a] text-6xl leading-none mb-4">
                  {track.number}
                </span>
                <h3 className="font-display text-white text-2xl tracking-wider mb-4">
                  {track.title}
                </h3>
                <p className="font-body text-gray-400 text-sm leading-relaxed">
                  {track.description}
                </p>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
}
