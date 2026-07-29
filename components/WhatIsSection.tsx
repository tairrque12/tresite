"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

interface AnimatedTextProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
}

function AnimatedText({ children, delay, className = "" }: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
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
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-fit"
              >
                <Link
                  href="/register?waitlist=true"
                  className="inline-block bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-4 transition-colors"
                >
                  JOIN WAITLIST →
                </Link>
              </motion.div>
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
