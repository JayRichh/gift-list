import { Suspense } from "react";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { Navigation } from "~/components/Navigation";
import { GradientBackground } from "~/components/ui/GradientBackground";
import { Spinner } from "~/components/ui/Spinner";

import "./globals.css";

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

export const metadata: Metadata = {
  title: "Next.js Template",
  description: "Minimal Next.js template with TypeScript, Tailwind, and Framer Motion",
};

function NavigationLoading() {
  return (
    <div className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <Spinner size="sm" variant="primary" />
    </div>
  );
}

function MainContentLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <Spinner size="lg" variant="primary" />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="bg-background text-foreground font-sans antialiased min-h-full flex flex-col">
        {/* Background gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <GradientBackground variant="default" />
        </div>

        {/* Navigation */}
        <Suspense fallback={<NavigationLoading />}>
          <Navigation />
        </Suspense>

        {/* Main content */}
        <div className="pt-16 flex-1 flex flex-col relative z-10">
          <Suspense fallback={<MainContentLoading />}>{children}</Suspense>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-background/80 backdrop-blur-sm border-t border-border/50">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Next.js Template</h3>
                <p className="text-sm text-foreground-secondary">
                  A minimal, type-safe template for building modern web applications.
                </p>
              </div>

              {/* Middle column */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-foreground-secondary">
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                  <li>Three.js</li>
                </ul>
              </div>

              {/* Right column */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://nextjs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground-secondary hover:text-primary transition-colors duration-200"
                    >
                      Next.js Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://threejs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground-secondary hover:text-primary transition-colors duration-200"
                    >
                      Three.js
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-center text-sm text-foreground-secondary">
                © {new Date().getFullYear()} Next.js Template. Built with Next.js, TypeScript, and
                Three.js.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
