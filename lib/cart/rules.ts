/**
 * The option-group rules, as the kitchen enforces them — mirrored here so the
 * dish builder can guide the customer before they press "Add".
 *
 * This is a copy of the backend's `resolveGroupRules` / `priceGroup`
 * (`barkeepers-server/src/app/modules/Cart/cart.utils.ts`). The backend stays
 * the authority — it re-checks and re-prices every line — but a builder that
 * disagreed with it would let a customer build a dish only to be refused at
 * the last tap, so the two are kept identical. Change one, change both.
 */

import type {
  FoodItem,
  FoodOption,
  FoodOptionGroup,
  OptionGroupBody,
  OptionGroupOverrides,
} from "@/app/(restaurant)/menu/_type";

const ACTIVE = "active";

/** What a group's limits actually are once the food's overrides are applied. */
export interface EffectiveRules {
  isRequired: boolean;
  minSelect: number;
  /** 0 = no ceiling. */
  maxSelect: number;
  freeSelectionCount: number;
  allowQuantityPerOption: boolean;
  maxQuantityPerOption: number;
}

/**
 * Merge a group's own rules with the food's overrides. A food may only ever
 * tighten: a value that would loosen the group is ignored. A ceiling of 0
 * means "no ceiling", so it loses every comparison against a real number.
 */
export function resolveGroupRules(
  group: OptionGroupBody,
  attached?: OptionGroupOverrides | null,
): EffectiveRules {
  const tightenCeiling = (base: number, override?: number | null): number => {
    if (override === undefined || override === null) return base;
    if (base === 0) return override;
    if (override === 0) return base;
    return Math.min(base, override);
  };

  const maxSelect = tightenCeiling(group.maxSelect ?? 0, attached?.maxSelect);

  let minSelect = Math.max(
    group.minSelect ?? 0,
    attached?.minSelect ?? group.minSelect ?? 0,
  );

  // A tightened ceiling can end up under an inherited floor; the ceiling wins.
  if (maxSelect > 0 && minSelect > maxSelect) minSelect = maxSelect;

  const freeSelectionCount = Math.min(
    group.freeSelectionCount ?? 0,
    attached?.freeSelectionCount ?? group.freeSelectionCount ?? 0,
  );

  return {
    isRequired: Boolean(group.isRequired) || attached?.isRequired === true,
    minSelect,
    maxSelect,
    freeSelectionCount,
    allowQuantityPerOption: Boolean(group.allowQuantityPerOption),
    maxQuantityPerOption: Math.max(group.maxQuantityPerOption ?? 1, 1),
  };
}

/** One group, ready for the builder: rules resolved, options in print order. */
export interface PreparedGroup {
  groupId: string;
  name: string;
  description: string | null;
  rules: EffectiveRules;
  /** Every active option, in display order — sold-out ones included. */
  options: FoodOption[];
  /** One pick at most: rendered as radios rather than checkboxes. */
  single: boolean;
}

const isActiveOption = (option: FoodOption) =>
  (option.status ?? ACTIVE) === ACTIVE;

const bySortOrder = (
  a: { sortOrder?: number | null },
  b: { sortOrder?: number | null },
) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

/**
 * The groups a dish actually offers, in the order the food lists them.
 *
 * An inactive group, or one with no active options left, is dropped — the
 * backend skips an inactive group when it prices the line, so asking the
 * customer about it would only be noise.
 */
export function prepareGroups(item: FoodItem): PreparedGroup[] {
  return [...(item.optionGroups ?? [])]
    .filter(
      (entry): entry is FoodOptionGroup =>
        Boolean(entry?.group) && (entry.group.status ?? ACTIVE) === ACTIVE,
    )
    .sort(bySortOrder)
    .map((entry) => {
      const rules = resolveGroupRules(entry.group, entry);
      const options = [...(entry.group.options ?? [])]
        .filter(isActiveOption)
        .sort(bySortOrder);

      return {
        groupId: entry.group._id ?? entry.groupId,
        name: entry.group.name,
        description: entry.group.description?.trim() || null,
        rules,
        options,
        single: rules.maxSelect === 1,
      };
    })
    .filter((group) => group.options.length > 0);
}

/** The sizes a dish can actually be ordered in, in print order. */
export function pricedVariants(item: FoodItem) {
  return (item.variants ?? [])
    .filter((variant) => typeof variant.price === "number")
    .sort(bySortOrder);
}

