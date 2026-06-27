import type { MetadataRoute } from "next";
import { DATASET } from "../lib/dataset";

const BASE = "https://reclause.penguinalley.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const stateRoutes = DATASET.map((s) => ({
    url: `${BASE}/states/${s.code.toLowerCase()}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/scan`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/states`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    ...stateRoutes,
  ];
}
