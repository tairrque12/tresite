import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface InquiryData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data: InquiryData = await request.json();
    const { name, email, message } = data;

    if (!resend) {
      console.warn("RESEND_API_KEY not configured - skipping email");
      return NextResponse.json({ success: true, emailSkipped: true });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const treEmail = process.env.TRE_EMAIL || "cliffstoryiii@gmail.com";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Sponsor Inquiry</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #1e6b3a;">From: ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>

          <div style="background: white; padding: 20px; border-left: 4px solid #1e6b3a; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #666; font-size: 12px;">
            This inquiry was submitted via the Signal Caller Summit sponsor page.
          </p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: treEmail,
      subject: `Sponsor Inquiry from ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Inquiry failed" }, { status: 500 });
  }
}
