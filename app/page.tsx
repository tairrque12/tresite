import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { WhatIsSection } from "@/components/WhatIsSection";
import { GallerySection } from "@/components/GallerySection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <WhatIsSection />
      <div id="sponsors" />
    </div>
  );
}
