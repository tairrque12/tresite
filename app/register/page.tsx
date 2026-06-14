"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { RegistrationProgress } from "@/components/RegistrationProgress";
import { Check } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const athleteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  position: z.string().min(1, "Position is required"),
  schoolName: z.string().min(1, "School name is required"),
  grade: z.string().min(1, "Grade is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  tshirtSize: z.string().min(1, "T-shirt size is required"),
});

const parentSchema = z.object({
  parentFirstName: z.string().min(1, "Parent first name is required"),
  parentLastName: z.string().min(1, "Parent last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  smsConsent: z.literal(true, {
    errorMap: () => ({ message: "SMS consent is required" }),
  }),
});

const waiverSchema = z.object({
  waiverAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the waiver" }),
  }),
  signature: z.string().min(1, "Signature is required"),
});

type AthleteData = z.infer<typeof athleteSchema>;
type ParentData = z.infer<typeof parentSchema>;
type WaiverData = z.infer<typeof waiverSchema>;

interface FormData {
  athlete: AthleteData;
  parent: ParentData;
  waiver: WaiverData;
}

const inputStyles =
  "bg-[#111] border border-[#1e6b3a]/30 focus:border-[#2d8a4e] focus:outline-none text-white px-4 py-3 w-full text-base";
const labelStyles =
  "font-body text-xs text-gray-400 uppercase tracking-widest mb-1 block";
const errorStyles = "text-red-400 text-xs mt-1";

