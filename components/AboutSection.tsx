"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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
  direction?: "left" | "right";
  className?: string;
}

function AnimatedElement({
  children,
  delay,
  direction = "right",
  className = "",
}: AnimatedElementProps) {
  const { ref, isVisible } = useIntersectionObserver();
  const translateX = direction === "left" ? "-24px" : "24px";

  return (
    <div
      ref={ref}
      className={`transition-all duration-[600ms] ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : `translateX(${translateX})`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const credentials = [
  { emoji: "🎓", text: "Tuskegee University" },
  { emoji: "📐", text: "Construction Science & Management" },
  { emoji: "⚙️", text: "Project Engineer · Atlanta, GA" },
  { emoji: "🏈", text: "Lanett High School Records Holder" },
];

const stats = [
  { value: "4x", label: "Lanett HS Records" },
  { value: "D1", label: "Level of Training" },
  { value: "QB + WR", label: "Positions Coached" },
  { value: "For Life", label: "Mentor Relationship" },
];

const bioText = `Story's Signal Caller Summit is a space where young athletes can connect with experienced individuals who have played collegiately or professionally — and receive high-level training, develop leadership skills, and learn to read the field of life with wisdom, faith, and boldness. We don't only focus on football. We focus on faith, how we carry ourselves on and off the field, and morale improvement. I do it because people did it for me. I wouldn't be where I am without my mentors pushing me to be better in all aspects. I take pride in being someone these kids can reach out to — not only as an example, but as a resource they can have for the rest of their lives.`;

export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#0a0a0a] py-24 md:py-32 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <AnimatedElement delay={0} direction="left" className="order-2 md:order-1">
          <Image
            src="/images/IMG_0128.jpeg"
            alt="Tre Story on the field"
            width={800}
            height={600}
            className="rounded-2xl object-cover w-full max-h-[600px] ring-2 ring-[#1e6b3a]/40"
          />
        </AnimatedElement>

        <div className="order-1 md:order-2">
          <AnimatedElement delay={0}>
            <p className="text-xs text-[#2d8a4e] uppercase tracking-widest mb-3">
              Founder & Head Coach
            </p>
          </AnimatedElement>

          <AnimatedElement delay={50}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Tre Story
            </h2>
          </AnimatedElement>

          <AnimatedElement delay={100}>
            <div className="flex flex-wrap gap-3 mb-6">
              {credentials.map((cred) => (
                <span
                  key={cred.text}
                  className="bg-[#111] border border-[#1e6b3a]/30 rounded-full px-4 py-2 text-xs text-gray-300"
                >
                  {cred.emoji} {cred.text}
                </span>
              ))}
            </div>
          </AnimatedElement>

          <AnimatedElement delay={150}>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {bioText}
            </p>
          </AnimatedElement>

          <AnimatedElement delay={200}>
            <blockquote
              data-testid="quote"
              className="border-l-4 border-[#2d8a4e] pl-4 mb-8"
            >
              <p className="italic text-gray-400 text-sm mb-2">
                "I take pride in being someone these kids can reach out to — not only as an example, but as a resource they can have for the rest of their lives."
              </p>
              <cite className="text-gray-500 text-xs not-italic">
                — Clifford "Tre" Story Jr., Founder
              </cite>
            </blockquote>
          </AnimatedElement>

          <AnimatedElement delay={250}>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  data-testid="stat-card"
                  className="bg-[#111] border border-[#1e6b3a]/30 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-bold text-[#2d8a4e]">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedElement>

          <AnimatedElement delay={300}>
            <Link
              href="/book"
              className="inline-flex items-center justify-center border border-[#2d8a4e] text-[#2d8a4e] rounded-md hover:bg-[#1e6b3a] hover:text-white transition-colors min-h-[48px] px-8 w-full md:w-auto"
            >
              Book a Consultation
            </Link>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}
