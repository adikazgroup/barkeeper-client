import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/dummyData";
import {
  B,
  ContactSection,
  LI,
  LegalShell,
  Note,
  P,
  UL,
  type LegalSection,
} from "../_components/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service — Barkeeper",
  description:
    "The agreement between Barkeeper and the merchants who use it: accounts, billing in BDT, acceptable use, liability and Bangladeshi governing law.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "The agreement",
    body: (
      <>
        <P>
          These terms are a contract between you — the business opening the
          account — and {COMPANY.legalName} of {COMPANY.address.full}. By
          creating an account or using Barkeeper you accept them. If you are
          accepting on behalf of a company, you confirm you are authorised to
          bind it.
        </P>
        <P>
          Our{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          ,{" "}
          <Link
            href="/acceptable-use"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Acceptable Use Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/refund-policy"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Refund &amp; Cancellation Policy
          </Link>{" "}
          form part of this agreement.
        </P>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use Barkeeper",
    body: (
      <UL>
        <LI>You must be at least 18 years old.</LI>
        <LI>
          You must be selling as a business. Barkeeper is not a consumer product.
        </LI>
        <LI>
          You must hold whatever licences your trade requires — for most sellers
          in Bangladesh that means a valid trade licence, and a BIN if you are
          VAT-registered.
        </LI>
        <LI>
          You must not be barred from receiving our services under any law that
          applies to us.
        </LI>
      </UL>
    ),
  },
  {
    id: "your-account",
    title: "Your account",
    body: (
      <>
        <P>
          You are responsible for everything that happens under your account,
          including anything your staff do with it. Keep your password secret,
          use a strong one, and tell us at once if you think someone else has
          got in.
        </P>
        <P>
          Give us accurate details and keep them current. We may suspend an
          account whose details we cannot verify.
        </P>
      </>
    ),
  },
  {
    id: "the-service",
    title: "What the service does",
    body: (
      <>
        <P>
          Barkeeper connects to the messaging channels you authorise, replies to
          incoming messages using an AI agent configured with your catalogue and
          your instructions, and records confirmed sales as orders.
        </P>
        <Note>
          <B>The agent can be wrong.</B> It is software, and it will sometimes
          misread a message, quote the wrong variant or misjudge a request. You
          are responsible for what it sends on your behalf and for the orders it
          creates. Review its work, set the handoff rules that matter to your
          business, and do not use it unsupervised for anything you cannot
          afford to get wrong.
        </Note>
      </>
    ),
  },
  {
    id: "third-party-platforms",
    title: "Facebook, Instagram, WhatsApp and TikTok",
    body: (
      <>
        <P>
          Barkeeper works on top of platforms we do not control. Your use of each
          connected channel is also governed by that platform&rsquo;s own terms,
          and you are responsible for complying with them — including their
          rules on messaging windows, opt-in, and promotional content.
        </P>
        <UL>
          <LI>
            A platform may change or withdraw its APIs at any time. If a feature
            stops working because a platform changed something, that is not a
            breach of this agreement by us.
          </LI>
          <LI>
            A platform may restrict or ban your account for reasons of its own.
            We cannot reverse that, and we are not liable for it.
          </LI>
          <LI>
            You confirm you have the right to connect each channel and to let us
            act on it.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "billing",
    title: "Plans, billing and VAT",
    body: (
      <>
        <UL>
          <LI>
            <B>Currency</B> — prices are in Bangladeshi Taka (BDT) unless stated
            otherwise.
          </LI>
          <LI>
            <B>VAT</B> — prices are exclusive of VAT. Where VAT applies, it is
            added at the rate in force and shown on your invoice. Give us your
            BIN if you need a VAT invoice.
          </LI>
          <LI>
            <B>Payment</B> — by card, bKash, Nagad or Rocket through our payment
            gateway. Subscriptions renew automatically for the same period
            unless you cancel first.
          </LI>
          <LI>
            <B>Trial</B> — 14 days free, no card required. At the end of the
            trial the account pauses until you choose a plan; nothing is charged
            automatically.
          </LI>
          <LI>
            <B>Failed payments</B> — we will retry and email you. If payment is
            still outstanding after 7 days we may suspend the account, and after
            30 days we may close it.
          </LI>
          <LI>
            <B>Price changes</B> — we will give you at least 30 days&rsquo;
            notice by email. A price change takes effect at your next renewal,
            and you may cancel before then.
          </LI>
        </UL>
        <P>
          Cancellations and refunds are covered by our{" "}
          <Link
            href="/refund-policy"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Refund &amp; Cancellation Policy
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content and your data",
    body: (
      <>
        <P>
          Your catalogue, your conversations, your customers and your orders
          remain yours. We claim no ownership of them.
        </P>
        <P>
          You grant us a limited, non-exclusive licence to host, process and
          transmit that content strictly for the purpose of providing the
          service to you. That licence ends when you delete the content or close
          your account.
        </P>
        <P>
          You are responsible for having the right to give us what you upload,
          and for making sure your customers have been told their messages are
          handled by an AI agent where the law or the platform requires it.
        </P>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <P>
        You must follow our{" "}
        <Link
          href="/acceptable-use"
          className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Acceptable Use Policy
        </Link>
        . In short: no spam, no illegal goods, no impersonation, no attempts to
        break the service, and nothing that would get either of us thrown off a
        messaging platform.
      </P>
    ),
  },
  {
    id: "availability",
    title: "Availability and support",
    body: (
      <>
        <P>
          We aim for 99.5% monthly uptime, excluding scheduled maintenance we
          have announced in advance and outages caused by a third-party platform
          or your own systems. We are not offering a contractual service credit
          unless your plan says so in writing.
        </P>
        <P>
          Support is by email at {COMPANY.email} during business hours, Sunday
          to Thursday, Bangladesh Standard Time.
        </P>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    body: (
      <>
        <P>
          <B>You</B> may cancel at any time from your account settings. The
          service continues to the end of the period you have paid for.
        </P>
        <P>
          <B>We</B> may suspend or terminate an account that breaches these
          terms, that has not paid, that is being used unlawfully, or that puts
          the service or another user at risk. Where the circumstances allow it
          we will warn you first and give you a chance to put things right.
        </P>
        <P>
          After termination you have 30 days to export your data. After that we
          delete it, keeping only the records we are legally required to hold.
        </P>
      </>
    ),
  },
  {
    id: "ip",
    title: "Our intellectual property",
    body: (
      <P>
        The Barkeeper platform, its software, design, name and marks belong to us.
        Nothing in this agreement transfers any of it to you. You may not copy,
        decompile, resell or white-label the service, or use it to build a
        competing product.
      </P>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <P>
        The service is provided &ldquo;as is&rdquo;. To the fullest extent the
        law allows, we exclude all implied warranties, including
        merchantability, fitness for a particular purpose and non-infringement.
        We do not warrant that the service will be uninterrupted, error-free, or
        that the agent&rsquo;s replies will be accurate or suitable for any
        particular conversation.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <P>
          To the fullest extent the law allows, neither party is liable for
          indirect or consequential loss, loss of profit, loss of business, or
          loss of goodwill.
        </P>
        <P>
          Our total liability arising out of this agreement in any 12-month
          period is limited to the fees you paid us in the 12 months before the
          claim arose.
        </P>
        <Note>
          Nothing here limits liability for death or personal injury caused by
          negligence, for fraud, or for anything else that cannot lawfully be
          limited under Bangladeshi law — including your rights under the
          Consumer Rights Protection Act 2009 where it applies to you.
        </Note>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <P>
        You will indemnify us against claims, losses and reasonable legal costs
        arising from your use of the service in breach of this agreement, from
        content you put through it, or from goods and services you sell to your
        customers.
      </P>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    body: (
      <>
        <P>
          This agreement is governed by the laws of the People&rsquo;s Republic
          of Bangladesh. The courts of Dhaka have exclusive jurisdiction.
        </P>
        <P>
          Before going to court, both sides agree to try to settle the matter in
          good faith by writing to the other and allowing 30 days to resolve it.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <P>
        We may update these terms. For material changes we will email you at
        least 30 days before they take effect. Continuing to use Barkeeper after
        that date means you accept the new terms; if you do not, cancel before
        then and we will refund the unused part of your current period.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: <ContactSection subject="Terms of Service enquiry" />,
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      summary="The agreement between us: what you can expect from Barkeeper, what we expect from you, and what happens when something goes wrong."
      sections={SECTIONS}
      currentHref="/terms"
    />
  );
}
