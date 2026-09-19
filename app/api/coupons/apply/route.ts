import { NextResponse, type NextRequest } from "next/server";

import { couponFetch } from "@/lib/coupons/server";
import { toAppliedCoupon } from "@/lib/coupons/types";

/**
 * `POST /coupons/apply` — try a code against the docket and find out what it
 * is worth.
 *
 * It writes nothing: the answer is a quote on the cart as it stands, which is
 * why the client re-asks whenever a line changes rather than holding a figure.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    code?: unknown;
  } | null;

  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!code) {
    return NextResponse.json({ message: "Enter a code." }, { status: 400 });
  }

  const result = await couponFetch("/apply", {
    method: "POST",
    body: { code },
  });

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  const coupon = toAppliedCoupon(result.data);

  if (!coupon) {
    return NextResponse.json(
      { message: "That code could not be used." },
      { status: 422 },
    );
  }

  return NextResponse.json(
    { coupon, message: result.message },
    { status: 200 },
  );
}
