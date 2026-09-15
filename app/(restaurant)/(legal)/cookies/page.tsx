import type { Metadata } from "next";
import Link from "next/link";
import {
  B,
  ContactSection,
  LI,
  LegalShell,
  Note,
  P,
  Table,
  UL,
  type LegalSection,
} from "../_components/LegalShell";

export const metadata: Metadata = {
  title: "Cookie Policy — Barkeeper",
  description:
    "The cookies and local storage Barkeeper uses, what each one is for, how long it lasts, and how to turn off the ones that are optional.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "what-they-are",
    title: "What cookies are",
    body: (
      <>
        <P>
          Cookies are small files a website stores in your browser so it can
          recognise you on your next request. We also use <B>local storage</B>,
          which works similarly but stays on your device rather than travelling
          with every request — your theme choice is kept that way.
        </P>
        <P>
          This page covers both. We keep the list short deliberately: the fewer
          things we store, the less there is to explain.
        </P>
      </>
    ),
  },
  {
    id: "what-we-use",
    title: "What we use",
    body: (
      <>
        <Table
          head={["Name", "Purpose and lifetime"]}
          rows={[
            [
              "Session token",
              "Keeps you signed in. Strictly necessary. Expires when the session ends or after 30 days, whichever is first.",
            ],
            [
              "CSRF token",
              "Stops other sites submitting forms as you. Strictly necessary. Expires with the session.",
            ],
            [
              "theme",
              "Remembers whether you chose light, dark or system. Local storage, kept until you clear it.",
            ],
            [
              "Analytics",
              "Counts page views and measures which features get used, in aggregate. Optional. Expires after 12 months.",
            ],
          ]}
        />
        <P>
          We do not use advertising cookies, cross-site tracking pixels, or
          anything that follows you to other websites.
        </P>
      </>
    ),
  },
  {
    id: "categories",
    title: "The two categories",
    body: (
      <UL>
        <LI>
          <B>Strictly necessary</B> — the service does not work without them.
          Signing in, staying signed in, and being protected from forged
          requests. These cannot be turned off, and we do not ask for consent
          for them because there is nothing meaningful to consent to.
        </LI>
        <LI>
          <B>Optional</B> — analytics. Turning these off costs you nothing and
          changes nothing about how the product behaves for you.
        </LI>
      </UL>
    ),
  },
  {
    id: "third-party",
    title: "Third parties",
    body: (
      <>
        <P>
          Our analytics and error tracking providers set cookies on our behalf.
          They act as our processors, they may not use the data for their own
          purposes, and they do not build advertising profiles from it.
        </P>
        <P>
          Pages that embed content from a messaging platform — for example a
          Facebook login dialog — will involve that platform&rsquo;s own
          cookies, governed by its policy rather than ours.
        </P>
      </>
    ),
  },
  {
    id: "managing",
    title: "Turning them off",
    body: (
      <>
        <UL>
          <LI>
            <B>In Barkeeper</B> — Settings → Privacy has a switch for analytics.
          </LI>
          <LI>
            <B>In your browser</B> — every major browser lets you block or
            delete cookies for a site. Look under Settings → Privacy.
          </LI>
        </UL>
        <Note>
          Blocking strictly necessary cookies will sign you out and keep you
          signed out. That is not a fault — there is no way to hold a session
          without them.
        </Note>
      </>
    ),
  },
  {
    id: "do-not-track",
    title: "Do Not Track",
    body: (
      <P>
        We honour the <B>Global Privacy Control</B> signal: if your browser
        sends it, we disable analytics for you automatically and you do not need
        to change anything. The older Do Not Track header has no agreed meaning,
        so we do not rely on it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: (
      <P>
        If we add a cookie, this page is updated before it goes live. The
        effective date at the top tells you which version you are reading. What
        we collect and why is set out more fully in our{" "}
        <Link
          href="/privacy"
          className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: <ContactSection subject="Cookie policy enquiry" />,
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      summary="A short list, because we store very little: what each cookie does, how long it lasts, and how to switch off the optional ones."
      sections={SECTIONS}
      currentHref="/cookies"
    />
  );
}
