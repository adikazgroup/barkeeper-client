import type { Metadata } from "next";

import { TransactionsView } from "../_components/TransactionsView";

export const metadata: Metadata = {
  title: "Your Transactions | Barkeeper’s",
  description:
    "Every payment, refund and reward on your Barkeeper’s account, with what each one was against.",
};

export default function TransactionsPage() {
  return (
    <>
      <header className="border-b border-border/50 px-5 py-8 sm:px-8">
        <h1 className="text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[32px]">
          Transactions
        </h1>
        <p className="mt-3 max-w-[56ch] text-[13.5px] leading-[1.7] text-muted-foreground">
          Every payment, refund and reward on the account — what moved, when,
          and which docket it was against.
        </p>
      </header>

      <TransactionsView />
    </>
  );
}
