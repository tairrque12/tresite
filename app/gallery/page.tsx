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
    alt: "Clifford Story, III coaching on the field",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/tre with one guy.jpeg",
    alt: "Clifford Story, III training with an athlete",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/tre with 3 people.jpeg",
    alt: "Clifford Story, III with camp participants",
    span: "col-span-1",
    isHero: false,
  },
  {
    src: "/images/tre with family.jpeg",
    alt: "Clifford Story, III with family",
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

const photoAlbums2026 = [
  {
    name: "Google Drive Photos",
    url: "https://drive.google.com/drive/folders/1mQw6ur_gbYbTlh-sR7KpL7JY7n-PKuwy",
  },
  {
    name: "Captured by Cecii",
    url: "https://capturedbycecii.pixieset.com/storyssignalcallersummit/#",
  },
  {
    name: "Visions by Swint",
    url: "https://visionsbyswint10.pixieset.com/storysignalcallersummit/",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* 2026 Photo Albums Section */}
      <section className="pt-14 py-16 px-6 md:px-16 border-b border-white/10">
        <h1
          className="font-display text-white mb-2"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
        >
          STORY&apos;S SUMMIT CAMP
        </h1>
        <span className="font-display text-[#2d8a4e] tracking-widest text-sm block mb-8">
          2026 PHOTO ALBUMS
        </span>

        <div className="flex flex-wrap gap-4">
          {photoAlbums2026.map((album) => (
            <a
              key={album.name}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2d8a4e] hover:bg-[#1e6b3a] text-white font-display tracking-wider px-6 py-3 transition-colors duration-200"
            >
              {album.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* 2025 Gallery Section */}
      <section className="py-16 px-6 md:px-16">
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