/**
 * Does ordering this dish need the builder, or can it go straight on?
 *
 * A dish with option groups, or with more than one size, cannot be ordered
 * blind. Everything else adds in one tap, as it always has.
 */
export function needsBuilder(item: FoodItem): boolean {
  return prepareGroups(item).length > 0 || pricedVariants(item).length > 1;
}

/* ─── Selections ─── */

/** groupId → optionName → units picked. */
export type Selections = Record<string, Record<string, number>>;

export const isSelectable = (option: FoodOption) =>
  option.isAvailable !== false && isActiveOption(option);

/** How many units of one option a group allows. */
export const optionCeiling = (group: PreparedGroup, option: FoodOption) =>
  group.rules.allowQuantityPerOption
    ? Math.max(option.maxQuantity ?? group.rules.maxQuantityPerOption, 1)
    : 1;

export const unitsIn = (picked: Record<string, number> | undefined) =>
  Object.values(picked ?? {}).reduce((sum, units) => sum + units, 0);

/**
 * What the dish opens with: the kitchen's defaults, as long as they can
 * actually be ordered and fit the group's ceiling.
 */
export function defaultSelections(groups: PreparedGroup[]): Selections {
  const selections: Selections = {};

  for (const group of groups) {
    const picked: Record<string, number> = {};
    let units = 0;

    for (const option of group.options) {
      if (!option.isDefault || !isSelectable(option)) continue;
      if (group.rules.maxSelect > 0 && units >= group.rules.maxSelect) break;
      picked[option.name] = 1;
      units += 1;
    }

    selections[group.groupId] = picked;
  }

  return selections;
}

/** One priced line inside a group, the way the kitchen will charge it. */
export interface PricedPick {
  optionName: string;
  quantity: number;
  freeQuantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface GroupPricing {
  units: number;
  total: number;
  picks: PricedPick[];
}

const round2 = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Price one group's picks. The free allowance is spent in the group's display
 * order — "first two toppings included" means the first two as listed — and
 * counted by unit, so cheese taken twice spends two of it.
 */
export function priceGroup(
  group: PreparedGroup,
  picked: Record<string, number> | undefined,
): GroupPricing {
  let freeLeft = group.rules.freeSelectionCount;
  let units = 0;
  const picks: PricedPick[] = [];

  for (const option of group.options) {
    const quantity = picked?.[option.name] ?? 0;
    if (quantity <= 0) continue;

    const freeQuantity = Math.min(freeLeft, quantity);
    freeLeft -= freeQuantity;
    units += quantity;

    const unitPrice = round2(option.price ?? 0);
    picks.push({
      optionName: option.name,
      quantity,
      freeQuantity,
      unitPrice,
      lineTotal: round2(unitPrice * (quantity - freeQuantity)),
    });
  }

  return {
    units,
    total: round2(picks.reduce((sum, pick) => sum + pick.lineTotal, 0)),
    picks,
  };
}

/**
 * What still stops this group from being sent, in the kitchen's own terms —
 * or null when it is fine.
 */
export function groupProblem(
  group: PreparedGroup,
  picked: Record<string, number> | undefined,
): string | null {
  const units = unitsIn(picked);
  const { isRequired, minSelect, maxSelect } = group.rules;

  if (maxSelect > 0 && units > maxSelect) {
    return `Choose at most ${maxSelect}.`;
  }

  if (isRequired && units === 0) {
    return minSelect > 1 ? `Choose at least ${minSelect}.` : "Make a choice.";
  }

  // A floor only bites once the group is engaged, unless it is also required.
  if (minSelect > 0 && units > 0 && units < minSelect) {
    return `Choose at least ${minSelect}.`;
  }

  return null;
}

/** The line under a group's name — the rule, in plain words. */
export function describeRules(rules: EffectiveRules): string {
  const { minSelect, maxSelect, freeSelectionCount } = rules;
  const floor = Math.max(minSelect, rules.isRequired ? 1 : 0);

  let text: string;
  if (maxSelect === 1) text = "Choose 1";
  else if (floor > 0 && maxSelect > 0 && floor === maxSelect)
    text = `Choose ${maxSelect}`;
  else if (floor > 0 && maxSelect > 0) text = `Choose ${floor}–${maxSelect}`;
  else if (floor > 0) text = `Choose at least ${floor}`;
  else if (maxSelect > 0) text = `Choose up to ${maxSelect}`;
  else text = "Choose any";

  if (freeSelectionCount > 0) {
    text += ` · first ${freeSelectionCount} included`;
  }

  return text;
}
