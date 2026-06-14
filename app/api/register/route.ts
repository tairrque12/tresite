import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface RegistrationData {
  athlete: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    position: string;
    schoolName: string;
    grade: string;
    city: string;
    state: string;
    tshirtSize: string;
  };
  parent: {
    parentFirstName: string;
    parentLastName: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    smsConsent: boolean;
  };
  waiver: {
    waiverAccepted: boolean;
    signature: string;
  };
  payment: {
    method: "card" | "cash";
    status: "paid" | "pending";
  };
}

export async function POST(request: Request) {
  try {
    const data: RegistrationData = await request.json();
    const { athlete, parent, waiver, payment } = data;

    if (!resend) {
      console.warn("RESEND_API_KEY not configured - skipping email");
      return NextResponse.json({ success: true, emailSkipped: true });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const treEmail = process.env.TRE_EMAIL || "cliffstoryiii@gmail.com";

    // Email to Tre (camp owner) with full registration details
    const treEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Registration</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #1e6b3a; border-bottom: 2px solid #1e6b3a; padding-bottom: 10px;">
            ${athlete.firstName} ${athlete.lastName}
          </h2>

          <h3 style="color: #333;">Athlete Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.firstName} ${athlete.lastName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Date of Birth:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.dateOfBirth}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Position:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.position === "QB" ? "Quarterback" : "Wide Receiver"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>School:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.schoolName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Grade:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.grade}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.city}, ${athlete.state}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>T-Shirt Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${athlete.tshirtSize}</td></tr>
          </table>

          <h3 style="color: #333; margin-top: 20px;">Parent/Guardian Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${parent.parentFirstName} ${parent.parentLastName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Relationship:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${parent.relationship}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${parent.phoneNumber}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${parent.email}</td></tr>
            ${parent.emergencyContactName ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Emergency Contact:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${parent.emergencyContactName} - ${parent.emergencyContactPhone}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>SMS Consent:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${parent.smsConsent ? "Yes" : "No"}</td></tr>
          </table>

          <h3 style="color: #333; margin-top: 20px;">Waiver</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Accepted:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${waiver.waiverAccepted ? "Yes" : "No"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Signature:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${waiver.signature}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Signed:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td></tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: ${payment.status === "paid" ? "#d4edda" : "#fff3cd"}; border-radius: 8px;">
            <h3 style="color: ${payment.status === "paid" ? "#155724" : "#856404"}; margin: 0 0 10px 0;">
              Payment: ${payment.status === "paid" ? "✅ PAID" : "⏳ PENDING"}
            </h3>
            <p style="margin: 0; color: #333;">
              <strong>Method:</strong> ${payment.method === "card" ? "Credit/Debit Card" : "Cash at Check-in"}<br />
              <strong>Amount:</strong> $50.00
            </p>
          </div>
        </div>

        <div style="background: #1e6b3a; padding: 15px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 12px;">
            Signal Caller Summit · July 18, 2026 · Lanett, AL
          </p>
        </div>
      </div>
    `;

    // Email to parent/guardian (customer receipt)
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e6b3a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Registration Confirmed!</h1>
        </div>

        <div style="padding: 20px; background: #f9f9f9;">
          <p style="font-size: 18px; color: #333;">
            Thank you for registering <strong>${athlete.firstName} ${athlete.lastName}</strong> for Story's Signal Caller Summit!
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e6b3a; margin-top: 0;">Event Details</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> July 18, 2026</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> 10:00 AM EST</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> Story Field at Morgan Washburn Stadium</p>
            <p style="margin: 5px 0;">1301 S 8th Ave, Lanett, AL 36863</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e6b3a; margin-top: 0;">Registration Summary</h3>
            <p style="margin: 5px 0;"><strong>Athlete:</strong> ${athlete.firstName} ${athlete.lastName}</p>
            <p style="margin: 5px 0;"><strong>Position:</strong> ${athlete.position === "QB" ? "Quarterback" : "Wide Receiver"}</p>
            <p style="margin: 5px 0;"><strong>T-Shirt Size:</strong> ${athlete.tshirtSize}</p>
          </div>

          <div style="padding: 15px; background: ${payment.status === "paid" ? "#d4edda" : "#fff3cd"}; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${payment.status === "paid" ? "#155724" : "#856404"}; margin: 0 0 10px 0;">
              Payment: ${payment.status === "paid" ? "✅ PAID" : "⏳ Due at Check-in"}
            </h3>
            <p style="margin: 0; color: #333;">
              <strong>Amount:</strong> $50.00<br />
              ${payment.method === "cash" ? "<strong>Please bring cash to check-in on July 18th.</strong>" : "Your payment has been processed successfully."}
            </p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e6b3a; margin-top: 0;">What to Bring</h3>
            <ul style="color: #333; padding-left: 20px;">
              <li>Cleats</li>
              <li>Water bottle</li>
              <li>Athletic wear</li>
              ${payment.method === "cash" ? "<li><strong>$50.00 cash for registration</strong></li>" : ""}
            </ul>
          </div>

          <p style="color: #666; font-size: 14px;">
            Questions? Reply to this email or contact us at cliffstoryiii@gmail.com
          </p>
        </div>

        <div style="background: #1e6b3a; padding: 15px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 12px;">
            Story's Signal Caller Summit · Developing Quarterbacks. Building Leaders. Inspiring Excellence.
          </p>
        </div>
      </div>
    `;

    // Send email to Tre
    const treResult = await resend.emails.send({
      from: fromEmail,
      to: treEmail,
      subject: `New Registration: ${athlete.firstName} ${athlete.lastName} (${athlete.position}) - ${payment.status === "paid" ? "PAID" : "CASH PENDING"}`,
      html: treEmailHtml,
      replyTo: parent.email,
    });

    if (treResult.error) {
      console.error("Error sending email to Tre:", treResult.error);
    }

    // Send confirmation email to parent/customer
    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: parent.email,
      subject: `Registration Confirmed: ${athlete.firstName} ${athlete.lastName} - Signal Caller Summit`,
      html: customerEmailHtml,
      replyTo: treEmail,
    });

    if (customerResult.error) {
      console.error("Error sending customer receipt:", customerResult.error);
    }

    // Return success even if one email fails (log errors but don't block)
    return NextResponse.json({
      success: true,
      treEmailSent: !treResult.error,
      customerEmailSent: !customerResult.error,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
