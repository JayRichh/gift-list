import { Metadata, Viewport } from "next";
import { metadata as baseMetadata, viewport as baseViewport } from "./metadata";

// Export metadata for the root layout
export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

// Import the client layout component
import ClientLayout from "./client-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
