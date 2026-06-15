"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";

const photos = [
  {
    src: "/images/group-pic.jpeg",
    alt: "Signal Caller Summit group photo",
    span: "col-span-2 md:col-span-3",
    isHero: true,
  },
  {
    src: "/images/tre by himself .jpeg",
    alt: "Tre Story coaching on the field",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/tre with one guy.jpeg",
    alt: "Tre Story training with an athlete",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/tre with 3 people.jpeg",
    alt: "Tre Story with camp participants",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/tre with family.jpeg",
    alt: "Tre Story with family",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/mp1.JPEG",
    alt: "Signal Caller Summit camp photo",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/mp2.JPEG",
    alt: "Signal Caller Summit camp photo",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/mp3.jpeg",
    alt: "Signal Caller Summit camp photo",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/mp4.JPEG",
    alt: "Signal Caller Summit camp photo",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/mp5.JPEG",
    alt: "Signal Caller Summit camp photo",
    span: "col-span-1",
    isHero: false,
  },
];

function GalleryImage({
  src,
  alt,
  span,
  isHero,
}: {
  src: string;
  alt: string;
  span: string;
  isHero: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const heightClass = isHero
    ? "h-48 md:h-72"
    : "h-48 md:h-56 lg:h-64";

  const objectPosition = isHero ? "object-top" : "object-center";

  return (
    <div
      className={`relative overflow-hidden ${span}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full ${heightClass} object-cover ${objectPosition} transition-transform duration-300`}
        style={{ transform: isHovered ? "scale(1.02)" : "scale(1)" }}
      />
      <div
        className="absolute inset-0 bg-[#1e6b3a]/20 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <section className="pt-14 py-16 px-6 md:px-16">
        <h1
          className="font-display text-white mb-2"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
        >
          FROM THE FIELD
        </h1>
        <span className="font-display text-[#2d8a4e] tracking-widest text-sm block mb-8">
          SIGNAL CALLER SUMMIT 2025
        </span>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {photos.map((photo) => (
            <GalleryImage
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              span={photo.span}
              isHero={photo.isHero}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
