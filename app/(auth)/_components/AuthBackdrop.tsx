import Image from "next/image";

/**
 * The ground every auth screen sits on, and the reason they all feel like the
 * rest of the site rather than a form in a white box.
 *
 * The photograph is masked away towards the top and drained of its own colour,
 * so it reads as texture under the page instead of a picture behind it — the
 * form never lands on the busy part of the room.
 */
export function AuthBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 isolate opacity-[0.28] dark:opacity-[0.13] dark:brightness-75"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.5) 30%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.5) 30%, #000 100%)",
        }}
      >
        <Image
          src="/herobg2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Drains the picture's own colour so it reads as ground, not image. */}
        <div className="absolute inset-0 bg-background mix-blend-color" />
      </div>

      {/* A single warm bloom along the foot of the screen. */}
      <div className="absolute -bottom-56 left-1/2 h-120 w-340 -translate-x-1/2 rounded-[50%] bg-primary/10 blur-[160px]" />

      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  );
}
