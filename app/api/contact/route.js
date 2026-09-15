import { NextResponse } from "next/server";
import { createTransport, MAIL_FROM, MAIL_TO } from "@/lib/mailer";

export const runtime = "nodejs";

/** Anything a visitor typed is escaped before it goes into an HTML mail body. */
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "That email address does not look right" },
        { status: 400 },
      );
    }

    const transporter = createTransport();

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone || "N/A"),
      message: escapeHtml(message),
    };

    // The mailbox is the sender on both messages — an SMTP server will refuse
    // to send as an address it does not own. The visitor's address goes in
    // `replyTo`, so hitting reply in the inbox still reaches them.
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `New contact message from ${name}`,
      html: `
        <h2>New Message from Contact</h2>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit">${safe.message}</pre>
      `,
    });

    // The acknowledgement is best effort — the message is already with the
    // kitchen, so a bounce here must not report failure back to the visitor.
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Thank you for contacting Duffy’s Burgers & Wings!",
        html: `
          <p>Hi ${safe.name},</p>
          <p>Thank you for reaching out to <strong>Duffy’s Burgers &amp; Wings</strong>! We’ve received your message and will get back to you shortly.</p>
          <p><strong>Your Message:</strong></p>
          <pre style="white-space:pre-wrap;font-family:inherit">${safe.message}</pre>
          <p>— Duffy’s Team</p>
        `,
      });
    } catch (err) {
      console.error("Contact auto-reply failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
