import type { NextConfig } from "next";

// Best-effort origin for connect-src — next.config.ts runs before lib/env.ts's
// strict validation is relevant, so fall back quietly instead of throwing.
function apiOrigin(): string | null {
  try {
    return process.env.NEXT_PUBLIC_BACKEND_URL
      ? new URL(process.env.NEXT_PUBLIC_BACKEND_URL).origin
      : null;
  } catch {
    return null;
  }
}

function apiPort(): string | null {
  try {
    return process.env.NEXT_PUBLIC_BACKEND_URL
      ? new URL(process.env.NEXT_PUBLIC_BACKEND_URL).port || null
      : null;
  } catch {
    return null;
  }
}

// script-src/style-src need 'unsafe-inline': the theme-flash script in
// app/layout.tsx and the dynamic inline `style={{ top, left, width }}`
// positioning used throughout components/ui/ (Select, dropdowns, Calendar)
// are both inline. A nonce-based CSP would remove the need for this but
// requires threading a per-request nonce through proxy.ts into layout.tsx —
// a further hardening step beyond what this template sets up out of the box.
//
// 'unsafe-eval' is added in dev only: React uses eval() in development to
// reconstruct server-side error call stacks in the browser. Neither React
// nor Next.js use eval() in production, so it's left out of the prod CSP.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // In dev, also allow the API's port on *any* host: lib/axios.ts swaps
  // "localhost" for the page's own hostname when opened from another
  // device on the LAN (via Next's "Network:" URL), and the exact-origin
  // rule alone can't predict what that hostname will be ahead of time.
  `connect-src 'self'${apiOrigin() ? ` ${apiOrigin()}` : ""}${isDev && apiPort() ? ` http://*:${apiPort()}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Lets phones/other PCs on the same Wi-Fi load the dev server via Next's
  // printed "Network:" URL. Without this, Next 16 silently blocks the dev
  // JS bundle/HMR for any origin but localhost, so the page never
  // hydrates there — forms then submit as plain (insecure!) GET requests
  // instead of React's onSubmit handler intercepting them, which is
  // exactly the symptom that showed up as `GET /login?email=...&password=...`.
  // IPs from DHCP change — update this if your machine gets a new one
  // (check with `ipconfig` on Windows).
  allowedDevOrigins: ["192.168.10.239"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
