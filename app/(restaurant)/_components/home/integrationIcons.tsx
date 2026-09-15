import type { ComponentType } from "react";
import { Blocks, CodeXml, ShoppingBag } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  MessengerIcon,
  TelegramIcon,
  TikTokIcon,
  WebflowIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";
import type { IconKey } from "@/lib/integrations";

/**
 * Names from `lib/integrations` to the marks that draw them.
 *
 * The data stays plain so it can be read anywhere; this is the one place that
 * decides what each connection looks like, so the home shortlist and the
 * integrations page never show the same platform under two different icons.
 */
export const INTEGRATION_ICONS: Record<
  IconKey,
  ComponentType<{ className?: string }>
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  messenger: MessengerIcon,
  whatsapp: WhatsAppIcon,
  tiktok: TikTokIcon,
  telegram: TelegramIcon,
  woocommerce: Blocks,
  shopify: ShoppingBag,
  webflow: WebflowIcon,
  custom: CodeXml,
};
