/**
 * The two flanks of the closing ask.
 *
 * A mug of beer on one side, a covered plate on the other — the bar and the
 * kitchen, which is the whole of what this place is. They stand where the
 * panel is empty anyway: the ask is a centred column, so the width either side
 * of it was doing nothing but holding a tint.
 *
 * Linework rather than pictures, and inline rather than files, for the reason
 * the feature art is: strokes reference `currentColor`, so the drawings take
 * the theme with them and no dark-mode variant has to be kept in step. They
 * are also masked to fade toward the middle, so the eye runs into the words
 * rather than into a drawing.
 *
 * They are ornament, so they are `aria-hidden`, and they are dropped below
 * `lg` — on a phone there is no room beside the column, and a decoration that
 * crowds the ask is worse than no decoration.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CtaSideArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
    >
      <Flank side="left">
        <BeerArt />
      </Flank>

      <Flank side="right">
        <PlateArt />
      </Flank>
    </div>
  );
}

/**
 * One drawing, parked against an edge and faded off toward the centre.
 *
 * The mask runs inward, not outward: the darkest part of each drawing is the
 * part furthest from the copy.
 */
function Flank({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const fade = `linear-gradient(${
    side === "left" ? "90deg" : "270deg"
  }, #000 0%, rgba(0,0,0,0.65) 45%, transparent 100%)`;

  return (
    <div
      className={`absolute top-1/2 w-44 -translate-y-1/2 text-foreground/[0.13] xl:w-52 dark:text-foreground/[0.16] ${
        side === "left" ? "left-2 xl:left-8" : "right-2 xl:right-8"
      }`}
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {children}
    </div>
  );
}

/** A mug, its head of foam, and the bubbles coming up through it. */
function BeerArt() {
  return (
    <svg viewBox="0 0 130 250" className="w-full" {...STROKE}>
      {/* The head, sitting proud of the rim */}
      <path d="M33 66q1-17 14-11 2-15 16-9 9-11 18 1 12-2 8 18" />

      {/* Rim, then the body tapering into a foot */}
      <ellipse cx="61" cy="70" rx="28" ry="7" />
      <path d="M33 70l5 132q1 7 8 7h30q7 0 8-7l5-132" />

      {/* Handle */}
      <path d="M90 98q22 5 22 28t-22 28" />

      {/* Where the beer stands, and what is rising through it */}
      <path d="M38 96h46" opacity="0.7" />
      <circle cx="52" cy="128" r="3" />
      <circle cx="68" cy="146" r="2" />
      <circle cx="56" cy="164" r="2.5" />
      <circle cx="70" cy="184" r="1.6" />

      {/* A barley ear leaning in from the side */}
      <path d="M104 236v-46" />
      <path d="M104 198q-9-2-10-11 9 1 10 11zM104 198q9-2 10-11-9 1-10 11zM104 212q-9-2-10-11 9 1 10 11zM104 212q9-2 10-11-9 1-10 11z" />
    </svg>
  );
}

/** A covered plate, steaming, with the cover about to come off. */
function PlateArt() {
  return (
    <svg viewBox="0 0 130 250" className="w-full" {...STROKE}>
      {/* Steam */}
      <path d="M50 92c-7-11 7-15 0-27M65 84c-7-11 7-15 0-27M80 92c-7-11 7-15 0-27" opacity="0.8" />

      {/* The cover, and its handle */}
      <circle cx="65" cy="112" r="5" />
      <path d="M65 117v4" />
      <path d="M27 158a38 38 0 0 1 76 0" />
      <path d="M22 158h86" />

      {/* The plate under it */}
      <path d="M16 164q49 15 98 0" />
      <path d="M16 164q0 9 8 11h82q8-2 8-11" />

      {/* Cutlery, laid out below the way a table is set */}
      <path d="M36 196v42M36 196v14M30 196v14M42 196v14" />
      <path d="M94 238v-24q10-4 10-18t-10 0z" />
    </svg>
  );
}
