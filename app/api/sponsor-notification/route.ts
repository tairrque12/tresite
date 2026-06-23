import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const tierNames: Record<string, string> = {
  platinum: "Platinum ($250)",
  gold: "Gold ($150)",
  silver: "Silver ($100)",
  bronze: "Bronze ($50)",
  friend: "Friend ($25)",
};

interface SponsorData {
  tier: string;
  paymentMethod: string;
  businessName?: string;
  contactName?: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoNote?: string;
}

const tierAmounts: Record<string, number> = {
  platinum: 250,
  gold: 150,
  silver: 100,
  bronze: 50,
  friend: 25,
};

export async function POST(request: Request) {
  try {
    const data: SponsorData = await request.json();

    // Insert into Supabase
    const { error: supabaseError } = await supabaseAdmin
      .from("sponsors")
      .insert({
        business_name: data.businessName || data.contactName || data.name || "Unknown",
        contact_email: data.email || "",
        tier: data.tier,
        amount: tierAmounts[data.tier] || 0,
        payment_method: data.paymentMethod,
        payment_status: data.paymentMethod === "card" ? "pending" : "pending",
        logo_url: null,
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

    const sponsorName = data.businessName || data.contactName || data.name || "Unknown";
    const tierDisplay = tierNames[data.tier] || data.tier;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Sponsor Registration!</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #1e6b3a; margin-top: 0;">
            ${tierDisplay} Sponsor
          </h2>

          <div style="background: white; padding: 20px; border-left: 4px solid #1e6b3a; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              ${data.businessName ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px;">Business Name:</td>
                <td style="padding: 8px 0;">${data.businessName}</td>
              </tr>
              ` : ""}
              ${data.contactName ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Contact Name:</td>
                <td style="padding: 8px 0;">${data.contactName}</td>
              </tr>
              ` : ""}
              ${data.name ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0;">${data.name}</td>
              </tr>
              ` : ""}
              ${data.email ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              ` : ""}
              ${data.phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td>
              </tr>
              ` : ""}
              ${data.website ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Website:</td>
                <td style="padding: 8px 0;"><a href="${data.website}">${data.website}</a></td>
              </tr>
              ` : ""}
              ${data.logoNote ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Logo Notes:</td>
                <td style="padding: 8px 0;">${data.logoNote}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0; text-transform: uppercase;">${data.paymentMethod}</td>
              </tr>
            </table>
          </div>

          ${data.paymentMethod === "cash (in-person)" ? `
          <p style="color: #666; background: #fff3cd; padding: 12px; border-left: 4px solid #ffc107;">
            <strong>Action Required:</strong> This sponsor selected to pay in person.
            They have been given your phone number to arrange payment.
          </p>
          ` : `
          <p style="color: #666;">
            This sponsor is paying online via card. Payment confirmation will come from Stripe.
          </p>
          `}

          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Signal Caller Summit 2026 - Sponsor Registration
          </p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: treEmail,
      subject: `New ${tierDisplay} Sponsor: ${sponsorName}`,
      html: emailHtml,
      replyTo: data.email,
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}
