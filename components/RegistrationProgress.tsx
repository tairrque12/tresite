"use client";

import { Check } from "lucide-react";

interface RegistrationProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "ATHLETE" },
  { number: 2, label: "PARENT" },
  { number: 3, label: "WAIVER" },
  { number: 4, label: "PAYMENT" },
];

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  return (
    <div className="sticky top-[56px] z-40 w-full bg-black border-b border-[#1e6b3a]/20">
      <div className="max-w-lg mx-auto px-6">
        <div className="flex justify-between py-4">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;

            return (
              <div
                key={step.number}
                className={`flex flex-col items-center gap-1 ${
                  isActive
                    ? "text-white"
                    : isCompleted
                    ? "text-[#2d8a4e]"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span className="font-display text-sm tracking-widest">
                    {step.label}
                  </span>
                </div>
                {isActive && (
                  <div className="w-full h-0.5 bg-[#1e6b3a] mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
