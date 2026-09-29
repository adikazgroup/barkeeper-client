"use client";

import { usePathname } from "next/navigation";

export function HideOnRoutes({
  routes,
  children,
}: {
  routes: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (routes.includes(pathname)) return null;
  return children;
}
