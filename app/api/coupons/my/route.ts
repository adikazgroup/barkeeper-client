import { NextResponse } from "next/server";

import { couponFetch } from "@/lib/coupons/server";
import { toMyCoupons } from "@/lib/coupons/types";

/**
 * `GET /coupons/my` — the codes an admin put on this account that are still
 * redeemable. Codes issued to everyone are deliberately not in here, so an
 * empty list means "nothing of your own", not "no offers on".
 */
export async function GET() {
  const result = await couponFetch("/my");

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json(
    { coupons: toMyCoupons(result.data), message: result.message },
    { status: 200 },
  );
}
