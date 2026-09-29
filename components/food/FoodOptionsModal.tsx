"use client";

import { useMemo, useRef, useState } from "react";

import {
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@/components/icons/Icons";
import SafeImage from "@/components/ui/SafeImage";
import { Modal } from "@/components/ui/modal/Modal";
import type { FoodItem, FoodOption } from "@/app/(restaurant)/menu/_type";
import type { AddItemInput } from "@/lib/cart/types";
import {
  defaultSelections,
  describeRules,
  groupProblem,
  isSelectable,
  optionCeiling,
  prepareGroups,
  priceGroup,
  pricedVariants,
  unitsIn,
  type PreparedGroup,
  type Selections,
} from "@/lib/cart/rules";
import { formatMoney, payableOf } from "@/lib/price";
import { cn } from "@/lib/utils";

/** The kitchen's own ceiling on a single line. */
const MAX_LINE_QUANTITY = 99;

interface FoodOptionsModalProps {
  item: FoodItem;
  open: boolean;
  onClose: () => void;
  /** Size to open on — set when the card's own size pad was tapped. */
  initialVariant?: string | null;
  /** Put the built dish on the docket. Resolves true when it went on. */
  onSubmit: (input: AddItemInput) => Promise<boolean>;
}

/**
 * The dish builder — the sheet a delivery app slides up when a dish has
 * choices to make: size, the option groups the kitchen attached, and how
 * many.
 *
 * Every rule the kitchen enforces is shown before it bites: which groups are
 * required, how many picks each takes, what comes included, what is sold out.
 * The running price is the one the kitchen will charge — see `lib/cart/rules`.
 */
export function FoodOptionsModal({
  item,
  open,
  onClose,
  initialVariant,
  onSubmit,
}: FoodOptionsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xxlarge"
      bodyClassName="p-0"
      className="max-w-xl"
    >
      {/* Remounted on every open, so each visit starts from the defaults. */}
      {open && (
        <Builder
          item={item}
          initialVariant={initialVariant}
          onSubmit={onSubmit}
          onDone={onClose}
        />
      )}
    </Modal>
  );
}

