import { NextResponse } from "next/server";
import { createTransport, MAIL_FROM, MAIL_TO } from "@/lib/mailer";

export const runtime = "nodejs";

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

/**
 * Notifies the kitchen that somebody signed up.
 *
 * The subscriber list itself lives in the API (`POST /newsletters`), which the
 * form posts to directly — this route only sends the notification mail, and is
 * safe to leave unused if nobody wants one.
 */
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "A valid email address is required" },
        { status: 400 },
      );
    }

    const transporter = createTransport();

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: "📩 New Newsletter Subscription",
      text: `Email: ${email}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
