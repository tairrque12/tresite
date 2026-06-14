import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const emailHtml = `
      <h1 style="color: #1e6b3a;">New Registration: ${athlete.firstName} ${athlete.lastName}</h1>

      <h2>Athlete Information</h2>
      <ul>
        <li><strong>Name:</strong> ${athlete.firstName} ${athlete.lastName}</li>
        <li><strong>Date of Birth:</strong> ${athlete.dateOfBirth}</li>
        <li><strong>Position:</strong> ${athlete.position === "QB" ? "Quarterback" : "Wide Receiver"}</li>
        <li><strong>School:</strong> ${athlete.schoolName}</li>
        <li><strong>Grade:</strong> ${athlete.grade}</li>
        <li><strong>Location:</strong> ${athlete.city}, ${athlete.state}</li>
        <li><strong>T-Shirt Size:</strong> ${athlete.tshirtSize}</li>
      </ul>

      <h2>Parent/Guardian Information</h2>
      <ul>
        <li><strong>Name:</strong> ${parent.parentFirstName} ${parent.parentLastName}</li>
        <li><strong>Relationship:</strong> ${parent.relationship}</li>
        <li><strong>Phone:</strong> ${parent.phoneNumber}</li>
        <li><strong>Email:</strong> ${parent.email}</li>
        ${parent.emergencyContactName ? `<li><strong>Emergency Contact:</strong> ${parent.emergencyContactName} - ${parent.emergencyContactPhone}</li>` : ""}
        <li><strong>SMS Consent:</strong> ${parent.smsConsent ? "Yes" : "No"}</li>
      </ul>

      <h2>Waiver</h2>
      <ul>
        <li><strong>Accepted:</strong> ${waiver.waiverAccepted ? "Yes" : "No"}</li>
        <li><strong>Signature:</strong> ${waiver.signature}</li>
        <li><strong>Signed:</strong> ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</li>
      </ul>

      <h2>Payment</h2>
      <ul>
        <li><strong>Method:</strong> ${payment.method === "card" ? "Credit/Debit Card" : "Cash at Check-in"}</li>
        <li><strong>Status:</strong> ${payment.status === "paid" ? "✅ PAID" : "⏳ PENDING (Cash)"}</li>
        <li><strong>Amount:</strong> $50.00</li>
      </ul>

      <hr />
      <p style="color: #666; font-size: 12px;">
        Signal Caller Summit · July 18, 2026 · Lanett, AL
      </p>
    `;

    const { error } = await resend.emails.send({
      from: "Signal Caller Summit <registrations@${process.env.RESEND_DOMAIN || "resend.dev"}>",
      to: "cliffstoryiii@gmail.com",
      subject: `New Registration: ${athlete.firstName} ${athlete.lastName} (${athlete.position}) - ${payment.status === "paid" ? "PAID" : "CASH PENDING"}`,
      html: emailHtml,
      replyTo: parent.email,
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
