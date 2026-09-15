import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthFormSkeleton, VerifyEmailForm } from "../_components";

export const metadata: Metadata = {
  title: "Verify email",
  description:
    "Confirm your email address with the six-digit code we sent you.",
  // These screens carry nothing worth indexing and one of them takes an email
  // address on the query string.
  robots: { index: false, follow: false },
};

export default function Page() {
  // The form reads the query string, which suspends during prerender.
  return (
    <Suspense fallback={<AuthFormSkeleton fields={2} />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
