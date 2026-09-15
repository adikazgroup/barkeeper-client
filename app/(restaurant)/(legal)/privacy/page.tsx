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
  Table,
  UL,
  type LegalSection,
} from "../_components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Barkeeper",
  description:
    "How Barkeeper collects, uses, shares and protects the personal data of merchants in Bangladesh and the customers who message them.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <P>
          {COMPANY.legalName} (&ldquo;{COMPANY.name}&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) operates an AI agent that answers messages arriving
          on a merchant&rsquo;s social channels, confirms sales, and writes the
          resulting orders into the merchant&rsquo;s store. We are based at{" "}
          {COMPANY.address.full}.
        </P>
        <P>
          This policy covers two very different groups of people, and the
          difference runs through everything below:
        </P>
        <UL>
          <LI>
            <B>Merchants</B> — the businesses that hold an Barkeeper account. We
            decide how their account data is handled, so for that data we are
            the data controller.
          </LI>
          <LI>
            <B>End customers</B> — the people who message a merchant on
            Instagram, Facebook, Messenger, WhatsApp or TikTok. We process their
            messages on the merchant&rsquo;s instructions, which makes the
            merchant the controller and us the processor.
          </LI>
        </UL>
        <Note>
          If you messaged a shop and want to know what happened to your
          conversation, the shop decides that, not us. Ask them first. If you
          cannot reach them, write to {COMPANY.email} and we will pass the
          request on to them.
        </Note>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <Table
          head={["Category", "What it includes"]}
          rows={[
            [
              "Account data",
              "Name, business name, email address, phone number, password hash, and the trade licence or BIN you give us if you ask for a VAT invoice.",
            ],
            [
              "Channel data",
              "The access tokens, page IDs and account IDs you authorise when you connect Facebook, Instagram, WhatsApp Business or TikTok.",
            ],
            [
              "Conversation data",
              "Messages, comments, attachments and sender profile details — name, profile photo, platform user ID — arriving on the channels you have connected.",
            ],
            [
              "Catalogue data",
              "Products, variants, prices, stock levels and delivery rules you upload or sync, so the agent can quote them accurately.",
            ],
            [
              "Order data",
              "Names, delivery addresses, phone numbers, order contents and payment status captured in a conversation and written to your store.",
            ],
            [
              "Billing data",
              "Plan, invoices and payment status. Card numbers and mobile wallet PINs never reach us — the payment gateway handles those.",
            ],
            [
              "Technical data",
              "IP address, browser and device type, pages viewed, and error logs, collected to keep the service running and secure.",
            ],
          ]}
        />
        <P>
          We do not ask for national ID numbers, dates of birth or any special
          category data, and the agent is not built to collect them. If an end
          customer volunteers something sensitive in a message, it is stored as
          part of that conversation and protected the same way as the rest of
          it.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <UL>
          <LI>
            <B>To run the service</B> — reading incoming messages, drafting
            replies in your voice, quoting your catalogue, and creating orders.
          </LI>
          <LI>
            <B>To bill you</B> — issuing invoices, taking subscription payments,
            and following up failed ones.
          </LI>
          <LI>
            <B>To support you</B> — answering your questions, which sometimes
            means our staff opening a specific conversation you have pointed us
            to.
          </LI>
          <LI>
            <B>To keep the service safe</B> — detecting abuse, fraud and
            intrusion attempts, and meeting our obligations under Bangladeshi
            law.
          </LI>
          <LI>
            <B>To improve the product</B> — using aggregated usage statistics
            that identify no person and no business.
          </LI>
        </UL>
        <Note>
          We do not sell personal data. We do not use your conversations or your
          customers&rsquo; messages to train general-purpose AI models, and our
          AI providers are contractually barred from doing so with the data we
          send them.
        </Note>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Why we are allowed to",
    body: (
      <>
        <P>
          Bangladesh does not yet have a single comprehensive data protection
          statute in force. We therefore hold ourselves to the standards that do
          apply to us and to the ones our merchants&rsquo; customers reasonably
          expect:
        </P>
        <UL>
          <LI>
            <B>Contract</B> — most processing is simply what is needed to
            deliver the service you signed up for.
          </LI>
          <LI>
            <B>Consent</B> — you consent when you connect a channel and grant
            the permissions requested; you withdraw it by disconnecting that
            channel.
          </LI>
          <LI>
            <B>Legal obligation</B> — tax and company records we are required to
            keep, and lawful requests from Bangladeshi authorities.
          </LI>
          <LI>
            <B>Legitimate interests</B> — security, fraud prevention and product
            improvement, where those interests do not override anyone&rsquo;s
            rights.
          </LI>
        </UL>
        <P>
          Where a merchant serves customers in the EU or UK, the GDPR may apply
          to that merchant. In those cases we act as processor under a data
          processing agreement, which we will provide on request.
        </P>
      </>
    ),
  },
  {
    id: "platform-data",
    title: "Data from Meta and other platforms",
    body: (
      <>
        <P>
          When you connect Facebook, Instagram or WhatsApp, we receive data
          through Meta&rsquo;s official APIs under permissions you approve. We
          use it only to provide the features you asked for, and we comply with
          the Meta Platform Terms and Developer Policies, including their limits
          on retention and onward transfer.
        </P>
        <UL>
          <LI>
            We request the narrowest set of permissions that makes a feature
            work, and drop permissions we no longer need.
          </LI>
          <LI>
            Platform data is never sold, never used for advertising, and never
            combined with data belonging to another merchant.
          </LI>
          <LI>
            Disconnecting a channel revokes our access immediately and starts
            deletion of the data we held for it.
          </LI>
        </UL>
        <P>
          You can delete platform data at any time by following our{" "}
          <Link
            href="/data-deletion"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            data deletion instructions
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <P>
          We share personal data only with the providers we need in order to run
          Barkeeper, each under a contract that limits them to our instructions:
        </P>
        <Table
          head={["Recipient", "Why"]}
          rows={[
            ["Cloud hosting", "Running the application and storing your data."],
            [
              "AI providers",
              "Generating the agent's replies. Data sent for this purpose is not retained for training.",
            ],
            [
              "Messaging platforms",
              "Meta and TikTok, to receive and send the messages you have authorised.",
            ],
            [
              "Payment gateway",
              "Taking subscription payments by card, bKash, Nagad or Rocket.",
            ],
            [
              "Email and SMS",
              "Sending verification codes, invoices and service notices.",
            ],
            [
              "Analytics and error tracking",
              "Understanding usage in aggregate and diagnosing faults.",
            ],
          ]}
        />
        <P>
          We will also disclose data where we are legally required to — a court
          order or a lawful request from a Bangladeshi authority — and where it
          is necessary to establish or defend a legal claim. If Barkeeper is
          acquired or merged, data transfers with the business, and we will tell
          you before that happens.
        </P>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Where your data is stored",
    body: (
      <>
        <P>
          Our servers and several of our providers are located outside
          Bangladesh, so running the service involves transferring data abroad.
          Where a provider is in a country without an equivalent data protection
          regime, we rely on contractual safeguards — standard contractual
          clauses or their equivalent — to keep the protections travelling with
          the data.
        </P>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <Table
          head={["Data", "Kept for"]}
          rows={[
            [
              "Account data",
              "While your account is open, then 90 days after closure.",
            ],
            [
              "Conversation data",
              "24 months by default, or the shorter period you set in your account.",
            ],
            [
              "Order data",
              "As long as your account is open, since you rely on it as business records.",
            ],
            [
              "Invoices and tax records",
              "Five years, as required by Bangladeshi tax law. This applies even after you delete your account.",
            ],
            ["Security and access logs", "12 months."],
            [
              "Backups",
              "Rolling 30 days. Deleted data disappears from backups within that window.",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <UL>
          <LI>
            Traffic is encrypted in transit with TLS, and data is encrypted at
            rest.
          </LI>
          <LI>
            Passwords are hashed, never stored in a readable form, and never
            visible to our staff.
          </LI>
          <LI>
            Access to production data is limited to the staff who need it, and
            every access is logged.
          </LI>
          <LI>
            Channel access tokens are stored encrypted and are usable only by
            the account that authorised them.
          </LI>
        </UL>
        <P>
          No system is perfectly secure. If a breach affects your data, we will
          tell you and the relevant authorities without undue delay, and explain
          what happened and what we are doing about it.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <UL>
          <LI>
            <B>Access</B> — ask what we hold about you and get a copy.
          </LI>
          <LI>
            <B>Correction</B> — have anything inaccurate fixed.
          </LI>
          <LI>
            <B>Deletion</B> — have your data erased, subject to records we must
            keep by law.
          </LI>
          <LI>
            <B>Export</B> — take your orders, customers and catalogue with you
            in a machine-readable file.
          </LI>
          <LI>
            <B>Objection</B> — object to processing based on our legitimate
            interests.
          </LI>
          <LI>
            <B>Withdraw consent</B> — disconnect a channel at any time, without
            affecting anything done before you did.
          </LI>
        </UL>
        <P>
          Write to {COMPANY.email} to exercise any of these. We will respond
          within 30 days and will not charge you. If you are unhappy with the
          outcome, you may complain to the Directorate of National Consumer
          Rights Protection or take the matter to the courts of Dhaka.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        Barkeeper is a business tool and is not for anyone under 18. We do not
        knowingly collect data from children. If you believe a child&rsquo;s
        data has reached us, tell us and we will delete it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        We update this policy when the service or the law changes. The effective
        date at the top always reflects the current version. If a change
        materially affects your rights, we will email you at least 14 days
        before it takes effect.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: <ContactSection subject="Privacy enquiry" />,
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      summary="What we collect, why we collect it, who we share it with, and how you get it back or get it deleted."
      sections={SECTIONS}
      currentHref="/privacy"
    />
  );
}
