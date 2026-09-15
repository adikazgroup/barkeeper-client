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

/** "18:30" → "6:30 PM", so neither mail reads like a timetable. */
const formatTime = (time) => {
  const [h, m] = String(time).split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return String(time);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
};

/** "2026-08-24" → "Mon, 24 Aug 2026". */
const formatDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return String(iso);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * The reference the guest quotes on the phone.
 *
 * Generated here rather than in the browser so the same string is in both
 * mails and on screen — a client-side value would only ever reach the guest.
 */
const makeReference = (iso) => {
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DF-${String(iso).slice(5).replace("-", "")}-${tail}`;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      branch,
      date,
      time,
      guests,
      name,
      email,
      phone,
      occasion,
      seating,
      notes,
      updates,
    } = body;

    if (!branch || !date || !time || !guests || !name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "The table, a name, a number and an email are all needed" },
        { status: 400 },
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "That email address does not look right" },
        { status: 400 },
      );
    }

    const reference = makeReference(date);
    const when = `${formatDate(date)} at ${formatTime(time)}`;

    const safe = {
      branch: escapeHtml(branch),
      when: escapeHtml(when),
      guests: escapeHtml(guests),
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      occasion: escapeHtml(occasion || "—"),
      seating: escapeHtml(seating || "—"),
      notes: escapeHtml(notes || "—"),
      updates: updates ? "Yes" : "No",
      reference: escapeHtml(reference),
    };

    const transporter = createTransport();

    // The mailbox is the sender on both messages — an SMTP server will refuse
    // to send as an address it does not own. The guest's address goes in
    // `replyTo`, so hitting reply in the inbox still reaches them.
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `🍽️ Table for ${safe.guests} — ${safe.branch}, ${safe.when} (${safe.reference})`,
      html: `
        <h2>New Table Reservation</h2>
        <p><strong>Reference:</strong> ${safe.reference}</p>
        <p><strong>Store:</strong> ${safe.branch}</p>
        <p><strong>When:</strong> ${safe.when}</p>
        <p><strong>Party:</strong> ${safe.guests}</p>
        <hr />
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Occasion:</strong> ${safe.occasion}</p>
        <p><strong>Seating:</strong> ${safe.seating}</p>
        <p><strong>Newsletter:</strong> ${safe.updates}</p>
        <p><strong>Notes:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit">${safe.notes}</pre>
      `,
    });

    // The acknowledgement is best effort — the booking is already with the
    // kitchen, so a bounce here must not report failure back to the guest.
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: `Your table at Duffy’s — ${safe.when}`,
        html: `
          <p>Hi ${safe.name},</p>
          <p>Your table at <strong>Duffy’s Burger &amp; Wings</strong> is booked. Give your name at the counter and walk straight in.</p>
          <p>
            <strong>Reference:</strong> ${safe.reference}<br />
            <strong>Store:</strong> ${safe.branch}<br />
            <strong>When:</strong> ${safe.when}<br />
            <strong>Party:</strong> ${safe.guests}
          </p>
          <p>We hold the table for fifteen minutes past your sitting. Need to change or cancel it? Reply to this mail or ring the store — two hours’ notice for a small table, a day for six or more.</p>
          <p>— Duffy’s Team</p>
        `,
      });
    } catch (err) {
      console.error("Reservation auto-reply failed:", err);
    }

    return NextResponse.json({ ok: true, reference });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
