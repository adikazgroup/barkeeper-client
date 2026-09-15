interface AuthHeadingProps {
  title: string;
  subtitle: React.ReactNode;
}

/**
 * The head of every auth screen, so all five read as one set.
 *
 * Centred and a step down from the marketing headlines: inside a 420px card a
 * 36px display size would wrap to three lines and read as a page title rather
 * than the top of a form.
 */
export function AuthHeading({ title, subtitle }: AuthHeadingProps) {
  return (
    <header className="mb-5 text-center">
      <h1 className="text-[24px] leading-[1.15] font-medium tracking-[-0.035em] text-foreground sm:text-[26px]">
        {title}
      </h1>

      <p className="mx-auto mt-2 max-w-[42ch] text-[13.5px] leading-[1.65] text-muted-foreground">
        {subtitle}
      </p>
    </header>
  );
}
