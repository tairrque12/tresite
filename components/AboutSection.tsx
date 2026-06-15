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

interface AnimatedImageProps {
  children: React.ReactNode;
  className?: string;
}

function AnimatedImage({ children, className = "" }: AnimatedImageProps) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(1.05)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

const credentials = [
  "Tuskegee University",
  "Construction Science & Management",
  "Project Engineer · Atlanta, GA",
  "Lanett HS Records Holder",
];

const stats = [
  { value: "4x", label: "LANETT HS RECORDS" },
  { value: "D1", label: "LEVEL OF TRAINING" },
  { value: "QB + WR", label: "POSITIONS COACHED" },
  { value: "LIFE", label: "MENTOR RELATIONSHIP" },
];

const bioText = `Story's Signal Caller Summit is a space where young athletes can connect with experienced individuals who have played collegiately or professionally — and receive high-level training, develop leadership skills, and learn to read the field of life with wisdom, faith, and boldness. We don't only focus on football. We focus on faith, how we carry ourselves on and off the field, and morale improvement. I do it because people did it for me. I wouldn't be where I am without my mentors pushing me to be better in all aspects.`;

const quoteText = `I take pride in being someone these kids can reach out to — not only as an example, but as a resource they can have for the rest of their lives.`;

export function AboutSection() {
  return (
    <section id="about" className="bg-black">
      <AnimatedImage className="relative w-full">
        <img
          src="/images/tre by himself .jpeg"
          alt="Clifford Story, III on the field"
          className="w-full object-cover object-top md:object-contain md:bg-black"
          style={{ maxHeight: "400px", height: "auto" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </AnimatedImage>

      <div className="px-4 md:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[40%_60%] gap-12 md:gap-16">
          <div className="overflow-visible pr-2">
            <AnimatedText delay={0}>
              <span
                className="block font-display text-[#1e6b3a] leading-none"
                style={{ fontSize: "clamp(100px, 17vw, 240px)" }}
              >
                TRE
              </span>
            </AnimatedText>
            <AnimatedText delay={100}>
              <span
                className="block font-display text-stroke leading-none"
                style={{ fontSize: "clamp(100px, 17vw, 240px)" }}
              >
                STORY
              </span>
            </AnimatedText>

            <AnimatedText delay={200}>
              <div className="w-full h-px bg-[#1e6b3a] my-8" />
            </AnimatedText>

            <div className="space-y-3">
              {credentials.map((cred, i) => (
                <AnimatedText key={cred} delay={300 + i * 100}>
                  <div className="border-l-2 border-[#1e6b3a] pl-3 py-1">
                    <span className="font-body text-gray-400 text-xs">
                      {cred}
                    </span>
                  </div>
                </AnimatedText>
              ))}
            </div>
          </div>

          <div>
            <AnimatedText delay={100}>
              <h2
                className="font-display text-white leading-none mb-8"
                style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
              >
                FOUNDER
              </h2>
            </AnimatedText>

            <AnimatedText delay={200}>
              <p className="font-body text-gray-300 text-base leading-relaxed mb-10">
                {bioText}
              </p>
            </AnimatedText>

            <AnimatedText delay={300}>
              <div data-testid="quote" className="mb-10">
                <span className="font-display text-8xl text-[#1e6b3a] leading-none block -mb-6">
                  &ldquo;
                </span>
                <p className="font-body italic text-gray-400 text-base leading-relaxed">
                  {quoteText}
                </p>
                <cite className="font-body text-xs text-gray-600 mt-2 not-italic block">
                  — Clifford Story, III, Founder
                </cite>
              </div>
            </AnimatedText>

            <AnimatedText delay={400}>
              <div className="grid grid-cols-2 md:flex md:divide-x md:divide-white/20 mb-10">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    data-testid="stat-card"
                    className={`text-center py-4 md:py-0 md:px-6 md:first:pl-0 ${
                      index < 2 ? "border-b border-[#1e6b3a]/30 md:border-b-0" : ""
                    } ${index % 2 === 0 ? "border-r border-[#1e6b3a]/30 md:border-r-0" : ""}`}
                  >
                    <span className="font-display text-4xl text-white block">
                      {stat.value}
                    </span>
                    <span className="font-body text-xs text-gray-500 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedText>

            <AnimatedText delay={500}>
              <Link
                href="/book"
                className="inline-block font-display text-[#2d8a4e] tracking-widest hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                BOOK A CONSULTATION →
              </Link>
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  );
}
