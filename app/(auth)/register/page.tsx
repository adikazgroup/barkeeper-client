import type { Metadata } from "next";

import { RegisterForm } from "../_components";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a Barkeeper account to order, book a table and save your favourites.",
  // These screens carry nothing worth indexing and one of them takes an email
  // address on the query string.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterForm />;
}
