import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { LEGAL_PAGES } from "@/lib/dummyData";

/**
 * One entry per public route. The policy pages are listed from LEGAL_PAGES so
 * adding one there is enough to get it indexed.
 * See https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/features",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/how-it-works",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/integrations",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/faq",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/pricing",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: env.NEXT_PUBLIC_SITE_URL + "/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...LEGAL_PAGES.map((page) => ({
      url: env.NEXT_PUBLIC_SITE_URL + page.href,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
