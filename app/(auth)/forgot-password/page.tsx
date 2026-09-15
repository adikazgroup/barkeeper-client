import type { Metadata } from "next";

import { ForgotPasswordForm } from "../_components";

export const metadata: Metadata = {
  title: "Forgot password",
  description:
    "Request a code to reset the password on your Barkeeper account.",
  // These screens carry nothing worth indexing and one of them takes an email
  // address on the query string.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ForgotPasswordForm />;
}
