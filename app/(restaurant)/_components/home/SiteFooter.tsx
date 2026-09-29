import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";
import { COMPANY, LEGAL_PAGES } from "@/lib/dummyData";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "Promotions", href: "/promotions" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: LEGAL_PAGES.map((page) => ({ ...page })),
  },
];

const LINK_CLASS =
  "text-[13.5px] text-muted-foreground transition-colors duration-200 hover:text-foreground";

const SOCIALS = [
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: WhatsAppIcon, label: "WhatsApp", href: "#" },
  { Icon: TelegramIcon, label: "Telegram", href: "#" },
];


const CELL = "px-5 sm:px-8";


function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 isolate opacity-[0.2] dark:opacity-[0.1] dark:brightness-75"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 38%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 38%, #000 100%)",
        }}
      >
        <Image
          src="/herobg2.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Drains the picture's own colour so it reads as ground, not image. */}
        <div className="absolute inset-0 bg-background mix-blend-color" />
      </div>

      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen" />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border/50">
      <Backdrop />
      <div className="mx-auto max-w-7xl">
        <div className="border-x border-border/50">
          <div className="grid lg:grid-cols-[1.3fr_2fr]">
            <div className={`py-14 lg:border-r lg:border-border/50 ${CELL}`}>
              <Link
                href="/"
                aria-label="Barkeeper's home"
                className="inline-flex items-center"
              >
                <Logo className="h-10 w-auto sm:h-11" />
              </Link>
              <p className="mt-4 max-w-[36ch] text-[13.5px] leading-[1.7] text-muted-foreground">
                A lively neighbourhood Irish bar in Hill East — rotating taps,
                playful cocktails, award-winning wings and a well-poured Guinness.
              </p>


              <ul className="mt-7 flex items-center gap-2.5">
                {SOCIALS.map(({ Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon className="size-4.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`grid grid-cols-2 gap-8 border-t border-border/50 py-14 sm:grid-cols-3 lg:border-t-0 ${CELL}`}
            >
              {COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="text-[14px] font-medium tracking-[-0.01em]">
                    {column.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith("/") ? (
                          <Link href={link.href} className={LINK_CLASS}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={link.href} className={LINK_CLASS}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* The legal line closes the frame: its rule runs the full width. */}
          <div
            className={`flex flex-col gap-2 border-t border-border/50 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 ${CELL}`}
          >
            <p className="text-[12.5px] text-muted-foreground">
              © {new Date().getFullYear()} {COMPANY.legalName}

              
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              {COMPANY.address.full}
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              Crafted by{" "}
              <a
                href="https://adikaz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-primary hover:decoration-primary"
              >
                Adikaz Consortium Limited
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
