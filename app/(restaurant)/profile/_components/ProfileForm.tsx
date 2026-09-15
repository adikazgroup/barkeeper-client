"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  MailIcon,
  UserIcon,
} from "@/components/icons/Icons";
import { Leaf, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoUser, dietaryOptions } from "../_data";
import { SectionCard } from "./SectionCard";

/** Everything the form can change, kept in one shape for one `useState`. */
interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addressLabel: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  dietary: string[];
  orderUpdates: boolean;
  offers: boolean;
  newsletter: boolean;
}

const initialState: FormState = {
  firstName: demoUser.firstName,
  lastName: demoUser.lastName,
  email: demoUser.email,
  phone: demoUser.phone,
  dateOfBirth: demoUser.dateOfBirth,
  addressLabel: demoUser.address.label,
  line1: demoUser.address.line1,
  line2: demoUser.address.line2,
  city: demoUser.address.city,
  postcode: demoUser.address.postcode,
  dietary: demoUser.preferences.dietary,
  orderUpdates: demoUser.preferences.orderUpdates,
  offers: demoUser.preferences.offers,
  newsletter: demoUser.preferences.newsletter,
};

/** What `GET /users/me` knows about the customer, flattened for this form. */
export interface Account {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

/**
 * The name, email and phone come from the account; the address and preferences
 * are still demo data, because the backend has no endpoint for them yet.
 * Keeping them apart is what lets "Discard changes" stay honest — it returns to
 * what the account says, not to a stranger's details.
 *
 * The backend stores one `name`, so the first word is taken as the first name
 * and whatever follows as the last.
 */
function accountState(account: Account): FormState {
  const [firstName, ...rest] = account.name.trim().split(/\s+/);

  return {
    ...initialState,
    firstName: firstName || initialState.firstName,
    lastName: rest.join(" "),
    email: account.email || initialState.email,
    // An empty string, not the demo number: a customer who has not given one
    // should see an empty field asking for it, not someone else's.
    phone: account.phone,
  };
}

export function ProfileForm({ account }: { account: Account }) {
  // Resolved on the server and passed in, so the fields are right in the first
  // paint rather than filling in a beat later.
  const accountDefaults = useMemo(() => accountState(account), [account]);

  const [form, setForm] = useState<FormState>(accountDefaults);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleDietary = (option: string) =>
    setForm((current) => ({
      ...current,
      dietary: current.dietary.includes(option)
        ? current.dietary.filter((entry) => entry !== option)
        : [...current.dietary, option],
    }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    // Nothing to save to yet. The pause is only so the button reads as a
    // button; swap this for the real call when accounts land.
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Your details are up to date.", { icon: "🍀" });
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ─── Who you are ─── */}
      <SectionCard
        title="Your details"
        description="The name we put on the docket and the ways we reach you about it."
        icon={<UserIcon className="size-4" />}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Framed the way the board frames a plate, so a face and a dish are
              presented alike. No photograph on the account and none shipped
              with the app, so the initial stands in rather than a stock face. */}
          <div className="size-20 shrink-0 rounded-2xl border border-border/60 bg-card p-1.5">
            <div className="relative grid size-full place-items-center overflow-hidden rounded-xl bg-muted text-[20px] font-medium">
              {account.avatarUrl || demoUser.avatar ? (
                <Image
                  src={account.avatarUrl || demoUser.avatar!}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized={Boolean(account.avatarUrl)}
                  className="object-cover"
                />
              ) : (
                account.name.trim().charAt(0).toUpperCase()
              )}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                toast("Photo uploads land with accounts.", { icon: "📷" })
              }
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-[13px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CameraIcon className="size-4" />
              Change photo
            </button>
            <p className="mt-2.5 text-[12px] text-muted-foreground">
              JPG or PNG, up to 2 MB.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field
            label="First name"
            value={form.firstName}
            onChange={(value) => set("firstName", value)}
            icon={<UserIcon className="size-4.5" />}
            autoComplete="given-name"
            required
          />
          <Field
            label="Last name"
            value={form.lastName}
            onChange={(value) => set("lastName", value)}
            autoComplete="family-name"
            required
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => set("email", value)}
            icon={<MailIcon className="size-4.5" />}
            autoComplete="email"
            required
            badge={<VerifiedBadge verified={account.isEmailVerified} />}
          />
          <Field
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(value) => set("phone", value)}
            icon={<Phone className="size-4.5" />}
            autoComplete="tel"
            placeholder="+353 …"
            hint="Needed at checkout, so the driver can reach you."
            badge={
              form.phone ? (
                <VerifiedBadge verified={account.isPhoneVerified} />
              ) : undefined
            }
          />
          <Field
            label="Date of birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(value) => set("dateOfBirth", value)}
            hint="We send a plate on the house for the day."
          />
        </div>
      </SectionCard>

      {/* ─── Where it goes ─── */}
      <SectionCard
        title="Delivery address"
        description="Where the driver goes when you pick delivery at checkout."
        icon={<MapPin className="size-4" />}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Label"
            value={form.addressLabel}
            onChange={(value) => set("addressLabel", value)}
            hint="Home, work — whatever you’ll recognise."
          />
          <Field
            label="Address line 1"
            value={form.line1}
            onChange={(value) => set("line1", value)}
            autoComplete="address-line1"
          />
          <Field
            label="Address line 2"
            value={form.line2}
            onChange={(value) => set("line2", value)}
            autoComplete="address-line2"
          />
          <Field
            label="City"
            value={form.city}
            onChange={(value) => set("city", value)}
            autoComplete="address-level2"
          />
          <Field
            label="Eircode"
            value={form.postcode}
            onChange={(value) => set("postcode", value)}
            autoComplete="postal-code"
          />
        </div>
      </SectionCard>

      {/* ─── How you like it ─── */}
      <SectionCard
        title="At the table"
        description="What the kitchen should know before it starts on your order."
        icon={<Leaf className="size-4" />}
      >
        <fieldset>
          <legend className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            Dietary notes
          </legend>

          <div className="mt-4 flex flex-wrap gap-2">
            {dietaryOptions.map((option) => {
              const checked = form.dietary.includes(option);
              return (
                <label
                  key={option}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-colors duration-200",
                    checked
                      ? "border-primary/40 bg-primary/10 font-medium text-primary"
                      : "border-border bg-card/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDietary(option)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full border transition-colors",
                      checked
                        ? "border-primary bg-primary text-background"
                        : "border-current opacity-40",
                    )}
                  >
                    {checked && <CheckIcon className="size-2.5" />}
                  </span>
                  {option}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-9">
          <legend className="font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
            Keep me posted
          </legend>

          <div className="mt-2 divide-y divide-border/50">
            <Toggle
              label="Order updates"
              description="Texts when the kitchen starts and when the driver leaves."
              checked={form.orderUpdates}
              onChange={(value) => set("orderUpdates", value)}
            />
            <Toggle
              label="Offers and specials"
              description="The board changes with the delivery — we’ll say when."
              checked={form.offers}
              onChange={(value) => set("offers", value)}
            />
            <Toggle
              label="Monthly newsletter"
              description="One email a month. Nothing in between."
              checked={form.newsletter}
              onChange={(value) => set("newsletter", value)}
            />
          </div>
        </fieldset>
      </SectionCard>

      {/* The password lives in its own form, under this one — it posts to a
          different endpoint, so it carries its own button. */}

      {/* The bar is a row of the frame like everything else, and sticks to the
          foot of the window while there is still form below it. */}
      <div className="sticky bottom-0 z-20 flex flex-col-reverse items-stretch gap-3 border-b border-border/50 bg-background/85 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={() => setForm(accountDefaults)}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Discard changes
        </button>

        <button
          type="submit"
          disabled={saving}
          className="group inline-flex h-11 cursor-pointer items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save changes"}
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
            <ChevronRightIcon className="size-4" />
          </span>
        </button>
      </div>
    </form>
  );
}

