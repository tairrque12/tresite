"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Check, Loader2 } from "lucide-react";

const bookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Phone must be in format xxx-xxx-xxxx"),
  bookingType: z.string().min(1, "Booking type is required"),
  ageRange: z.string().min(1, "Age range is required"),
  skillLevel: z.string().min(1, "Skill level is required"),
  positions: z.array(z.string()).optional(),
  numberOfAthletes: z.string().optional(),
  organizationName: z.string().optional(),
  sessionFormat: z.string().min(1, "Session format is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  backupDate: z.string().optional(),
  sessionGoals: z
    .string()
    .min(1, "Session goals are required")
    .min(20, "Session goals must be at least 20 characters"),
  howHeard: z.string().optional(),
  smsConsent: z.literal(true, { message: "You must agree to receive SMS updates" }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const bookingTypes = [
  { value: "individual", label: "Individual Athlete (1-on-1)" },
  { value: "group", label: "Group Session (2-10 Athletes)" },
  { value: "team", label: "Team Training (11+ Athletes)" },
  { value: "school", label: "School / Organization Visit" },
  { value: "speaking", label: "Speaking Engagement" },
];

const ageRanges = [
  { value: "8-10", label: "8-10 years old" },
  { value: "11-13", label: "11-13 years old" },
  { value: "14-16", label: "14-16 years old" },
  { value: "17-18", label: "17-18 years old" },
  { value: "college", label: "College level" },
  { value: "na", label: "N/A (Speaking Engagement)" },
];

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "na", label: "N/A (Speaking Engagement)" },
];

const sessionFormats = [
  { value: "in-person", label: "In-Person — Lanett, AL area" },
  { value: "virtual", label: "Virtual — Zoom film review / mechanics breakdown" },
  { value: "travel", label: "Travel — Clifford Story, III comes to your location" },
];

const howHeardOptions = [
  { value: "social", label: "Social media" },
  { value: "word-of-mouth", label: "Word of mouth" },
  { value: "website", label: "Signal Caller Summit website" },
  { value: "referral", label: "Referred by someone" },
  { value: "other", label: "Other" },
];

const positionOptions = [
  { value: "qb", label: "Quarterback (QB)" },
  { value: "wr", label: "Wide Receiver (WR)" },
  { value: "both", label: "Both" },
  { value: "na", label: "N/A" },
];

