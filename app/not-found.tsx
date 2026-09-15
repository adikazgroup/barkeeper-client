import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-black px-4">
      <div className="absolute inset-0 error-404" aria-hidden="true">
        <span className="error-digit error-digit--one">4</span>
        <span className="error-digit error-digit--two">
          0
          <span className="error-diamond" />
        </span>
        <span className="error-digit error-digit--three">4</span>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Page not found
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