/**
 * One labelled input, wearing the same clothes as the auth screens' fields.
 * The site's `<Input>` keeps its own copy of the value, which fights a form
 * that has to be able to reset itself — so this stays a plain controlled field.
 */
function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
  hint,
  badge,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  hint?: string;
  /** Sits beside the label — the verified / not-verified state. */
  badge?: React.ReactNode;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
>) {
  const id = `profile-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="cursor-pointer text-[13px] font-medium tracking-[-0.01em]"
        >
          {label}
        </label>
        {badge}
      </div>

      <div className="relative">
        {icon && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground/70"
          >
            {icon}
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-11 w-full rounded-lg border border-border bg-card/60 px-3.5 text-[14px] backdrop-blur-sm transition-colors",
            "placeholder:text-muted-foreground/70",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
            icon && "pl-10.5",
          )}
          {...props}
        />
      </div>

      {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Says whether the backend has confirmed this way of reaching the customer.
 * Quiet either way — an unverified number is a thing to get to, not a fault.
 */
function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.14em] uppercase",
        verified
          ? "bg-primary/10 text-primary"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      )}
    >
      {verified && <CheckIcon className="size-3" />}
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

/** A switch, written as a real checkbox so it reaches the keyboard. */
function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
      <span className="min-w-0">
        <span className="block text-[13.5px] font-medium tracking-[-0.01em]">
          {label}
        </span>
        <span className="mt-1 block max-w-[52ch] text-[12.5px] leading-[1.7] text-muted-foreground">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
          checked ? "border-primary bg-primary" : "border-border bg-card",
        )}
      >
        <span
          className={cn(
            "size-4.5 rounded-full transition-transform duration-200",
            checked
              ? "translate-x-5 bg-background"
              : "bg-muted-foreground/40",
          )}
        />
      </span>
    </label>
  );
}
