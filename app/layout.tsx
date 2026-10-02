import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers";
import { env } from "@/lib/env";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Site-wide defaults. `openGraph` and `twitter` deliberately carry no title or
 * description: Next fills both from each page's own `title`/`description`, so
 * a shared link previews the page it points at rather than the home page.
 * The image comes from `app/opengraph-image.jpg`, kept as a small JPEG
 * because WhatsApp drops preview images over ~300 KB.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Barkeeper’s — Irish Bar & Grill in Hill East, Washington DC",
  description:
    "Discover Barkeeper’s Bar & Grill in Hill East, Washington DC—signature drinks, crave-worthy food and memorable nights with friends.",
  applicationName: "Barkeeper’s",
  openGraph: {
    type: "website",
    siteName: "Barkeeper’s",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else if (theme === 'light') {
                    root.classList.remove('dark');
                  } else {
                    // system theme
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (isDark) {
                      root.classList.add('dark');
                    } else {
                      root.classList.remove('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
