import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface WaitlistData {
  name?: string;
  email: string;
  phone?: string;
}

export async function POST(request: Request) {
  try {
    const data: WaitlistData = await request.json();

    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (process.env.SUPABASE_URL) {
      try {
        const { error: supabaseError } = await supabaseAdmin
          .from("waitlist")
          .insert({
            name: data.name || "",
            email: data.email,
            phone: data.phone || "",
            created_at: new Date().toISOString(),
          });

        if (supabaseError) {
          console.error("Supabase insert error:", supabaseError);
        }
      } catch (dbError) {
        console.error("Supabase connection error:", dbError);
      }
    }

    if (!resend) {
      console.warn("RESEND_API_KEY not configured - skipping email");
      return NextResponse.json({ success: true, emailSkipped: true });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const treEmail = process.env.TRE_EMAIL || "cliffstoryiii@gmail.com";

    const treEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Waitlist Signup</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <table style="width: 100%; border-collapse: collapse;">
            ${data.name ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${data.name}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${data.phone}</td></tr>` : ""}
          </table>
        </div>

        <div style="background: #1e6b3a; padding: 15px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 12px;">
            Signal Caller Summit Waitlist
          </p>
        </div>
      </div>
    `;

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">You're on the List!</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <p style="font-size: 18px; color: #333;">
            Thanks for joining the waitlist for the next Story's Signal Caller Summit!
          </p>

          <p style="color: #666;">
            We'll reach out as soon as registration opens for the next camp. In the meantime, follow us on social media for updates and highlights from this year's summit.
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Questions? Reply to this email or contact us at cliffstoryiii@gmail.com
          </p>
        </div>

        <div style="background: #1e6b3a; padding: 15px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 12px;">
            Story's Signal Caller Summit
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: treEmail,
      subject: `Waitlist Signup: ${data.name || data.email}`,
      html: treEmailHtml,
      replyTo: data.email,
    });

    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "You're on the Signal Caller Summit Waitlist!",
      html: customerEmailHtml,
      replyTo: treEmail,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
