import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const logo = formData.get("logo") as File | null;
    const tier = formData.get("tier") as string;

    if (!logo) {
      return NextResponse.json({ error: "No logo provided" }, { status: 400 });
    }

    if (!resend) {
      console.warn("RESEND_API_KEY not configured - skipping email");
      return NextResponse.json({ success: true, emailSkipped: true });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const treEmail = process.env.TRE_EMAIL || "cliffstoryiii@gmail.com";

    const logoBuffer = Buffer.from(await logo.arrayBuffer());
    const logoBase64 = logoBuffer.toString("base64");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Sponsor Logo Upload</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #1e6b3a;">Tier: ${tier.toUpperCase()}</h2>
          <p>A new sponsor has uploaded their logo. The file is attached to this email.</p>
          <p><strong>Filename:</strong> ${logo.name}</p>
          <p><strong>Size:</strong> ${(logo.size / 1024).toFixed(2)} KB</p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: treEmail,
      subject: `Sponsor Logo Upload - ${tier.toUpperCase()}`,
      html: emailHtml,
      attachments: [
        {
          filename: logo.name,
          content: logoBase64,
        },
      ],
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
