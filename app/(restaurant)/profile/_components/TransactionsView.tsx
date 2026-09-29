"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CreditCard,
  Info,
  Loader2,
  Receipt,
  TrendingUp,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/price";
import {
  EMPTY_SUMMARY,
  type Transaction,
  type TransactionKind,
  type TransactionStatus,
  type TransactionsSummary,
} from "@/lib/transactions/types";
import { formatDateTime } from "../_data";

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";
const PAGE_SIZE = 20;

const filters: { id: string; label: string; kind: TransactionKind | null }[] = [
  { id: "all", label: "All", kind: null },
  { id: "payment", label: "Payments", kind: "payment" },
  { id: "refund", label: "Refunds", kind: "refund" },
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
};

const statusMeta: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary ring-primary/25",
  },
  pending: {
    label: "Processing",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
  },
  failed: {
    label: "Failed",
    className: "bg-danger/10 text-danger ring-danger/25",
  },
};

interface TransactionsAnswer {
  summary: TransactionsSummary;
  transactions: Transaction[];
  meta: { page: number; totalPage: number; total: number } | null;
}

async function fetchTransactions(params: {
  kind: TransactionKind | null;
  page: number;
  limit: number;
}): Promise<
  { ok: true; data: TransactionsAnswer } | { ok: false; message: string }
> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.kind) query.set("type", params.kind);

  try {
    const response = await fetch(`/api/transactions?${query}`, {
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as
      (TransactionsAnswer & { message?: string }) | null;

    if (!response.ok || !payload) {
      return {
        ok: false,
        message: payload?.message ?? "Your payments could not be read.",
      };
    }
    return { ok: true, data: payload };
  } catch {
    return {
      ok: false,
      message: "Could not reach the kitchen. Check your connection.",
    };
  }
}

/**
 * Every payment and refund on the account, read from the kitchen's own
 * ledger — what moved, when, on which card, against which order.
 *
 * The four figures cover the whole account; the filter only narrows the list
 * under them. The movements are a table once there is width for one, and the
 * same rows stacked when there is not.
 */
export function TransactionsView() {
  const [filter, setFilter] = useState("all");
  const [summary, setSummary] = useState<TransactionsSummary>(EMPTY_SUMMARY);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const kind = filters.find((entry) => entry.id === filter)?.kind ?? null;

  // A new filter starts the list again from the first page.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const answer = await fetchTransactions({
        kind,
        page: 1,
        limit: PAGE_SIZE,
      });
      if (cancelled) return;

      setLoading(false);

      if (!answer.ok) {
        setError(answer.message);
        setRows([]);
        return;
      }

      setError(null);
      setSummary(answer.data.summary);
      setRows(answer.data.transactions);
      setPage(1);
      setTotalPage(answer.data.meta?.totalPage ?? 1);
    })();

    return () => {
      cancelled = true;
    };
  }, [kind]);

  const chooseFilter = (id: string) => {
    if (id === filter) return;
    setLoading(true);
    setFilter(id);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    const answer = await fetchTransactions({
      kind,
      page: page + 1,
      limit: PAGE_SIZE,
    });
    setLoadingMore(false);

    if (!answer.ok) {
      toast.error(answer.message);
      return;
    }

    setRows((current) => [...current, ...answer.data.transactions]);
    setPage((current) => current + 1);
    setTotalPage(answer.data.meta?.totalPage ?? totalPage);
  };

  /** The statement as a CSV — every row under the current filter. */
  const downloadStatement = async () => {
    setExporting(true);
    const answer = await fetchTransactions({ kind, page: 1, limit: 500 });
    setExporting(false);

    if (!answer.ok) {
      toast.error(answer.message);
      return;
    }

    const lines = [
      ["Date", "Description", "Order", "Method", "Status", "Amount"],
      ...answer.data.transactions.map((entry) => [
        new Date(entry.date).toISOString(),
        entry.description,
        entry.orderNumber ?? "",
        entry.method,
        statusMeta[entry.status].label,
        entry.amount.toFixed(2),
      ]),
    ];

    const csv = lines
      .map((cells) =>
        cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `barkeepers-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
          value={formatMoney(summary.totalPaid)}
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
          label="Paid orders"
          value={summary.paidOrders.toLocaleString("en-US")}
          icon={<Receipt className="size-3.5" />}
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
          className="noBar flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
        >
          {filters.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={filter === entry.id}
              onClick={() => chooseFilter(entry.id)}
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
          onClick={downloadStatement}
          disabled={exporting || rows.length === 0}
          className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[13.5px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          Download statement
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 px-5 py-20 text-[13.5px] text-muted-foreground">
          <Loader2 aria-hidden className="size-4 animate-spin" />
          Reading your payments…
        </div>
      ) : error ? (
        <EmptyState title="We could not read your payments" body={error} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={
            filter === "all" ? "No payments yet" : "Nothing of that kind yet"
          }
          body={
            filter === "all"
              ? "Once you pay for an order it shows up here, with the card it was charged to."
              : "Clear the filter to see every movement on the account."
          }
        />
      ) : (
        <>
          {/* A table is the right shape for this, but only once there's width
              for it. Below `lg` the same rows are read as stacked cards. */}
          <table className="hidden w-full lg:table">
            <caption className="sr-only">
              Payments and refunds on your account
            </caption>
            <thead>
              <tr className="border-b border-border/50 bg-card/20">
                {["Transaction", "Date", "Method", "Status", "Amount"].map(
                  (heading, index) => (
                    <th
                      key={heading}
                      scope="col"
                      className={cn(
                        "border-border/50 py-3.5 font-mono text-[10.5px] font-normal tracking-[0.16em] text-muted-foreground uppercase",
                        index < 4 && "border-r",
                        index === 0 ? "px-5 sm:px-8" : "px-5",
                        index === 4 ? "text-right sm:pr-8" : "text-left",
                      )}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.map((entry) => (
                <TransactionRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>

          <ul role="list" className="divide-y divide-border/50 lg:hidden">
            {rows.map((entry) => (
              <TransactionCard key={entry.id} entry={entry} />
            ))}
          </ul>

          {page < totalPage && (
            <div
              className={cn("border-t border-border/50 py-5 text-center", CELL)}
            >
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-[13px] font-medium transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore && (
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                )}
                Show more
              </button>
            </div>
          )}
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

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-5 py-20 text-center sm:px-8 sm:py-24">
      <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground">
        <CreditCard className="size-4.5" />
      </span>

      <h3 className="mx-auto mt-7 max-w-[20ch] bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-[26px] leading-[1.05] font-medium tracking-[-0.04em] text-transparent sm:text-[32px]">
        {title}
      </h3>

      <p className="mx-auto mt-4 max-w-[46ch] text-[13.5px] leading-[1.7] text-muted-foreground">
        {body}
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
  const meta = statusMeta[entry.status];
  return (
    <span
      title={entry.failureMessage ?? undefined}
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

/** The description, linked through to the order when there is one. */
function Description({ entry }: { entry: Transaction }) {
  const text = (
    <span className="truncate text-[14px] font-medium tracking-[-0.01em]">
      {entry.description}
    </span>
  );

  return entry.orderId ? (
    <Link
      href={`/profile/orders/${entry.orderId}`}
      className="block truncate underline-offset-4 hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {text}
    </Link>
  ) : (
    <p className="truncate">{text}</p>
  );
}

function TransactionRow({ entry }: { entry: Transaction }) {
  return (
    <tr className="transition-colors duration-200 hover:bg-card/40">
      <td className="border-r border-border/50 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <KindMark kind={entry.kind} />
          <div className="min-w-0">
            <Description entry={entry} />
            {entry.status === "failed" && entry.failureMessage && (
              <p className="mt-1 truncate text-[11.5px] text-danger">
                {entry.failureMessage}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="border-r border-border/50 px-5 py-4 text-[13px] whitespace-nowrap text-muted-foreground">
        {formatDateTime(entry.date)}
      </td>
      <td className="border-r border-border/50 px-5 py-4 text-[13px] whitespace-nowrap text-muted-foreground">
        {entry.method}
      </td>
      <td className="border-r border-border/50 px-5 py-4">
        <StatusPill entry={entry} />
      </td>
      <td className="px-5 py-4 text-right whitespace-nowrap sm:pr-8">
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
          <Description entry={entry} />
          <Amount entry={entry} />
        </div>

        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          {formatDateTime(entry.date)} · {entry.method}
        </p>

        {entry.status === "failed" && entry.failureMessage && (
          <p className="mt-1 text-[12px] text-danger">{entry.failureMessage}</p>
        )}

        <div className="mt-3 flex items-center justify-end gap-3">
          <StatusPill entry={entry} />
        </div>
      </div>
    </li>
  );
}
