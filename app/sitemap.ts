import type { MetadataRoute } from "next";
import { locations } from "@/data/locations";

const SITE = "https://malta-locations.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/brief`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/submit-a-location`, changeFrequency: "monthly", priority: 0.6 },
    ...locations.map((l) => ({
      url: `${SITE}/locations/${l.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
