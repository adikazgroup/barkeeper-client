import type { Metadata } from "next";

import { UnsubscribeForm } from "./_components/UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe | Barkeeper’s",
  description: "Take your address off the Barkeeper’s mailing list.",
  // A page reached from a mailing, not one to be found in a search.
  robots: { index: false, follow: false },
};

/**
 * Where a mailing's footer link lands: `/unsubscribe?email=…`.
 *
 * The address arrives in the query so the reader has nothing to type, but it
 * is only a default — the form still asks, because a forwarded link must not
 * unsubscribe whoever forwarded it.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main>
      <section className="mx-auto max-w-7xl border-x border-border/50 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            Mailing list
          </p>

          <h1 className="mx-auto mt-5 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[30px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[40px]">
            Stop the emails
          </h1>

          <p className="mx-auto mt-5 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
            One click and we will leave you alone. Your account and any order
            you have placed stay exactly as they are.
          </p>
        </div>

        <div className="mt-10">
          <UnsubscribeForm defaultEmail={email ?? ""} />
        </div>
      </section>
    </main>
  );
}