function calculateAge(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function Step1Athlete({
  onNext,
  defaultValues,
}: {
  onNext: (data: AthleteData) => void;
  defaultValues?: AthleteData;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AthleteData>({
    resolver: zodResolver(athleteSchema),
    defaultValues,
  });

  const dob = watch("dateOfBirth");
  const age = dob ? calculateAge(dob) : null;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <span className="font-display text-[#2d8a4e] text-xs tracking-widest">
          STEP 1 OF 4
        </span>
        <h1 className="font-display text-4xl text-white mt-1">
          ATHLETE INFORMATION
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelStyles}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className={inputStyles}
          />
          {errors.firstName && (
            <p className={errorStyles}>{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className={labelStyles}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className={inputStyles}
          />
          {errors.lastName && (
            <p className={errorStyles}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className={labelStyles}>
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
            className={inputStyles}
          />
          {errors.dateOfBirth && (
            <p className={errorStyles}>{errors.dateOfBirth.message}</p>
          )}
        </div>
        <div>
          <label className={labelStyles}>Age</label>
          <div className={`${inputStyles} bg-[#0a0a0a]`}>
            {age !== null ? age : "—"}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="position" className={labelStyles}>
          Position
        </label>
        <select id="position" {...register("position")} className={inputStyles}>
          <option value="">Select position</option>
          <option value="QB">Quarterback (QB)</option>
          <option value="WR">Wide Receiver (WR)</option>
        </select>
        {errors.position && (
          <p className={errorStyles}>{errors.position.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="schoolName" className={labelStyles}>
          School Name
        </label>
        <input
          id="schoolName"
          type="text"
          {...register("schoolName")}
          className={inputStyles}
        />
        {errors.schoolName && (
          <p className={errorStyles}>{errors.schoolName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="grade" className={labelStyles}>
          Grade
        </label>
        <select id="grade" {...register("grade")} className={inputStyles}>
          <option value="">Select grade</option>
          <option value="6th">6th Grade</option>
          <option value="7th">7th Grade</option>
          <option value="8th">8th Grade</option>
          <option value="9th">9th Grade</option>
          <option value="10th">10th Grade</option>
          <option value="11th">11th Grade</option>
          <option value="12th">12th Grade</option>
        </select>
        {errors.grade && <p className={errorStyles}>{errors.grade.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className={labelStyles}>
            City
          </label>
          <input
            id="city"
            type="text"
            {...register("city")}
            className={inputStyles}
          />
          {errors.city && <p className={errorStyles}>{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor="state" className={labelStyles}>
            State
          </label>
          <input
            id="state"
            type="text"
            {...register("state")}
            className={inputStyles}
          />
          {errors.state && (
            <p className={errorStyles}>{errors.state.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="tshirtSize" className={labelStyles}>
          T-Shirt Size
        </label>
        <select
          id="tshirtSize"
          {...register("tshirtSize")}
          className={inputStyles}
        >
          <option value="">Select size</option>
          <option value="YS">Youth Small (YS)</option>
          <option value="YM">Youth Medium (YM)</option>
          <option value="YL">Youth Large (YL)</option>
          <option value="AS">Adult Small (AS)</option>
          <option value="AM">Adult Medium (AM)</option>
          <option value="AL">Adult Large (AL)</option>
          <option value="AXL">Adult XL (AXL)</option>
        </select>
        {errors.tshirtSize && (
          <p className={errorStyles}>{errors.tshirtSize.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-3 transition-colors"
        >
          NEXT →
        </button>
      </div>
    </form>
  );
}

function Step2Parent({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: ParentData) => void;
  onBack: () => void;
  defaultValues?: ParentData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentData>({
    resolver: zodResolver(parentSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <span className="font-display text-[#2d8a4e] text-xs tracking-widest">
          STEP 2 OF 4
        </span>
        <h1 className="font-display text-4xl text-white mt-1">
          PARENT / GUARDIAN INFORMATION
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="parentFirstName" className={labelStyles}>
            Parent/Guardian First Name
          </label>
          <input
            id="parentFirstName"
            type="text"
            {...register("parentFirstName")}
            className={inputStyles}
          />
          {errors.parentFirstName && (
            <p className={errorStyles}>{errors.parentFirstName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="parentLastName" className={labelStyles}>
            Parent/Guardian Last Name
          </label>
          <input
            id="parentLastName"
            type="text"
            {...register("parentLastName")}
            className={inputStyles}
          />
          {errors.parentLastName && (
            <p className={errorStyles}>{errors.parentLastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="relationship" className={labelStyles}>
          Relationship to Athlete
        </label>
        <select
          id="relationship"
          {...register("relationship")}
          className={inputStyles}
        >
          <option value="">Select relationship</option>
          <option value="Mother">Mother</option>
          <option value="Father">Father</option>
          <option value="Guardian">Guardian</option>
        </select>
        {errors.relationship && (
          <p className={errorStyles}>{errors.relationship.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className={labelStyles}>
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          placeholder="xxx-xxx-xxxx"
          {...register("phoneNumber")}
          className={inputStyles}
        />
        {errors.phoneNumber && (
          <p className={errorStyles}>{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelStyles}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={inputStyles}
        />
        {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="emergencyContactName" className={labelStyles}>
          Emergency Contact Name (if different)
        </label>
        <input
          id="emergencyContactName"
          type="text"
          {...register("emergencyContactName")}
          className={inputStyles}
        />
      </div>

      <div>
        <label htmlFor="emergencyContactPhone" className={labelStyles}>
          Emergency Contact Phone
        </label>
        <input
          id="emergencyContactPhone"
          type="tel"
          {...register("emergencyContactPhone")}
          className={inputStyles}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="smsConsent"
          data-testid="sms-consent"
          {...register("smsConsent")}
          className="mt-1 w-5 h-5 accent-[#1e6b3a]"
        />
        <label htmlFor="smsConsent" className="font-body text-sm text-gray-400">
          I agree to receive SMS updates about Story&apos;s Signal Caller
          Summit. Msg & data rates may apply. Reply STOP to unsubscribe.
        </label>
      </div>
      {errors.smsConsent && (
        <p className={errorStyles}>{errors.smsConsent.message}</p>
      )}

      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-white text-sm font-body transition-colors"
        >
          ← BACK
        </button>
        <button
          type="submit"
          className="bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-3 transition-colors"
        >
          NEXT →
        </button>
      </div>
    </form>
  );
}

function Step3Waiver({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: WaiverData) => void;
  onBack: () => void;
  defaultValues?: WaiverData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaiverData>({
    resolver: zodResolver(waiverSchema),
    defaultValues,
  });

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <span className="font-display text-[#2d8a4e] text-xs tracking-widest">
          STEP 3 OF 4
        </span>
        <h1 className="font-display text-4xl text-white mt-1">
          LIABILITY WAIVER
        </h1>
      </div>

      <div className="max-h-64 overflow-y-auto border border-[#1e6b3a]/30 p-4">
        <p className="font-body text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {`RELEASE OF LIABILITY AND ASSUMPTION OF RISK

By signing below, I (parent/guardian) acknowledge that participation in Story's Signal Caller Summit football camp involves physical activity and inherent risks of injury. I voluntarily assume all risks associated with participation.

I hereby release Clifford Story Jr., Story's Signal Caller Summit, Sweet Feet Academy, and all associated coaches, staff, and volunteers from any and all liability, claims, or demands arising from my child's participation in this event, including but not limited to injuries, accidents, or property damage.

I confirm that my child is physically able to participate in athletic activities and has no medical conditions that would prevent safe participation. I authorize emergency medical treatment if necessary.

I grant permission for photos and videos taken at the event to be used for promotional purposes by Story's Signal Caller Summit.

This waiver is binding upon my heirs, executors, and administrators.`}
        </p>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="waiverAccepted"
          data-testid="waiver-checkbox"
          {...register("waiverAccepted")}
          className="mt-1 w-5 h-5 accent-[#1e6b3a]"
        />
        <label
          htmlFor="waiverAccepted"
          className="font-body text-sm text-gray-400"
        >
          I have read and agree to the terms above
        </label>
      </div>
      {errors.waiverAccepted && (
        <p className={errorStyles}>{errors.waiverAccepted.message}</p>
      )}

      <div>
        <label htmlFor="signature" className={labelStyles}>
          Electronic Signature
        </label>
        <input
          id="signature"
          data-testid="signature-input"
          type="text"
          placeholder="Full legal name"
          {...register("signature")}
          className={inputStyles}
        />
        {errors.signature && (
          <p className={errorStyles}>{errors.signature.message}</p>
        )}
        <p className="font-body text-xs text-gray-600 mt-2">
          Signed electronically on {today}
        </p>
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-white text-sm font-body transition-colors"
        >
          ← BACK
        </button>
        <button
          type="submit"
          className="bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-3 transition-colors"
        >
          NEXT →
        </button>
      </div>
    </form>
  );
}

function PaymentForm({
  athleteData,
  onSuccess,
  onBack,
  paymentMethod,
}: {
  athleteData: AthleteData;
  onSuccess: (method: "card" | "cash") => void;
  onBack: () => void;
  paymentMethod: "card" | "cash";
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
      });
      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess("card");
      }
    } catch {
      setError("Payment failed. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelStyles}>Card Details</label>
        <div className={`${inputStyles} py-4`}>
          <CardElement
            options={{
              style: {
                base: {
                  color: "#ffffff",
                  fontSize: "16px",
                  "::placeholder": {
                    color: "#6b7280",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && <p className={errorStyles}>{error}</p>}

      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-white text-sm font-body transition-colors"
        >
          ← BACK
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className="bg-[#1e6b3a] hover:bg-[#2d8a4e] disabled:opacity-50 text-white font-display tracking-wider px-8 py-3 transition-colors"
        >
          {isProcessing ? "PROCESSING..." : "PAY $50.00 →"}
        </button>
      </div>
    </form>
  );
}

function Step4Payment({
  athleteData,
  onSuccess,
  onBack,
}: {
  athleteData: AthleteData;
  onSuccess: (method: "card" | "cash") => void;
  onBack: () => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(null);

  const handleCashPayment = () => {
    onSuccess("cash");
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="font-display text-[#2d8a4e] text-xs tracking-widest">
          STEP 4 OF 4
        </span>
        <h1 className="font-display text-4xl text-white mt-1">PAYMENT</h1>
      </div>

      <div className="bg-[#111] border border-[#1e6b3a]/30 p-6 space-y-3">
        <h2 className="font-display text-xl text-white tracking-wider">
          ORDER SUMMARY
        </h2>
        <div className="border-t border-[#1e6b3a]/20 pt-3 space-y-2">
          <p className="font-body text-gray-300">
            Story&apos;s Signal Caller Summit
          </p>
          <p className="font-body text-gray-500 text-sm">
            July 18, 2026 · Lanett, AL
          </p>
          <p className="font-body text-gray-400 text-sm">
            Athlete: {athleteData.firstName} {athleteData.lastName}
          </p>
          <p className="font-body text-gray-400 text-sm">
            Position: {athleteData.position === "QB" ? "Quarterback" : "Wide Receiver"}
          </p>
        </div>
        <div className="border-t border-[#1e6b3a]/20 pt-3 flex justify-between">
          <span className="font-display text-white tracking-wider">TOTAL</span>
          <span className="font-display text-2xl text-[#2d8a4e]">$50.00</span>
        </div>
      </div>

      <div>
        <label className={labelStyles}>Payment Method</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            data-testid="payment-method-card"
            className={`p-4 border text-left transition-colors ${
              paymentMethod === "card"
                ? "border-[#1e6b3a] bg-[#1e6b3a]/10"
                : "border-[#1e6b3a]/30 hover:border-[#1e6b3a]/60"
            }`}
          >
            <span className="font-display text-white text-lg block mb-1">
              PAY NOW
            </span>
            <span className="font-body text-gray-400 text-xs">
              Credit / Debit Card
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("cash")}
            data-testid="payment-method-cash"
            className={`p-4 border text-left transition-colors ${
              paymentMethod === "cash"
                ? "border-[#1e6b3a] bg-[#1e6b3a]/10"
                : "border-[#1e6b3a]/30 hover:border-[#1e6b3a]/60"
            }`}
          >
            <span className="font-display text-white text-lg block mb-1">
              PAY IN PERSON
            </span>
            <span className="font-body text-gray-400 text-xs">
              Cash at check-in
            </span>
          </button>
        </div>
      </div>

      {paymentMethod === "card" && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            athleteData={athleteData}
            onSuccess={onSuccess}
            onBack={onBack}
            paymentMethod={paymentMethod}
          />
        </Elements>
      )}

      {paymentMethod === "cash" && (
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#1e6b3a]/30 p-4">
            <p className="font-body text-gray-300 text-sm">
              By selecting &quot;Pay in Person,&quot; you agree to pay{" "}
              <span className="text-[#2d8a4e] font-semibold">$50.00 cash</span>{" "}
              at check-in on July 18, 2026. Your registration will be held but
              not confirmed until payment is received.
            </p>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={onBack}
              className="text-gray-500 hover:text-white text-sm font-body transition-colors"
            >
              ← BACK
            </button>
            <button
              type="button"
              onClick={handleCashPayment}
              className="bg-[#1e6b3a] hover:bg-[#2d8a4e] text-white font-display tracking-wider px-8 py-3 transition-colors"
            >
              COMPLETE REGISTRATION →
            </button>
          </div>
        </div>
      )}

      {!paymentMethod && (
        <div className="pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-white text-sm font-body transition-colors"
          >
            ← BACK
          </button>
        </div>
      )}
    </div>
  );
}

function SuccessScreen({
  athleteName,
  paymentMethod,
}: {
  athleteName: string;
  paymentMethod: "card" | "cash";
}) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1e6b3a", "#2d8a4e", "#ffffff"],
    });
  }, []);

  return (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-[#1e6b3a] rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-white" />
      </div>
      <h1 className="font-display text-5xl text-white">YOU&apos;RE REGISTERED!</h1>
      <p className="font-body text-gray-400 text-lg">{athleteName}</p>
      {paymentMethod === "card" ? (
        <p className="font-body text-gray-300 max-w-md mx-auto">
          Payment confirmed. See you July 18th at Story Field. Check your phone
          for updates.
        </p>
      ) : (
        <div className="max-w-md mx-auto space-y-3">
          <p className="font-body text-gray-300">
            Your spot is reserved. Please bring{" "}
            <span className="text-[#2d8a4e] font-semibold">$50.00 cash</span> to
            check-in on July 18th.
          </p>
          <p className="font-body text-gray-500 text-sm">
            Check your phone for updates and arrival instructions.
          </p>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const handleStep1 = (data: AthleteData) => {
    setFormData((prev) => ({ ...prev, athlete: data }));
    setStep(2);
  };

  const handleStep2 = (data: ParentData) => {
    setFormData((prev) => ({ ...prev, parent: data }));
    setStep(3);
  };

  const handleStep3 = (data: WaiverData) => {
    setFormData((prev) => ({ ...prev, waiver: data }));
    setStep(4);
  };

  const handlePaymentSuccess = (method: "card" | "cash") => {
    setPaymentMethod(method);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <RegistrationProgress currentStep={step} />

      <main className="max-w-lg mx-auto px-6 py-12">
        {isSuccess ? (
          <SuccessScreen
            athleteName={`${formData.athlete?.firstName} ${formData.athlete?.lastName}`}
            paymentMethod={paymentMethod}
          />
        ) : (
          <>
            {step === 1 && (
              <Step1Athlete
                onNext={handleStep1}
                defaultValues={formData.athlete}
              />
            )}
            {step === 2 && (
              <Step2Parent
                onNext={handleStep2}
                onBack={() => setStep(1)}
                defaultValues={formData.parent}
              />
            )}
            {step === 3 && (
              <Step3Waiver
                onNext={handleStep3}
                onBack={() => setStep(2)}
                defaultValues={formData.waiver}
              />
            )}
            {step === 4 && formData.athlete && (
              <Step4Payment
                athleteData={formData.athlete}
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep(3)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
