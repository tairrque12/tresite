import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <div id="sponsors" />
    </div>
  );
}
