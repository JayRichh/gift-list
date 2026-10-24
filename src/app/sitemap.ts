import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://gifters.vercel.app", lastModified: new Date() }];
}
