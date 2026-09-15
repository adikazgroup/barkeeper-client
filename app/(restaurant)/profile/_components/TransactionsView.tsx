"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CreditCard, Info, Leaf, TrendingUp, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/price";
import {
  demoTransactions,
  demoUser,
  formatDateTime,
  monthKeyOf,
  transactionStatusMeta,
  type Transaction,
  type TransactionKind,
} from "../_data";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

const filters: { id: string; label: string; kind: TransactionKind | null }[] = [
  { id: "all", label: "All", kind: null },
  { id: "payment", label: "Payments", kind: "payment" },
  { id: "refund", label: "Refunds", kind: "refund" },
  { id: "reward", label: "Rewards", kind: "reward" },
];

/** The mark each kind of movement wears in the list. */
const kindMeta: Record<
  TransactionKind,
  { icon: typeof CreditCard; className: string }
> = {
  payment: { icon: CreditCard, className: "bg-primary/10 text-primary" },
  refund: {
    icon: Undo2,
    className: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  },
  reward: {
    icon: Leaf,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
};

/** The month the summary tile reports on — the newest one on the account. */
const currentMonth = demoTransactions.reduce(
  (latest, entry) =>
    monthKeyOf(entry.date) > latest ? monthKeyOf(entry.date) : latest,
  "",
);

/**
 * Every movement on the account.
 *
 * The four figures are the home page's service strip; the filters are the
 * board's counter rail; the movements themselves are a table once there is
 * width for one, and the same rows stacked when there is not. Nothing floats —
 * every part is a ruled row of the page's frame.
 */
export function TransactionsView() {
  const [filter, setFilter] = useState("all");

  const summary = useMemo(() => {
    let spent = 0;
    let thisMonth = 0;
    let refunded = 0;

    for (const entry of demoTransactions) {
      // A charge that never went through is not money the customer spent.
      if (entry.status === "failed") continue;

      if (entry.amount > 0) {
        spent += entry.amount;
        if (monthKeyOf(entry.date) === currentMonth) thisMonth += entry.amount;
      } else {
        refunded += Math.abs(entry.amount);
      }
    }

    return { spent, thisMonth, refunded };
  }, []);

  const visible = useMemo(() => {
    const kind = filters.find((entry) => entry.id === filter)?.kind;
    return kind
      ? demoTransactions.filter((entry) => entry.kind === kind)
      : demoTransactions;
  }, [filter]);

  return (
    <div>
      {/* What the account has cost, in four figures. */}
      <ul
        className={cn(
          "grid grid-cols-2 border-b border-border/50 bg-card/20 lg:grid-cols-4",
          CELL,
        )}
      >
        <SummaryCell
          label="Total paid"
          value={formatMoney(summary.spent)}
          icon={<CreditCard className="size-3.5" />}
        />
        <SummaryCell
          label="This month"
          value={formatMoney(summary.thisMonth)}
          icon={<TrendingUp className="size-3.5" />}
          accent
          ruled
        />
        <SummaryCell
          label="Refunded"
          value={formatMoney(summary.refunded)}
          icon={<Undo2 className="size-3.5" />}
          className="border-t border-border/50 pt-5 lg:border-t-0 lg:pt-0"
          ruledFrom="lg"
        />
        <SummaryCell
          label="Clover points"
          value={demoUser.loyaltyPoints.toLocaleString("en-IE")}
          icon={<Leaf className="size-3.5" />}
          className="border-t border-border/50 pt-5 lg:border-t-0 lg:pt-0"
          ruled
        />
      </ul>

      <div
        className={cn(
          "flex flex-col gap-3 border-b border-border/50 py-5 sm:flex-row sm:items-center sm:justify-between",
          CELL,
        )}
      >
        <div
          role="tablist"
          aria-label="Filter transactions by type"
          className="scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
        >
          {filters.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={filter === entry.id}
              onClick={() => setFilter(entry.id)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                filter === entry.id
                  ? "bg-primary text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => toast("Statements land with accounts.", { icon: "🍀" })}
          className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[13.5px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Download statement
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="px-5 py-20 text-center sm:px-8 sm:py-24">
          <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
            <CreditCard className="size-4.5" />
          </span>

          <h3 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[26px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[32px]">
            Nothing of that kind yet
          </h3>

          <p className="mx-auto mt-4 max-w-[46ch] text-[13.5px] leading-[1.7] text-muted-foreground">
            Clear the filter to see every movement on the account.
          </p>
        </div>
      ) : (
        <>
          {/* A table is the right shape for this, but only once there's width
              for it. Below `lg` the same rows are read as stacked cards. */}
          <table className="hidden w-full lg:table">
            <caption className="sr-only">
              Payments, refunds and rewards on your account
            </caption>
            <thead>
              <tr className="border-b border-border/50">
                {["Transaction", "Date", "Method", "Status", "Amount"].map(
                  (heading, index) => (
                    <th
                      key={heading}
                      scope="col"
                      className={cn(
                        "py-4 font-mono text-[10.5px] font-normal tracking-[0.16em] text-muted-foreground uppercase",
                        index === 0 && "pl-5 sm:pl-8",
                        index === 4
                          ? "pr-5 text-right sm:pr-8"
                          : "pr-5 text-left",
                      )}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {visible.map((entry) => (
                <TransactionRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>

          <ul role="list" className="divide-y divide-border/50 lg:hidden">
            {visible.map((entry) => (
              <TransactionCard key={entry.id} entry={entry} />
            ))}
          </ul>
        </>
      )}

      <p
        className={cn(
          "flex items-start gap-2.5 border-t border-border/50 py-6 text-[13px] leading-[1.7] text-muted-foreground",
          CELL,
        )}
      >
        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Refunds go back to the card that paid, and can take three to five
        working days to show on a statement.
      </p>
    </div>
  );
}

/**
 * One figure of the strip. The rules are drawn per cell rather than with
 * `divide-x`, which would also draw one down the left of every second row.
 */
function SummaryCell({
  label,
  value,
  icon,
  accent,
  ruled,
  ruledFrom,
  className,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  /** Draws the rule at every width. */
  ruled?: boolean;
  /** Draws it only from that breakpoint up. */
  ruledFrom?: "lg";
  className?: string;
}) {
  return (
    <li
      className={cn(
        "py-5",
        ruled && "border-l border-border/50 pl-5",
        ruledFrom === "lg" && "lg:border-l lg:border-border/50 lg:pl-5",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
        <span aria-hidden className="text-primary">
          {icon}
        </span>
        {label}
      </p>

      <p
        className={cn(
          "mt-2 font-mono text-[20px] tracking-[-0.02em] tabular-nums sm:text-[24px]",
          accent && "text-primary",
        )}
      >
        {value}
      </p>
    </li>
  );
}

/** Money out is plain; money back takes the brand colour and a sign. */
function Amount({ entry }: { entry: Transaction }) {
  const incoming = entry.amount < 0;

  return (
    <span
      className={cn(
        "font-mono text-[15px] tabular-nums",
        incoming
          ? "text-primary"
          : entry.status === "failed"
            ? "text-muted-foreground line-through"
            : "text-foreground",
      )}
    >
      {incoming ? "+" : "−"}
      {formatMoney(Math.abs(entry.amount))}
    </span>
  );
}

function KindMark({ kind }: { kind: TransactionKind }) {
  const meta = kindMeta[kind];
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full",
        meta.className,
      )}
    >
      <meta.icon className="size-4" />
    </span>
  );
}

function StatusPill({ entry }: { entry: Transaction }) {
  const meta = transactionStatusMeta[entry.status];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

function TransactionRow({ entry }: { entry: Transaction }) {
  return (
    <tr className="transition-colors duration-200 hover:bg-card/40">
      <td className="py-4 pr-5 pl-5 sm:pl-8">
        <div className="flex items-center gap-3">
          <KindMark kind={entry.kind} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium tracking-[-0.01em]">
              {entry.description}
            </p>
            <p className="mt-1 truncate font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
              {entry.orderId ? `${entry.id} · ${entry.orderId}` : entry.id}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 pr-5 text-[13px] whitespace-nowrap text-muted-foreground">
        {formatDateTime(entry.date)}
      </td>
      <td className="py-4 pr-5 text-[13px] whitespace-nowrap text-muted-foreground">
        {entry.method}
      </td>
      <td className="py-4 pr-5">
        <StatusPill entry={entry} />
      </td>
      <td className="py-4 pr-5 text-right whitespace-nowrap sm:pr-8">
        <Amount entry={entry} />
      </td>
    </tr>
  );
}

function TransactionCard({ entry }: { entry: Transaction }) {
  return (
    <li className={cn("flex items-start gap-3 py-5", CELL)}>
      <KindMark kind={entry.kind} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[14px] font-medium tracking-[-0.01em]">
            {entry.description}
          </p>
          <Amount entry={entry} />
        </div>

        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          {formatDateTime(entry.date)} · {entry.method}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="truncate font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            {entry.orderId ?? entry.id}
          </span>
          <StatusPill entry={entry} />
        </div>
      </div>
    </li>
  );
}
