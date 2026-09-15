import { NextResponse } from "next/server";

import { exchangeForAccessToken, readJson } from "@/lib/auth/session-routes";

export async function POST(request: Request) {
  const { email, password } = await readJson(request);

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  return exchangeForAccessToken("/auth/login", { email, password });
}
