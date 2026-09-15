import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthFormSkeleton, LoginForm } from "../_components";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your Barkeeper account to order, book a table and track it all.",
  // These screens carry nothing worth indexing and one of them takes an email
  // address on the query string.
  robots: { index: false, follow: false },
};

export default function Page() {
  // The form reads the query string, which suspends during prerender.
  return (
    <Suspense fallback={<AuthFormSkeleton fields={2} />}>
      <LoginForm />
    </Suspense>
  );
}
