import { Metadata, Viewport } from "next";
import { metadata as baseMetadata, viewport as baseViewport } from "./metadata";
import localFont from "next/font/local";
import "./globals.css";

// Export metadata for the root layout
export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

// Import the client layout component
import ClientLayout from "./client-layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  preload: true,
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  preload: true,
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="bg-background text-foreground font-sans antialiased min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
