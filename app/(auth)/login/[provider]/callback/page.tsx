import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AuthFormSkeleton } from "../../../_components";
import {
  SocialCallback,
  type TSocialProvider,
} from "../../../_components/SocialCallback";

export const metadata: Metadata = {
  title: "Signing you in",
  // A one-time code rides on the query string; nothing here is for indexing.
  robots: { index: false, follow: false },
};

const PROVIDERS: TSocialProvider[] = ["google", "apple"];

export default async function Page({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;

  if (!PROVIDERS.includes(provider as TSocialProvider)) notFound();

  // The callback reads `?code`, which suspends during prerender.
  return (
    <Suspense fallback={<AuthFormSkeleton fields={0} />}>
      <SocialCallback provider={provider as TSocialProvider} />
    </Suspense>
  );
}
