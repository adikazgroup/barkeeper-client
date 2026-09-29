export const COMPANY = {
  /** Trading name, as used in copy. */
  name: "Barkeeper",
  legalName: "Barkeeper's Bar & grill",
  email: "ask@barkeepersdc.com",
  phone: "(202) 878 8077",
  address: {
    street: "1901 C Street SE, Suite B",
    locality: "Washington, DC 20003",
    full: "1901 C Street SE, Suite B, Washington, DC 20003",
  },
} as const;

export const POLICY_EFFECTIVE_DATE = "9 September 2026";

/** The policy pages, in the order the footer and sitemap should list them. */
export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;
