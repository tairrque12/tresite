"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setIsLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center pt-32">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Signal Caller Summit"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <h1 className="font-display text-3xl text-white text-center mt-6">
          ADMIN PORTAL
        </h1>
        <p className="font-body text-gray-500 text-sm text-center mb-8">
          Story&apos;s Signal Caller Summit
        </p>

        <form onSubmit={handleSubmit} data-testid="login-form">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3 font-body"
              required
              data-testid="email-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3 font-body"
              required
              data-testid="password-input"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mt-4" data-testid="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1e6b3a] text-white font-display tracking-widest py-4 mt-6 hover:bg-[#2d8a4e] transition-colors disabled:opacity-50"
          >
            {isLoading ? "SIGNING IN..." : "SIGN IN →"}
          </button>
        </form>
      </div>
    </div>
  );
}
