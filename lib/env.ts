/**
 * The environment, read once and in one place.
 *
 * Reading `process.env` inline scatters the same string literal through the
 * codebase and hides a missing value until whatever needed it runs. Everything
 * below is resolved here instead, so a misconfigured deployment is visible at
 * the import rather than three clicks into a page.
 *
 * Only `NEXT_PUBLIC_*` names may be read from client code: Next inlines those
 * at build time and leaves every other name undefined in the browser.
 */

/** Where this deployment is served from, used to build absolute URLs. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://barkeeper.com"
    : "http://localhost:3000");

export const env = {
  /** No trailing slash, so `${SITE_URL}/sitemap.xml` is always well formed. */
  NEXT_PUBLIC_SITE_URL: SITE_URL,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
} as const;
