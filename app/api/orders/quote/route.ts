import { NextResponse, type NextRequest } from "next/server";

import { readOrderInput } from "@/lib/orders/input";
import { orderError, orderFetch } from "@/lib/orders/server";
import { toQuote } from "@/lib/orders/types";

/**
 * `POST /orders/quote` — what the docket would cost if it were placed now.
 *
 * It writes nothing, which is why the checkout screen may ask as often as it
 * likes: every change to the tip, the code or the pickup time is another quote
 * rather than a sum worked out in the browser.
 */
export async function POST(request: NextRequest) {
  const { input, error } = readOrderInput(
    await request.json().catch(() => null),
  );

  if (error) return NextResponse.json({ message: error }, { status: 400 });

  const result = await orderFetch("/quote", { method: "POST", body: input });

  if (!result.ok) return orderError(result);

  const quote = toQuote(result.data);

  if (!quote) {
    return NextResponse.json(
      { message: "The docket could not be priced." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { quote, message: result.message },
    { status: 200 },
  );
}
