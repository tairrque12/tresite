"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";

const tierPrices: Record<string, number> = {
  platinum: 250,
  gold: 150,
  silver: 100,
  bronze: 50,
  friend: 25,
};

const tierNames: Record<string, string> = {
  platinum: "PLATINUM",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
  friend: "FRIEND",
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "friend";
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const showLogoUpload = tier === "platinum" || tier === "gold";

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1e6b3a", "#2d8a4e", "#ffffff"],
    });
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("tier", tier);

    try {
      await fetch("/api/sponsor-logo", {
        method: "POST",
        body: formData,
      });
      setLogoUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 bg-[#1e6b3a] rounded-full flex items-center justify-center mx-auto mb-8">
        <Check className="w-10 h-10 text-white" />
      </div>

      <h1 className="font-display text-5xl text-white mb-4">
        THANK YOU FOR INVESTING
      </h1>

      <p className="font-display text-2xl text-[#2d8a4e] mb-2">
        {tierNames[tier]} SPONSOR
      </p>

      <p className="font-display text-4xl text-white mb-8">
        ${tierPrices[tier]}.00
      </p>

      <p className="font-body text-gray-400 mb-12">
        Clifford Story, III will be in touch within 24 hours.
      </p>

      {showLogoUpload && !logoUploaded && (
        <div className="border border-[#1e6b3a]/30 p-8">
          <h3 className="font-display text-white text-xl mb-4">
            UPLOAD YOUR LOGO
          </h3>
          <p className="font-body text-gray-400 text-sm mb-6">
            Upload your logo for placement on event materials.
          </p>
          <label className="block w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider py-4 cursor-pointer transition-colors">
            {uploading ? "UPLOADING..." : "SELECT LOGO FILE"}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {logoUploaded && (
        <div className="border border-[#1e6b3a] p-8">
          <p className="font-display text-[#2d8a4e] text-xl">
            LOGO UPLOADED SUCCESSFULLY!
          </p>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Suspense
        fallback={
          <div className="max-w-lg mx-auto px-6 py-24 text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
