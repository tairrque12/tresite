import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const bookingTypeLabels: Record<string, string> = {
  individual: "Individual Athlete (1-on-1)",
  group: "Group Session (2-10 Athletes)",
  team: "Team Training (11+ Athletes)",
  school: "School / Organization Visit",
  speaking: "Speaking Engagement",
};

const sessionFormatLabels: Record<string, string> = {
  "in-person": "In-Person — Lanett, AL area",
  virtual: "Virtual — Zoom film review / mechanics breakdown",
  travel: "Travel — Clifford Story, III comes to your location",
};

const ageRangeLabels: Record<string, string> = {
  "8-10": "8-10 years old",
  "11-13": "11-13 years old",
  "14-16": "14-16 years old",
  "17-18": "17-18 years old",
  college: "College level",
  na: "N/A (Speaking Engagement)",
};

const skillLevelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  na: "N/A (Speaking Engagement)",
};

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bookingType: string;
  ageRange: string;
  skillLevel: string;
  positions?: string[];
  numberOfAthletes?: string;
  organizationName?: string;
  sessionFormat: string;
  preferredDate: string;
  backupDate?: string;
  sessionGoals: string;
  howHeard?: string;
}

export async function POST(request: Request) {
  try {
    const data: BookingData = await request.json();

    // Insert into Supabase
    const { error: supabaseError } = await supabaseAdmin
      .from("bookings")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phone,
        booking_type: data.bookingType,
        age_range: data.ageRange,
        skill_level: data.skillLevel,
        positions: data.positions || [],
        session_format: data.sessionFormat,
        preferred_date: data.preferredDate,
        backup_date: data.backupDate || null,
        session_goals: data.sessionGoals,
        how_heard: data.howHeard || null,
        sms_consent: false,
        status: "new",
      });

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);
    }

    if (!resend) {
      console.warn("RESEND_API_KEY not configured - skipping email");
      return NextResponse.json({ success: true, emailSkipped: true });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const treEmail = process.env.TRE_EMAIL || "cliffstoryiii@gmail.com";

    const bookingTypeLabel = bookingTypeLabels[data.bookingType] || data.bookingType;
    const sessionFormatLabel = sessionFormatLabels[data.sessionFormat] || data.sessionFormat;
    const ageRangeLabel = ageRangeLabels[data.ageRange] || data.ageRange;
    const skillLevelLabel = skillLevelLabels[data.skillLevel] || data.skillLevel;

    const bookingTypeBadgeColor =
      data.bookingType === "individual"
        ? "#3b82f6"
        : data.bookingType === "group"
        ? "#8b5cf6"
        : data.bookingType === "team"
        ? "#f59e0b"
        : data.bookingType === "school"
        ? "#ef4444"
        : "#1e6b3a";

    // Email to Clifford
    const treEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Consultation Request</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <div style="display: inline-block; background: ${bookingTypeBadgeColor}; color: white; padding: 4px 12px; font-size: 12px; text-transform: uppercase; margin-bottom: 16px;">
            ${bookingTypeLabel}
          </div>

          <h2 style="color: #1e6b3a; margin-top: 0; border-bottom: 2px solid #1e6b3a; padding-bottom: 8px;">
            Who is Booking
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td>
              <td style="padding: 8px 0;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td>
            </tr>
          </table>

          <h2 style="color: #1e6b3a; border-bottom: 2px solid #1e6b3a; padding-bottom: 8px;">
            Athlete Details
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Age Range:</td>
              <td style="padding: 8px 0;">${ageRangeLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Skill Level:</td>
              <td style="padding: 8px 0;">${skillLevelLabel}</td>
            </tr>
            ${
              data.positions && data.positions.length > 0
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Position(s):</td>
              <td style="padding: 8px 0;">${data.positions.join(", ").toUpperCase()}</td>
            </tr>
            `
                : ""
            }
            ${
              data.numberOfAthletes
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;"># of Athletes:</td>
              <td style="padding: 8px 0;">${data.numberOfAthletes}</td>
            </tr>
            `
                : ""
            }
            ${
              data.organizationName
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Organization:</td>
              <td style="padding: 8px 0;">${data.organizationName}</td>
            </tr>
            `
                : ""
            }
          </table>

          <h2 style="color: #1e6b3a; border-bottom: 2px solid #1e6b3a; padding-bottom: 8px;">
            Session Details
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Format:</td>
              <td style="padding: 8px 0;">${sessionFormatLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 8px 0;">${data.preferredDate}</td>
            </tr>
            ${
              data.backupDate
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Backup Date:</td>
              <td style="padding: 8px 0;">${data.backupDate}</td>
            </tr>
            `
                : ""
            }
          </table>

          <h2 style="color: #1e6b3a; border-bottom: 2px solid #1e6b3a; padding-bottom: 8px;">
            Session Goals
          </h2>
          <div style="background: white; padding: 16px; border-left: 4px solid #1e6b3a; margin-bottom: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${data.sessionGoals}</p>
          </div>

          ${
            data.howHeard
              ? `
          <p style="color: #666; font-size: 12px;">
            <strong>How they heard about you:</strong> ${data.howHeard}
          </p>
          `
              : ""
          }

          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Signal Caller Summit — Consultation Request
          </p>
        </div>
      </div>
    `;

    // Confirmation email to submitter
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thanks ${data.firstName}!</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333;">
            Clifford Story, III has received your consultation request and will reach out within 24 hours
            to confirm your session and discuss pricing.
          </p>

          <div style="background: white; padding: 16px; border: 1px solid #e5e5e5; margin: 20px 0;">
            <h3 style="color: #1e6b3a; margin-top: 0;">Your Request Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">Type:</td>
                <td style="padding: 8px 0;">${bookingTypeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Format:</td>
                <td style="padding: 8px 0;">${sessionFormatLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 8px 0;">${data.preferredDate}</td>
              </tr>
            </table>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e5e5;">
              <p style="font-weight: bold; margin-bottom: 4px;">Goals:</p>
              <p style="margin: 0; color: #666;">${data.sessionGoals}</p>
            </div>
          </div>

          <p style="font-size: 14px; color: #333;">
            If you need to reach Clifford Story, III directly in the meantime, don't hesitate to email him:
          </p>
          <p style="font-size: 14px;">
            <a href="mailto:cliffstoryiii@gmail.com" style="color: #1e6b3a;">
              cliffstoryiii@gmail.com
            </a>
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Story's Signal Caller Summit
            </p>
            <p style="color: #999; font-size: 11px; margin: 4px 0 0 0;">
              Elite QB & WR Training
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email to Clifford
    const { error: cliffordError } = await resend.emails.send({
      from: fromEmail,
      to: treEmail,
      subject: `New Consultation Request: ${data.firstName} ${data.lastName} — ${bookingTypeLabel}`,
      html: treEmailHtml,
      replyTo: data.email,
    });

    if (cliffordError) {
      console.error("Error sending to Clifford:", cliffordError);
    }

    // Send confirmation to submitter
    const { error: confirmError } = await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "We got your request — Clifford Story, III will be in touch",
      html: confirmationHtml,
    });

    if (confirmError) {
      console.error("Error sending confirmation:", confirmError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
