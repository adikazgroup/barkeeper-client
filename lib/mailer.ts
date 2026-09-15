// @ts-expect-error No type declarations are published for this dependency.
import nodemailer from "nodemailer";

/**
 * SMTP transport for the contact form.
 *
 * Credentials come from the environment — they were hard-coded in the route
 * handler before, which put the mailbox password in the repository. Missing
 * configuration throws here rather than failing silently at send time, so a
 * misconfigured deploy is visible in the logs instead of quietly swallowing
 * every message a customer sends.
 */
export function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS.",
    );
  }

  const port = Number(SMTP_PORT || 465);

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades with STARTTLS after connecting.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/** Where contact messages land, and who they appear to come from. */
export const MAIL_TO = process.env.MAIL_TO || "ask@duffysburgerandwings.com";
export const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || "";
