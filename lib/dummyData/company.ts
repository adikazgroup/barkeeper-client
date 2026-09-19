/**
 * Single source of truth for the details that appear across the legal pages,
 * the footer and the contact links.
 *
 * These are quoted verbatim in binding documents, so they live in one place —
 * an address that disagrees between the Terms and the Privacy Policy is the
 * kind of thing that undermines both.
 */
export const COMPANY = {
  /** Trading name, as used in copy. */
  name: "Barkeeper",
  /** Full name used where a document needs to identify the operator. */
  legalName: "Barkeeper Commerce",
  email: "contact@barkeeper.com",
  /** Shown on the contact page and dialled from it, so it lives here too. */
  phone: "+880 1700 000000",
  address: {
    /** Street and suite — the first line of a postal address. */
    street: "1901 C Street SE, Suite B",
    /** City, state and ZIP — the second line. */
    locality: "Washington, DC 20003",
    /** One-line form for signatures and footers. */
    full: "1901 C Street SE, Suite B, Washington, DC 20003",
  },
} as const;

/**
 * The date the current wording of the legal pages took effect. Bump this
 * whenever the substance of any policy changes — visitors and regulators both
 * read it as a promise about which version they are looking at.
 */
export const POLICY_EFFECTIVE_DATE = "9 September 2026";

/** The policy pages, in the order the footer and sitemap should list them. */
export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;
