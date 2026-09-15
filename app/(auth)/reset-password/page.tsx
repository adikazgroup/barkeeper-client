import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthFormSkeleton, ResetPasswordForm } from "../_components";

export const metadata: Metadata = {
  title: "Reset password",
  description:
    "Enter your reset code and choose a new password for your Barkeeper account.",
  // These screens carry nothing worth indexing and one of them takes an email
  // address on the query string.
  robots: { index: false, follow: false },
};

export default function Page() {
  // The form reads the query string, which suspends during prerender.
  return (
    <Suspense fallback={<AuthFormSkeleton fields={4} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
