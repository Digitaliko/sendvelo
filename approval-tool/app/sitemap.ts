import type { MetadataRoute } from "next";
import {
  getAllLandingPages,
  getLandingPagePath,
} from "@/config/landing-pages";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://thumbway.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages = getAllLandingPages();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${APP_URL}/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${APP_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic landing pages
  const landingPageEntries: MetadataRoute.Sitemap = landingPages
    .filter((page) => page.status === "published" && page.seo.noIndex !== true)
    .map((page) => ({
      url: `${APP_URL}${getLandingPagePath(page)}`,
      lastModified: page.lastModified ? new Date(page.lastModified) : new Date(),
      changeFrequency: "monthly" as const,
      priority: page.priority,
    }));

  return [...staticPages, ...landingPageEntries];
}
