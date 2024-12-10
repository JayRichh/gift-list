import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(var(--background))" },
    { media: "(prefers-color-scheme: dark)", color: "hsl(var(--background))" },
  ],
};

export const metadata: Metadata = {
  title: "Gift List - Organize Your Gift Giving",
  description: "A modern app to manage and track gifts for your family and friends",
  keywords: ["gift list", "gift tracking", "gift management", "gift organization"],
  authors: [{ name: "Gift List Team" }],
  openGraph: {
    title: "Gift List - Organize Your Gift Giving",
    description: "A modern app to manage and track gifts for your family and friends",
    type: "website",
  },
};
