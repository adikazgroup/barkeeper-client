import { NextResponse } from "next/server";

import { authFetch, AuthApiError } from "./api";

/**
 * The three sign-in routes under `app/api/account/` differ only in which
 * backend endpoint they hit and what they post to it, so the request/response
 * handling lives here once.
 *
 * Why these exist at all: the browser never talks to `/auth/login` itself. It
 * posts here, this runs on our server, and the access token that comes back is
 * handed to NextAuth's `signIn()`. Going through our own route is what lets the
 * form show the backend's own message — "Please verify your email" has to reach
 * the customer intact, because it decides which screen they see next.
 */
export async function exchangeForAccessToken(
  path: string,
  body: Record<string, unknown>,
) {
  try {
    const result = await authFetch<{ accessToken: string }>(path, body);

    if (!result.data?.accessToken) {
      return NextResponse.json(
        { message: "The server did not return a session. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      accessToken: result.data.accessToken,
      message: result.message,
    });
  } catch (error) {
    if (error instanceof AuthApiError) {
      return NextResponse.json(
        { message: error.message },
        // A network failure has no HTTP status of its own; 503 is the closest
        // honest answer and keeps the client's error handling uniform.
        { status: error.status || 503 },
      );
    }

    console.error(`Unexpected failure while signing in via ${path}:`, error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/** Reads a JSON body without letting malformed input throw a 500. */
export async function readJson(
  request: Request,
): Promise<Record<string, unknown>> {
  return ((await request.json().catch(() => null)) ??
    {}) as Record<string, unknown>;
}
