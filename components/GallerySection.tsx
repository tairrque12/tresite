"use client";

import { useState } from "react";

const photos = [
  {
    src: "/images/tre by himself.jpeg",
    alt: "Tre Story coaching on the field",
    span: "col-span-1",
  },
  {
    src: "/images/tre with one guy.jpeg",
    alt: "Tre Story training with an athlete",
    span: "col-span-1",
  },
  {
    src: "/images/tre with 3 people.jpeg",
    alt: "Tre Story with camp participants",
    span: "col-span-1 md:col-span-2",
  },
  {
    src: "/images/tre with family.jpeg",
    alt: "Tre Story with family",
    span: "col-span-1",
  },
];

function GalleryImage({ src, alt, span }: { src: string; alt: string; span: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${span}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: isHovered ? "scale(1.02)" : "scale(1)" }}
      />
      <div
        className="absolute inset-0 bg-[#1e6b3a]/20 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </div>
  );
}

export function GallerySection() {
  return (
    <section className="bg-black py-16 px-6 md:px-16">
      <h2
        className="font-display text-white mb-2"
        style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
      >
        FROM THE FIELD
      </h2>
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
          />
        ))}
      </div>

      <p className="font-display text-gray-700 tracking-widest text-xs text-center mt-4">
        MORE PHOTOS COMING SOON
      </p>
    </section>
  );
}