function Builder({
  item,
  initialVariant,
  onSubmit,
  onDone,
}: {
  item: FoodItem;
  initialVariant?: string | null;
  onSubmit: (input: AddItemInput) => Promise<boolean>;
  onDone: () => void;
}) {
  const groups = useMemo(() => prepareGroups(item), [item]);
  const variants = useMemo(() => pricedVariants(item), [item]);
  const choosesSize = variants.length > 1;

  const [variantLabel, setVariantLabel] = useState<string | null>(() => {
    if (variants.length === 1) return variants[0].label;
    return variants.some((variant) => variant.label === initialVariant)
      ? (initialVariant ?? null)
      : null;
  });
  const [selections, setSelections] = useState<Selections>(() =>
    defaultSelections(groups),
  );
  const [quantity, setQuantity] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Only read in the submit handler, to scroll to the first unfinished group.
  const scrollArea = useRef<HTMLDivElement | null>(null);

  /* ─── price ─── */

  const variant = variants.find((entry) => entry.label === variantLabel);
  const base = variant
    ? payableOf(variant.price, variant.offerPrice).payable
    : variants.length === 0
      ? payableOf(item.price, item.offerPrice).payable
      : null;

  const groupPricing = groups.map((group) =>
    priceGroup(group, selections[group.groupId]),
  );
  const optionsTotal = groupPricing.reduce((sum, row) => sum + row.total, 0);
  const unitPrice = (base ?? 0) + optionsTotal;
  const total = unitPrice * quantity;

  /* ─── validation ─── */

  const sizeProblem = choosesSize && !variantLabel ? "Choose a size." : null;
  const problems = groups.map((group) =>
    groupProblem(group, selections[group.groupId]),
  );
  const firstProblem = sizeProblem
    ? "size"
    : groups[problems.findIndex(Boolean)]?.groupId;

  /* ─── picking ─── */

  const setUnits = (group: PreparedGroup, option: FoodOption, units: number) =>
    setSelections((current) => {
      const picked = { ...(current[group.groupId] ?? {}) };

      if (group.single) {
        // A radio: the new pick replaces the old one.
        return {
          ...current,
          [group.groupId]: units > 0 ? { [option.name]: 1 } : {},
        };
      }

      if (units > 0) picked[option.name] = units;
      else delete picked[option.name];

      return { ...current, [group.groupId]: picked };
    });

  /* ─── submit ─── */

  const submit = async () => {
    if (firstProblem) {
      setShowErrors(true);

      // Scroll only the list of choices. scrollIntoView() would also scroll
      // the Modal's own frame and leave the sheet hanging half empty.
      const area = scrollArea.current;
      const section = area?.querySelector<HTMLElement>(
        `[data-builder-section="${firstProblem}"]`,
      );
      if (area && section) {
        area.scrollTo({
          top: Math.max(section.offsetTop - 12, 0),
          behavior: "smooth",
        });
      }
      return;
    }

    setSubmitting(true);

    const options = groups.flatMap((group) =>
      Object.entries(selections[group.groupId] ?? {})
        .filter(([, units]) => units > 0)
        .map(([optionName, units]) => ({
          groupId: group.groupId,
          optionName,
          quantity: units,
        })),
    );

    const added = await onSubmit({
      foodId: item._id,
      variantLabel: variantLabel ?? null,
      options,
      quantity,
    });

    setSubmitting(false);
    if (added) onDone();
  };

  return (
    // Sized to fit inside the Modal's own scroll area (65vh / 70vh), so only the
    // choices scroll and the button stays pinned under them.
    <div className="flex max-h-[calc(65vh-0.5rem)] flex-col sm:max-h-[calc(70vh-0.5rem)]">
      {/* `relative` makes it the offset parent the scroll above measures from. */}
      <div
        ref={scrollArea}
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {/* ── The dish ── */}
        {item.image?.url && (
          // Kept short: the sheet is for choosing, and every pixel of photo
          // pushes the first choice further down.
          <div className="relative h-40 w-full bg-muted sm:h-48">
            <SafeImage
              src={item.image.url}
              alt={item.image.alt || item.name}
              fill
              sizes="(max-width: 640px) 100vw, 576px"
              className="object-cover"
              fallbackClassName="h-full w-full bg-muted"
            />
          </div>
        )}

        <div className="px-5 pt-5 pb-2 sm:px-6">
          <h2 className="pr-10 text-[22px] leading-tight font-semibold tracking-[-0.02em]">
            {item.name}
          </h2>
          {item.description && (
            <p className="mt-2 text-[13.5px] leading-[1.7] text-muted-foreground">
              {item.description}
            </p>
          )}
          {base !== null ? (
            <p className="mt-3 text-[15px] font-semibold tabular-nums">
              {formatMoney(base)}
            </p>
          ) : (
            choosesSize && (
              <p className="mt-3 text-[13px] text-muted-foreground">
                Pick a size to see the price.
              </p>
            )
          )}
        </div>

        {/* ── Size ── */}
        {choosesSize && (
          <Section
            sectionKey="size"
            title="Size"
            rule="Choose 1"
            required
            satisfied={Boolean(variantLabel)}
            error={showErrors ? sizeProblem : null}
          >
            {variants.map((entry) => {
              const price = payableOf(entry.price, entry.offerPrice);
              return (
                <OptionRow
                  key={entry.label}
                  kind="radio"
                  name={`${item._id}-size`}
                  label={entry.label}
                  calories={entry.calories}
                  priceText={
                    price.payable !== null ? formatMoney(price.payable) : ""
                  }
                  struck={price.struck}
                  checked={variantLabel === entry.label}
                  onToggle={() => setVariantLabel(entry.label)}
                />
              );
            })}
          </Section>
        )}

        {/* ── The kitchen's option groups ── */}
        {groups.map((group, index) => {
          const picked = selections[group.groupId];
          const units = unitsIn(picked);
          const atMax =
            group.rules.maxSelect > 0 && units >= group.rules.maxSelect;
          const pricing = groupPricing[index];
          const freeByOption = new Map(
            pricing.picks.map((pick) => [pick.optionName, pick.freeQuantity]),
          );

          let lastSection: string | null = null;

          return (
            <Section
              key={group.groupId}
              sectionKey={group.groupId}
              title={group.name}
              rule={group.description || describeRules(group.rules)}
              required={group.rules.isRequired}
              satisfied={!problems[index] && units > 0}
              error={showErrors ? problems[index] : null}
            >
              {group.options.map((option) => {
                const heading =
                  option.section && option.section !== lastSection
                    ? option.section
                    : null;
                lastSection = option.section ?? lastSection;

                const current = picked?.[option.name] ?? 0;
                const available = isSelectable(option);
                const ceiling = optionCeiling(group, option);
                const blockedByMax = !group.single && atMax && current === 0;
                const free = freeByOption.get(option.name) ?? 0;
                const price = option.price ?? 0;

                const priceText =
                  price <= 0
                    ? ""
                    : current > 0 && free >= current
                      ? "Included"
                      : `+${formatMoney(price)}`;

                return (
                  <div key={option.name}>
                    {heading && (
                      <p className="px-5 pt-4 pb-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:px-6">
                        {heading}
                      </p>
                    )}
                    <OptionRow
                      kind={group.single ? "radio" : "checkbox"}
                      name={`${item._id}-${group.groupId}`}
                      label={option.name}
                      calories={option.calories}
                      priceText={priceText}
                      checked={current > 0}
                      disabled={!available || blockedByMax}
                      soldOut={!available}
                      onToggle={() =>
                        setUnits(
                          group,
                          option,
                          current > 0 && !group.single ? 0 : 1,
                        )
                      }
                      // An optional single-choice group can be emptied again
                      // by tapping the ticked option.
                      onClear={
                        group.single && !group.rules.isRequired
                          ? () => setUnits(group, option, 0)
                          : undefined
                      }
                      stepper={
                        group.rules.allowQuantityPerOption && current > 0
                          ? {
                              value: current,
                              canIncrease: current < ceiling && !atMax,
                              onChange: (next) => setUnits(group, option, next),
                            }
                          : undefined
                      }
                    />
                  </div>
                );
              })}
            </Section>
          );
        })}
      </div>

      {/* ── Quantity and the button ── */}
      <div className="flex items-center gap-3 border-t border-border bg-background px-5 py-4 sm:px-6">
        <Stepper
          value={quantity}
          min={1}
          max={MAX_LINE_QUANTITY}
          onChange={setQuantity}
          label="Quantity"
          size="lg"
        />

        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className={cn(
            "flex h-11 flex-1 cursor-pointer items-center justify-between gap-3 rounded-full px-5 text-[14px] font-medium transition-opacity duration-200",
            "bg-primary text-background hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            firstProblem && "opacity-80",
          )}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <ShoppingBagIcon aria-hidden className="hidden size-4 sm:inline" />
            {submitting ? "Adding…" : "Add to cart"}
          </span>
          <span className="whitespace-nowrap tabular-nums">
            {base === null ? "—" : formatMoney(total)}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ─── Pieces ─── */

interface SectionProps {
  title: string;
  rule: string;
  required: boolean;
  satisfied: boolean;
  error: string | null;
  children: React.ReactNode;
  /** What the submit handler looks the section up by. */
  sectionKey: string;
}

function Section({
  title,
  rule,
  required,
  satisfied,
  error,
  children,
  sectionKey,
}: SectionProps) {
  return (
    <section
      data-builder-section={sectionKey}
      className="border-t border-border/60 pb-2"
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3 px-5 pt-5 pb-2 sm:px-6",
          error && "bg-danger/5",
        )}
      >
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">
            {title}
          </h3>
          <p
            className={cn(
              "mt-0.5 text-[12.5px]",
              error ? "text-danger" : "text-muted-foreground",
            )}
          >
            {error ?? rule}
          </p>
        </div>

        {satisfied ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            <CheckIcon aria-hidden className="size-3" />
            Done
          </span>
        ) : (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
              required
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground",
            )}
          >
            {required ? "Required" : "Optional"}
          </span>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
}

