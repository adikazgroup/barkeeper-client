import { GoogleIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

import { HeroBackdrop } from "./HeroBackdrop";
import { Reveal } from "./Reveal";

interface Quote {
  quote: string;
  name: string;
  /** Where they are from, so the room feels local rather than anonymous. */
  role: string;
  initials: string;
  /** The one fact the quote is really about. */
  detail: string;
  /** How much room the card takes in its column. */
  size: "short" | "tall";
  lead?: boolean;
}

/**
 * ⚠️ Placeholder wording attributed to invented people. Replace every one of
 * these with a real review — quoted as written, with permission — before this
 * page goes live. A made-up testimonial with a name under it is not copy, it
 * is a claim about a person who does not exist.
 *
 * Held as columns rather than as one list, because the arrangement is the
 * point: each column carries one short card and one tall one, so the three of
 * them still end on the same line while no two columns break in the same
 * place. A row of six equal cards reads as a table of contents; this reads as
 * a wall. The quotes are written to the length their slot wants.
 */
const COLUMNS: Quote[][] = [
  [
    {
      quote:
        "Third Friday running we have ended up here. The steak and cheese is what gets us through the door; what keeps us at the table is that nobody starts stacking chairs at eleven.",
      name: "Tanvir Ahmed",
      role: "Board Bazar",
      initials: "TA",
      detail: "Third Friday running",
      size: "short",
    },
    {
      quote:
        "I am the one at the table who cannot eat shellfish, and after twenty years of it I am used to being a nuisance. Here someone came out of the kitchen, sat down for a minute and went through what they could do and what they could not promise me, because the fryers are shared. Nobody has ever been that straight with me about it. We go most months now.",
      name: "Nusrat Jahan",
      role: "Uttara, Dhaka",
      initials: "NJ",
      detail: "Allergy noted",
      size: "tall",
    },
  ],
  [
    {
      quote:
        "We booked the back room for my father's sixtieth — eighteen of us, and I spent the week before it worrying. They moved the tables twice without being asked, sent the wings out in waves so nothing went cold, and turned the music down at our end once the speeches started. The bill was what they had quoted me a fortnight earlier, to the taka.",
      name: "Farhana Islam",
      role: "Gazipur",
      initials: "FI",
      detail: "Table for 18",
      size: "tall",
      lead: true,
    },
    {
      quote:
        "Order at one in the morning on a Friday and it still turns up hot. Third time now. I have stopped being surprised by it and started planning my week around it.",
      name: "Rakib Hasan",
      role: "Tongi",
      initials: "RH",
      detail: "Delivered 1:10am",
      size: "short",
    },
  ],
  [
    {
      quote:
        "Booked a table from my phone in under a minute and it was confirmed before I put it down. No call, no waiting to hear back, and nobody had lost it when we turned up.",
      name: "Sadia Karim",
      role: "Joydebpur",
      initials: "SK",
      detail: "Booked in 40 seconds",
      size: "short",
    },
    {
      quote:
        "We order for the office most Thursdays, fifteen boxes at a time, and I am the one who gets blamed when it goes wrong. In four months they have not once mixed up whose is whose, the vegetarian ones come labelled, and twice when the kitchen was behind they messaged me before I had to ask. That last part is why we keep going back.",
      name: "Imran Chowdhury",
      role: "Chandana",
      initials: "IC",
      detail: "15 boxes a week",
      size: "tall",
    },
  ],
];

/* ------------------------------------------------------------------ parts */

function QuoteCard({
  quote,
  name,
  role,
  initials,
  detail,
  size,
  lead,
}: Quote) {
  return (
    // The height is set here and the quote absorbs it, so the rule above the
    // name lands where the column wants it rather than where the words end.
    // Only from `lg`, where the cards are in columns at all.
    <figure
      className={cn(
        "group flex flex-col rounded-xl border p-6 backdrop-blur-sm",
        size === "tall" ? "lg:min-h-100" : "lg:min-h-72",
        "transition-[border-color,box-shadow,background-color] duration-300 ease-out",
        lead
          ? "border-primary/30 bg-primary/8"
          : "border-border/70 bg-card/80 hover:border-primary/25",
        "hover:shadow-[0_24px_50px_-40px_rgba(0,0,0,0.45)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-300",
            lead
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-background/60 text-muted-foreground group-hover:text-foreground",
          )}
        >
          <GoogleIcon className="size-4" />
        </span>

        <span className="rounded-full border border-border/70 px-2.5 py-1 text-[11.5px] leading-none whitespace-nowrap text-muted-foreground">
          {detail}
        </span>
      </div>

      <blockquote className="mt-5 flex-1 text-[15px] leading-[1.75] text-foreground/90">
        {quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-[12px] font-medium text-muted-foreground"
        >
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14.5px] font-medium">{name}</span>
          <span className="block truncate text-[13px] text-muted-foreground">
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- section */

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative isolate border-y border-border/50"
    >
      {/* Quieter than under the hero: there are six blocks of text over it. */}
      <HeroBackdrop className="opacity-55" />

      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <Reveal className="flex flex-wrap items-center justify-between gap-5 border-b border-border/50 px-5 py-10 sm:px-8">
            <h2 className="max-w-[18ch] text-[30px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[40px]">
              What people say once they are home
            </h2>
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-muted-foreground">
              Birthdays, late deliveries and the same Friday table. None of it
              was asked for, and none of it is about the food alone.
            </p>
          </Reveal>

          {/* Columns written out rather than left to CSS `columns`, which
              fills top to bottom and ends each one wherever it runs out. */}
          <div className="grid gap-4 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
            {COLUMNS.map((column, columnIndex) => (
              <div key={column[0].name} className="flex flex-col gap-4">
                {column.map((item) => (
                  <Reveal key={item.name} delay={columnIndex * 0.08} y={22}>
                    <QuoteCard {...item} />
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
