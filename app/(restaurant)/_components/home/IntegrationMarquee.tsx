"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  MessengerIcon,
  TelegramIcon,
  TikTokIcon,
  WebflowIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";

interface Integration {
  name: string;
  Icon?: ComponentType<{ className?: string }>;
  wordmarkClassName?: string;
}

const INTEGRATIONS: Integration[] = [
  { name: "Instagram", Icon: InstagramIcon },
  { name: "Facebook", Icon: FacebookIcon },
  { name: "Messenger", Icon: MessengerIcon },
  { name: "WhatsApp", Icon: WhatsAppIcon },
  { name: "TikTok", Icon: TikTokIcon },
  { name: "Telegram", Icon: TelegramIcon },
  { name: "Webflow", Icon: WebflowIcon },
  { name: "Shopify", wordmarkClassName: "font-semibold tracking-tight" },
  { name: "WooCommerce", wordmarkClassName: "font-medium tracking-tight" },
  { name: "WordPress", wordmarkClassName: "font-medium tracking-tight" },
];

function IntegrationChip({
  item,
  duplicate = false,
}: {
  item: Integration;
  duplicate?: boolean;
}) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-2 px-6 text-muted-foreground transition-colors duration-300 hover:text-foreground"
    >
      {item.Icon ? <item.Icon className="size-4.5" /> : null}
      <span
        className={cn(
          "text-[15px] whitespace-nowrap",
          item.wordmarkClassName ?? "font-medium tracking-tight",
        )}
      >
        {item.name}
      </span>
    </li>
  );
}

export function IntegrationMarquee() {
  return (
    <section
      id="integrations"
      className="relative border-t border-border/50 bg-background py-10"
    >
      <div className="marquee-mask  overflow-hidden">
        <ul
          className="animate-marquee flex w-max items-center"
          style={{ "--marquee-duration": "46s" } as React.CSSProperties}
        >
          {INTEGRATIONS.map((item) => (
            <IntegrationChip key={item.name} item={item} />
          ))}
          {INTEGRATIONS.map((item) => (
            <IntegrationChip
              key={`${item.name}-duplicate`}
              item={item}
              duplicate
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
