/**
 * What an account is actually for, kept under the card.
 *
 * The same three promises the side panel used to carry, trimmed to one line
 * each — beside a centred form there is no room for a column of prose, but the
 * reason to sign up still belongs on the screen. Dropped below `sm` and on short windows, where it
 * would only push the card off the fold.
 */
const POINTS = [
  "One account, every order",
  "A table without the phone call",
  "Your usual, one tap away",
];

export function AuthAssurance() {
  return (
    <div className="mt-6 block max-sm:hidden [@media(max-height:860px)]:hidden">
      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {POINTS.map((point) => (
          <li
            key={point}
            className="flex items-center gap-2 text-[12.5px] text-muted-foreground"
          >
            <span
              aria-hidden
              className="size-1 shrink-0 rounded-full bg-primary/60"
            />
            {point}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-center text-[12px] leading-[1.7] text-muted-foreground/80">
        Free to join, and nothing to cancel. We only email you about the order
        in front of you.
      </p>
    </div>
  );
}
