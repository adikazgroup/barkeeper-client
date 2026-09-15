import type { Metadata } from "next";
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
  title: "Refund & Cancellation Policy — Barkeeper",
  description:
    "When Barkeeper subscriptions can be cancelled, when a refund is due, and how refunds are returned to bKash, Nagad, Rocket or card.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "summary",
    title: "The short version",
    body: (
      <>
        <UL>
          <LI>
            The 14-day trial is free and needs no card, so there is nothing to
            refund.
          </LI>
          <LI>
            Cancel any time. Your plan runs to the end of the period you have
            already paid for.
          </LI>
          <LI>
            First paid subscription: full refund within 14 days if the service
            did not work for you.
          </LI>
          <LI>
            Refunds go back to the method you paid with, within 7 to 10 working
            days.
          </LI>
        </UL>
        <P>
          The rest of this page sets out the detail, including the cases where a
          refund is not available.
        </P>
      </>
    ),
  },
  {
    id: "trial",
    title: "The free trial",
    body: (
      <P>
        Every account starts with 14 days free. We do not ask for a card, and
        nothing is charged automatically when the trial ends — the account
        simply pauses until you choose a plan. You will never find a surprise
        charge from a trial you forgot to cancel.
      </P>
    ),
  },
  {
    id: "cancelling",
    title: "Cancelling a subscription",
    body: (
      <>
        <P>
          Cancel from Settings → Billing at any time. Cancellation takes effect
          at the end of the period you have paid for, so a monthly plan
          cancelled on day 3 still runs for the remaining 27 days.
        </P>
        <P>
          We do not charge a cancellation fee, and we do not require notice. You
          can export your data for 30 days after the subscription ends.
        </P>
      </>
    ),
  },
  {
    id: "refunds",
    title: "When you get a refund",
    body: (
      <>
        <Table
          head={["Situation", "What you get"]}
          rows={[
            [
              "First paid subscription, cancelled within 14 days",
              "A full refund, no questions asked.",
            ],
            [
              "We charged you in error",
              "A full refund of the incorrect amount, as soon as we have confirmed it.",
            ],
            ["Duplicate payment", "A full refund of the duplicate."],
            [
              "Extended outage caused by us",
              "A pro-rata credit or refund for the affected days.",
            ],
            [
              "We terminate your account without cause",
              "A pro-rata refund of the unused period.",
            ],
            [
              "Annual plan, cancelled after 14 days",
              "A pro-rata refund of the whole unused months, less any discount you received for paying annually.",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "no-refund",
    title: "When you do not",
    body: (
      <>
        <UL>
          <LI>
            <B>Part-used monthly periods</B> after the first 14 days. The plan
            keeps running to the end of the period instead.
          </LI>
          <LI>
            <B>Accounts we closed for breach</B> of the Terms of Service or the
            Acceptable Use Policy.
          </LI>
          <LI>
            <B>Problems caused by a third-party platform</B> — for example
            Facebook restricting your Page or WhatsApp suspending your number.
          </LI>
          <LI>
            <B>Not using the service.</B> A quiet month is still a month of
            service made available to you.
          </LI>
          <LI>
            <B>Custom development or onboarding work</B> already carried out.
          </LI>
        </UL>
        <Note>
          None of this limits your rights under the Consumer Rights Protection
          Act 2009 or any other Bangladeshi law that applies to you. Where the
          law gives you a stronger remedy than this policy does, the law wins.
        </Note>
      </>
    ),
  },
  {
    id: "how-to-request",
    title: "How to request a refund",
    body: (
      <>
        <P>
          Email{" "}
          <a
            href={`mailto:${COMPANY.email}?subject=${encodeURIComponent("Refund request")}`}
            className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            {COMPANY.email}
          </a>{" "}
          with the subject <B>Refund request</B>, and include:
        </P>
        <UL>
          <LI>The email address on the account.</LI>
          <LI>The invoice number or the date and amount of the payment.</LI>
          <LI>What went wrong, briefly.</LI>
        </UL>
        <P>
          We will reply within 3 working days. If we need more information to
          approve the refund, we will ask for it in that first reply rather than
          stringing the process out.
        </P>
      </>
    ),
  },
  {
    id: "how-refunds-are-paid",
    title: "How refunds are paid",
    body: (
      <>
        <P>
          Refunds go back to the method you paid with. We cannot send a refund
          to a different account or a different wallet, because the payment
          gateway will not allow it.
        </P>
        <Table
          head={["Paid with", "Refund arrives in"]}
          rows={[
            ["bKash, Nagad or Rocket", "3 to 7 working days."],
            [
              "Card",
              "7 to 10 working days, depending on your bank. It may appear on your next statement rather than immediately.",
            ],
            ["Bank transfer", "7 to 10 working days."],
          ]}
        />
        <P>
          Refunds are made in Bangladeshi Taka for the amount originally
          charged. Any gateway or currency conversion fee your bank applies is
          outside our control.
        </P>
      </>
    ),
  },
  {
    id: "chargebacks",
    title: "Chargebacks",
    body: (
      <P>
        Please talk to us before raising a chargeback with your bank or wallet
        provider. A chargeback freezes the account while the dispute runs and
        usually takes far longer than simply asking us for the refund. If a
        chargeback is raised without contacting us first, we may suspend the
        account until the matter is settled.
      </P>
    ),
  },
  {
    id: "price-changes",
    title: "Price changes and failed payments",
    body: (
      <>
        <P>
          We give at least 30 days&rsquo; notice by email before a price change,
          and the new price applies from your next renewal. If you do not want
          to continue at the new price, cancel before the renewal date and
          nothing further is charged.
        </P>
        <P>
          If a payment fails we retry and email you. After 7 days without
          payment we may suspend the account, and after 30 days we may close it.
          Your data stays available for export throughout.
        </P>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: <ContactSection subject="Refund request" />,
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalShell
      title="Refund & Cancellation Policy"
      summary="When you can cancel, when a refund is due, when it is not, and how long the money takes to come back."
      sections={SECTIONS}
      currentHref="/refund-policy"
    />
  );
}