export default function BookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      positions: [],
    },
  });

  const bookingType = watch("bookingType");
  const showAthleteCount = ["group", "team", "school"].includes(bookingType);

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmittedData(data);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }

    setIsSubmitting(false);
  };

  const getBookingTypeLabel = (value: string) => {
    return bookingTypes.find((t) => t.value === value)?.label || value;
  };

  const getSessionFormatLabel = (value: string) => {
    return sessionFormats.find((f) => f.value === value)?.label || value;
  };

  if (isSuccess && submittedData) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-14 px-6 py-24 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#1e6b3a] flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>

          <h1
            className="font-display text-white"
            style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
          >
            REQUEST SENT!
          </h1>

          <p className="font-body text-gray-300 text-base mt-4">
            Clifford Story, III will reach out within 24 hours to confirm your session.
          </p>

          <div className="bg-[#111] border border-[#1e6b3a]/30 p-6 mt-6 text-left">
            <p className="font-body text-gray-400 text-xs uppercase tracking-widest mb-4">
              Booking Summary
            </p>
            <div className="space-y-2">
              <p className="font-body text-white">
                <strong>Name:</strong> {submittedData.firstName} {submittedData.lastName}
              </p>
              <p className="font-body text-white">
                <strong>Email:</strong> {submittedData.email}
              </p>
              <p className="font-body text-white">
                <strong>Booking Type:</strong> {getBookingTypeLabel(submittedData.bookingType)}
              </p>
              <p className="font-body text-white">
                <strong>Session Format:</strong> {getSessionFormatLabel(submittedData.sessionFormat)}
              </p>
              <p className="font-body text-white">
                <strong>Preferred Date:</strong> {submittedData.preferredDate}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block text-[#2d8a4e] font-body mt-8 hover:underline"
          >
            Back to Home →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-14 py-20 px-8 md:px-16 border-b border-[#1e6b3a]/30">
        <div className="max-w-6xl">
          <span className="font-display text-[#2d8a4e] tracking-widest text-xs mb-3 block">
            YEAR-ROUND TRAINING
          </span>

          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          >
            BOOK A
          </h1>
          <span
            className="block font-display text-[#1e6b3a] leading-none"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          >
            1 ON 1
          </span>
          <span
            className="block font-display text-white leading-none"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          >
            CONSULTATION
          </span>

          <p className="font-body text-gray-400 text-base max-w-lg mt-6">
            Whether you&apos;re an individual athlete, a team, or a school looking to bring
            elite QB and WR training to your program — Clifford Story, III is available year-round. Fill
            out the form and he&apos;ll reach out within 24 hours.
          </p>
        </div>

        <div className="hidden md:block absolute right-16 top-24">
          <div className="bg-[#111] border border-[#1e6b3a]/30 px-6 py-4">
            <span className="font-display text-[#2d8a4e] text-xs tracking-widest block mb-2">
              DIRECT CONTACT
            </span>
            <span className="font-body text-white text-sm">cliffstoryiii@gmail.com</span>
          </div>
        </div>

        <div className="md:hidden mt-6">
          <div className="bg-[#111] border border-[#1e6b3a]/30 px-6 py-4 inline-block">
            <span className="font-display text-[#2d8a4e] text-xs tracking-widest block mb-2">
              DIRECT CONTACT
            </span>
            <span className="font-body text-white text-sm">cliffstoryiii@gmail.com</span>
          </div>
        </div>
      </section>

      {/* What Clifford Story, III Offers Strip */}
      <section className="bg-[#111] border-y border-[#1e6b3a]/20 py-8 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
          <div className="md:border-r md:border-[#1e6b3a]/20 md:pr-6">
            <h3 className="font-display text-white text-xl">QB DEVELOPMENT</h3>
            <p className="font-body text-gray-400 text-sm mt-1">
              Mechanics, footwork, reads, and decision-making
            </p>
          </div>
          <div className="md:border-r md:border-[#1e6b3a]/20 md:px-6">
            <h3 className="font-display text-white text-xl">WR TRAINING</h3>
            <p className="font-body text-gray-400 text-sm mt-1">
              Route running, releases, catching, and separation
            </p>
          </div>
          <div className="md:pl-6">
            <h3 className="font-display text-white text-xl">LEADERSHIP + LIFE</h3>
            <p className="font-body text-gray-400 text-sm mt-1">
              Character, faith, and how to carry yourself on and off the field
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2
          className="font-display text-white mb-2"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          TELL US ABOUT YOUR SESSION
        </h2>
        <div className="w-[60px] h-px bg-[#1e6b3a] mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Section 1 - Who is Booking */}
          <div>
            <div className="border-b border-[#1e6b3a]/20 pb-2 mb-6">
              <span className="font-display text-[#2d8a4e] tracking-widest text-xs">
                01 — WHO IS BOOKING
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="xxx-xxx-xxxx"
                  {...register("phone")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="bookingType"
                className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
              >
                Type of Booking
              </label>
              <select
                id="bookingType"
                {...register("bookingType")}
                className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
              >
                <option value="">Select booking type...</option>
                {bookingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.bookingType && (
                <p className="text-red-400 text-xs mt-1">{errors.bookingType.message}</p>
              )}
            </div>
          </div>

          {/* Section 2 - About the Athlete(s) */}
          <div>
            <div className="border-b border-[#1e6b3a]/20 pb-2 mb-6">
              <span className="font-display text-[#2d8a4e] tracking-widest text-xs">
                02 — ABOUT THE ATHLETE(S)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ageRange"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Age Range
                </label>
                <select
                  id="ageRange"
                  {...register("ageRange")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                >
                  <option value="">Select age range...</option>
                  {ageRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                {errors.ageRange && (
                  <p className="text-red-400 text-xs mt-1">{errors.ageRange.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="skillLevel"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Skill Level
                </label>
                <select
                  id="skillLevel"
                  {...register("skillLevel")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                >
                  <option value="">Select skill level...</option>
                  {skillLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.skillLevel && (
                  <p className="text-red-400 text-xs mt-1">{errors.skillLevel.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <span className="font-body text-xs text-gray-400 uppercase tracking-widest mb-3 block">
                Position(s)
              </span>
              <div className="flex flex-wrap gap-6">
                {positionOptions.map((position) => (
                  <label key={position.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={position.value}
                      {...register("positions")}
                      className="w-4 h-4 border border-[#1e6b3a]/50 bg-transparent checked:bg-[#1e6b3a] appearance-none cursor-pointer"
                    />
                    <span className="font-body text-gray-300 text-sm">{position.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {showAthleteCount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="numberOfAthletes"
                    className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                  >
                    Number of Athletes
                  </label>
                  <input
                    id="numberOfAthletes"
                    type="number"
                    min="1"
                    {...register("numberOfAthletes")}
                    className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organizationName"
                    className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                  >
                    School / Organization Name (optional)
                  </label>
                  <input
                    id="organizationName"
                    type="text"
                    {...register("organizationName")}
                    className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3 - Session Details */}
          <div>
            <div className="border-b border-[#1e6b3a]/20 pb-2 mb-6">
              <span className="font-display text-[#2d8a4e] tracking-widest text-xs">
                03 — SESSION DETAILS
              </span>
            </div>

            <div>
              <label
                htmlFor="sessionFormat"
                className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
              >
                Preferred Session Format
              </label>
              <select
                id="sessionFormat"
                {...register("sessionFormat")}
                className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
              >
                <option value="">Select session format...</option>
                {sessionFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
              {errors.sessionFormat && (
                <p className="text-red-400 text-xs mt-1">{errors.sessionFormat.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  htmlFor="preferredDate"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  min={today}
                  {...register("preferredDate")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                />
                {errors.preferredDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.preferredDate.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="backupDate"
                  className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
                >
                  Backup Date (optional)
                </label>
                <input
                  id="backupDate"
                  type="date"
                  min={today}
                  {...register("backupDate")}
                  className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="sessionGoals"
                className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
              >
                Session Goals
              </label>
              <textarea
                id="sessionGoals"
                rows={5}
                placeholder="What do you want your athlete(s) to get out of this session? Be as specific as possible — mechanics, route running, leadership, all of the above?"
                {...register("sessionGoals")}
                className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3 resize-none"
              />
              {errors.sessionGoals && (
                <p className="text-red-400 text-xs mt-1">{errors.sessionGoals.message}</p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="howHeard"
                className="font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block"
              >
                How did you hear about Clifford Story, III? (optional)
              </label>
              <select
                id="howHeard"
                {...register("howHeard")}
                className="w-full bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] outline-none text-white px-4 py-3"
              >
                <option value="">Select...</option>
                {howHeardOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4 - Consent */}
          <div>
            <div className="border-b border-[#1e6b3a]/20 pb-2 mb-6">
              <span className="font-display text-[#2d8a4e] tracking-widest text-xs">
                04 — ALMOST DONE
              </span>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                data-testid="sms-consent-book"
                {...register("smsConsent")}
                className="w-4 h-4 mt-1 border border-[#1e6b3a]/50 bg-transparent checked:bg-[#1e6b3a] appearance-none cursor-pointer flex-shrink-0"
              />
              <span className="font-body text-gray-300 text-sm">
                I agree to receive SMS updates from Story&apos;s Signal Caller Summit. Msg &amp;
                data rates may apply. Reply STOP to unsubscribe.
              </span>
            </label>
            {errors.smsConsent && (
              <p className="text-red-400 text-xs mt-1">{errors.smsConsent.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              data-testid="submit-book"
              disabled={isSubmitting}
              className="w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] disabled:opacity-50 text-white font-display tracking-wider py-4 text-xl transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                "SUBMIT REQUEST →"
              )}
            </button>
            <p className="font-body text-gray-600 text-xs text-center mt-3">
              Clifford Story, III will respond within 24 hours to confirm your session and discuss pricing.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
