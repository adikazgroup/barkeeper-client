import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { COMPANY } from "@/lib/dummyData";
import { env } from "@/lib/env";

/**
 * The card every shared link shows unless a route brings its own.
 *
 * Rendered once at build from the logo and a kitchen photo in `public/`, so
 * the preview matches the site rather than a stock placeholder. Twitter/X
 * picks the same image up through the `twitter` fallback in the root layout.
 */
export const alt = `${COMPANY.name}’s — Irish bar & grill in Hill East, Washington DC`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asDataUrl = async (path: string) =>
  `data:image/png;base64,${await readFile(join(process.cwd(), "public", path), "base64")}`;

export default async function OpengraphImage() {
  const [logo, dish] = await Promise.all([
    asDataUrl("logo/logo.png"),
    asDataUrl("food/RedChili_DoubleSmashBurger.png"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#0b0b0d",
        color: "#f9faf0",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dish}
        alt=""
        width={760}
        height={630}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 760,
          height: 630,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          background:
            "linear-gradient(90deg, #0b0b0d 0%, #0b0b0d 36%, rgba(11,11,13,0.7) 50%, rgba(11,11,13,0) 68%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 620,
          height: "100%",
          padding: "72px 0 64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={460} height={155} />
          <div
            style={{
              width: 96,
              height: 6,
              marginTop: 28,
              borderRadius: 3,
              background: "#f68622",
            }}
          />
          <div
            style={{
              marginTop: 32,
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            Wings, burgers &amp; a full bar in Hill East.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 24,
            color: "rgba(249,250,240,0.72)",
          }}
        >
          <div style={{ display: "flex", color: "#f68622", fontWeight: 700 }}>
            Order online · Dine in · Book a table
          </div>
          <div style={{ display: "flex", marginTop: 8 }}>
            {new URL(env.NEXT_PUBLIC_SITE_URL).host} · Washington, DC
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
