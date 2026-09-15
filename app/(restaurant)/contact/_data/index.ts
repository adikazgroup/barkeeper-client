import { Calendar, Mail, MapPin, Phone } from "lucide-react";

import { COMPANY } from "@/lib/dummyData";

/** Shared by the hero and the contact cards, so the pin only lives once. */
export const MAP_URL = "https://share.google/PVNHE8SL1vMwH3Lc1";

/** The number as it is dialled — spaces stripped, so `tel:` links work. */
export const TEL = `tel:${COMPANY.phone.replace(/\s/g, "")}`;

/**
 * The week, one row per day.
 *
 * Grouped ranges ("Mon–Wed") read fine as a sentence but cannot be laid out as
 * a week or matched against today, so the days are listed out in full.
 */
export const week = [
  { short: "Mon", day: "Monday", open: "12:00", close: "22:00" },
  { short: "Tue", day: "Tuesday", open: "12:00", close: "22:00" },
  { short: "Wed", day: "Wednesday", open: "12:00", close: "22:00" },
  { short: "Thu", day: "Thursday", open: "12:00", close: "23:00" },
  { short: "Fri", day: "Friday", open: "12:00", close: "23:00" },
  { short: "Sat", day: "Saturday", open: "11:00", close: "23:30" },
  { short: "Sun", day: "Sunday", open: "11:00", close: "21:30" },
];

export const cards = [
  {
    icon: MapPin,
    label: "The door",
    content: COMPANY.address.full,
    link: MAP_URL,
    linkLabel: "View map",
  },
  {
    icon: Phone,
    label: "The phone",
    content: COMPANY.phone,
    link: TEL,
    linkLabel: "Ring us",
  },
  {
    icon: Mail,
    label: "The post",
    content: COMPANY.email,
    link: `mailto:${COMPANY.email}`,
    linkLabel: "Write to us",
  },
  {
    icon: Calendar,
    label: "The hours",
    content: "Open seven days, noon till late",
    link: "#hours",
    linkLabel: "See the week",
  },
];
