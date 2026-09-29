import { NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/auth/api";

/**
 * The contact form's route — a pass-through to the backend's `POST /contacts`,
 * which saves the message (the panel reads it from there) and sends the
 * visitor their "we have received your message" email.
 *
 * Answers `{ ok, message }` or `{ ok: false, error }`, with the backend's own
 * words: a validation refusal names the field that needs fixing.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  const text = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";
  const phone = text(body?.phone);

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: text(body?.name),
        email: text(body?.email),
        ...(phone ? { phone } : {}),
        message: text(body?.message),
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Contact request failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not reach the kitchen. Try again in a moment.",
      },
      { status: 503 },
    );
  }

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    errorMessages?: { path?: string; message?: string }[];
  } | null;

  if (!response.ok || !payload?.success) {
    // "Validation Error" alone tells a visitor nothing — lead with the field.
    const fieldError = payload?.errorMessages?.find(
      (entry) => entry.message,
    )?.message;

    return NextResponse.json(
      {
        ok: false,
        error:
          fieldError || payload?.message || "Your message could not be sent.",
      },
      { status: response.status || 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: payload.message || "We have received your message.",
  });
}