interface OptionRowProps {
  kind: "radio" | "checkbox";
  name: string;
  label: string;
  calories?: number | null;
  priceText: string;
  struck?: number | null;
  checked: boolean;
  disabled?: boolean;
  soldOut?: boolean;
  onToggle: () => void;
  /** Radios only: tapping the ticked one clears it. */
  onClear?: () => void;
  stepper?: {
    value: number;
    canIncrease: boolean;
    onChange: (next: number) => void;
  };
}

function OptionRow({
  kind,
  name,
  label,
  calories,
  priceText,
  struck,
  checked,
  disabled,
  soldOut,
  onToggle,
  onClear,
  stepper,
}: OptionRowProps) {
  return (
    <label
      className={cn(
        "flex min-h-12 items-center gap-3 px-5 py-2.5 transition-colors sm:px-6",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-muted/60",
      )}
    >
      <input
        type={kind}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        // A ticked radio fires no change when tapped again, so clearing an
        // optional one is handled on the click itself.
        onClick={() => {
          if (kind === "radio" && checked && onClear) onClear();
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40",
          kind === "radio" ? "rounded-full" : "rounded-md",
          checked
            ? "border-primary bg-primary text-background"
            : "border-border bg-card",
        )}
      >
        {checked &&
          (kind === "radio" ? (
            <span className="size-2 rounded-full bg-background" />
          ) : (
            <CheckIcon className="size-3.5" />
          ))}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px]">{label}</span>
        {((typeof calories === "number" && calories > 0) || soldOut) && (
          <span className="block text-[11.5px] text-muted-foreground">
            {soldOut ? "Sold out" : `${calories} cal`}
          </span>
        )}
      </span>

      {stepper ? (
        <span
          onClick={(event) => event.preventDefault()}
          className="flex items-center gap-3"
        >
          <span className="text-[13px] text-muted-foreground tabular-nums">
            {priceText}
          </span>
          <Stepper
            value={stepper.value}
            min={0}
            max={stepper.canIncrease ? stepper.value + 1 : stepper.value}
            onChange={stepper.onChange}
            label={label}
          />
        </span>
      ) : (
        <span className="shrink-0 text-right text-[13px] tabular-nums">
          {struck !== null && struck !== undefined && (
            <s className="mr-1.5 text-muted-foreground">
              {formatMoney(struck)}
            </s>
          )}
          <span className={cn(priceText === "Included" && "text-primary")}>
            {priceText}
          </span>
        </span>
      )}
    </label>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  size = "sm",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  size?: "sm" | "lg";
}) {
  const button = cn(
    "grid shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40",
    size === "lg" ? "size-9" : "size-7",
  );

  return (
    <span
      className="inline-flex items-center gap-2"
      role="group"
      aria-label={`${label} quantity`}
    >
      <button
        type="button"
        className={button}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={`Fewer ${label}`}
      >
        <MinusIcon className={size === "lg" ? "size-4" : "size-3.5"} />
      </button>
      <span
        className={cn(
          "min-w-5 text-center font-semibold tabular-nums",
          size === "lg" ? "text-[15px]" : "text-[13px]",
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={button}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`More ${label}`}
      >
        <PlusIcon className={size === "lg" ? "size-4" : "size-3.5"} />
      </button>
    </span>
  );
}
