import type { ReactNode } from "react";


export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>

      <main>{children}</main>

    </div>
  );
}
