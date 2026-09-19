"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  MailIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons/Icons";
import { Phone } from "lucide-react";
import { AuthApiError, updateMe, type ProfileUpdate } from "@/lib/auth/api";
import {
  AVATAR_ACCEPT,
  AVATAR_MAX_BYTES,
  AVATAR_TYPES,
} from "@/lib/auth/constants";
import { cn } from "@/lib/utils";
import { SectionCard } from "./SectionCard";

/**
 * Everything the form can change.
 *
 * One field per thing `PATCH /users/me` actually stores, and nothing else. A
 * field with nowhere to go is worse than a missing one: the customer fills it
 * in, presses save, is told it saved, and it is gone on the next load.
 */
interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

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
 * The backend stores one `name`, so the first word is taken as the first name
 * and whatever follows as the last. They are joined back up on save.
 */
function accountState(account: Account): FormState {
  const [firstName, ...rest] = account.name.trim().split(/\s+/);

  return {
    firstName: firstName ?? "",
    lastName: rest.join(" "),
    email: account.email,
    phone: account.phone,
  };
}

/**
 * What the customer has done to the photo since the page loaded. Three states
 * rather than a nullable file, because "left alone" and "cleared" have to
 * reach `PATCH /users/me` as different things: one sends nothing at all, the
 * other sends `removeProfilePicture`.
 */
type PictureEdit =
  | { kind: "unchanged" }
  | { kind: "replaced"; file: File; previewUrl: string }
  | { kind: "removed" };

export function ProfileForm({ account }: { account: Account }) {
  const { data: session } = useSession();
  const router = useRouter();

  // Resolved on the server and passed in, so the fields are right in the first
  // paint rather than filling in a beat later.
  const accountDefaults = useMemo(() => accountState(account), [account]);

  const [form, setForm] = useState<FormState>(accountDefaults);
  const [picture, setPicture] = useState<PictureEdit>({ kind: "unchanged" });
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>();
  const fileInput = useRef<HTMLInputElement>(null);

  // An object URL is a handle on a blob the browser holds until it is revoked,
  // so every preview that is replaced or dropped releases its own.
  useEffect(() => {
    if (picture.kind !== "replaced") return;
    const url = picture.previewUrl;
    return () => URL.revokeObjectURL(url);
  }, [picture]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  /** Back to what the account says — fields, photo and all. */
  const discard = () => {
    setForm(accountDefaults);
    setPicture({ kind: "unchanged" });
    setNameError(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };

  const pickFile = (file: File | undefined) => {
    if (!file) return;

    if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) {
      toast.error("Photos have to be a JPG, PNG or WebP.");
      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("That photo is over 2 MB. Try a smaller one.");
      return;
    }

    setPicture({
      kind: "replaced",
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const removePhoto = () => {
    setPicture({ kind: "removed" });
    // Without this the same file picked again fires no `change` event, and the
    // photo could not be put back the way it was.
    if (fileInput.current) fileInput.current.value = "";
  };

  /** What the avatar frame is showing right now, whatever its source. */
  const shownAvatar =
    picture.kind === "replaced"
      ? picture.previewUrl
      : picture.kind === "removed"
        ? null
        : account.avatarUrl;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    if (!name) {
      setNameError("Tell us what to put on the docket.");
      return;
    }

    setNameError(undefined);

    if (!session?.accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    const phone = form.phone.trim();

    const payload: ProfileUpdate = {
      name,
      // `null`, not an empty string: that is the only way to clear a number.
      phone: phone || null,
    };

    if (picture.kind === "replaced") {
      payload.profilePicture = {
        title: form.firstName.trim() || name,
        alt: name,
      };
    } else if (picture.kind === "removed") {
      payload.removeProfilePicture = true;
    }
    // `unchanged` sends neither, which is what leaves the stored photo alone.

    setSaving(true);

    try {
      await updateMe(
        payload,
        session.accessToken,
        picture.kind === "replaced" ? picture.file : null,
      );

      // The photo is on the account now, so the local preview has done its job
      // and the frame goes back to reading whatever the server hands down.
      setPicture({ kind: "unchanged" });
      if (fileInput.current) fileInput.current.value = "";

      // The band at the top of the layout paints the same name and photo from
      // its own `/users/me` read, so the whole route is re-rendered rather than
      // just this form — otherwise the header would still show the old one.
      router.refresh();

      toast.success("Your details are up to date.", { icon: "🍀" });
    } catch (error) {
      toast.error(
        error instanceof AuthApiError
          ? error.message
          : "Could not save your details. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
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
              {shownAvatar ? (
                <Image
                  src={shownAvatar}
                  alt=""
                  fill
                  sizes="80px"
                  // The bucket host and a local `blob:` preview are both past
                  // what the optimizer will take, so neither goes through it.
                  unoptimized
                  className="object-cover"
                />
              ) : (
                (form.firstName || account.name).trim().charAt(0).toUpperCase()
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInput}
                type="file"
                accept={AVATAR_ACCEPT}
                onChange={(event) => pickFile(event.target.files?.[0])}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
              />

              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={saving}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-[13px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CameraIcon className="size-4" />
                {shownAvatar ? "Change photo" : "Add photo"}
              </button>

              {shownAvatar && (
                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={saving}
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-[13px] font-medium text-muted-foreground backdrop-blur-sm transition-colors duration-200 hover:border-danger/40 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <TrashIcon className="size-4" />
                  Remove
                </button>
              )}
            </div>

            <p className="mt-2.5 text-[12px] text-muted-foreground">
              {picture.kind === "replaced"
                ? "Ready to go — save to put it on your account."
                : picture.kind === "removed"
                  ? "Save to take the photo off your account."
                  : "JPG, PNG or WebP, up to 2 MB."}
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
            error={nameError}
            disabled={saving}
            required
          />
          <Field
            label="Last name"
            value={form.lastName}
            onChange={(value) => set("lastName", value)}
            autoComplete="family-name"
            disabled={saving}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => set("email", value)}
            icon={<MailIcon className="size-4.5" />}
            autoComplete="email"
            // The address is what the account is keyed on, and the endpoint
            // refuses one in the payload outright. Shown, not edited.
            readOnly
            hint="Your sign-in address. Contact us if it needs to change."
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
            disabled={saving}
            badge={
              form.phone ? (
                <VerifiedBadge verified={account.isPhoneVerified} />
              ) : undefined
            }
          />
        </div>
      </SectionCard>

      {/* The password lives in its own form, under this one — it posts to a
          different endpoint, so it carries its own button. */}

      {/* The bar is a row of the frame like everything else, and sticks to the
          foot of the window while there is still form below it. */}
      <div className="sticky bottom-0 z-20 flex flex-col-reverse items-stretch gap-3 border-b border-border/50 bg-background/85 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={discard}
          disabled={saving}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 px-5 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
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
  error,
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
  /** Replaces the hint when this field is what the save tripped over. */
  error?: string;
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
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            "h-11 w-full rounded-lg border bg-card/60 px-3.5 text-[14px] backdrop-blur-sm transition-colors",
            "placeholder:text-muted-foreground/70",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/15 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "read-only:text-muted-foreground read-only:focus:border-border read-only:focus:ring-0",
            error ? "border-danger/60" : "border-border",
            icon && "pl-10.5",
          )}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[12px] text-danger">{error}</p>
      ) : (
        hint && <p className="text-[12px] text-muted-foreground">{hint}</p>
      )}
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
