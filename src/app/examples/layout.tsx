"use client";

import { Box, Component, FileCode, FormInput, Home, Palette } from "lucide-react";

import { Suspense } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useActiveSection } from "~/hooks/useActiveSection";

import { cn } from "~/utils/cn";

import { Breadcrumb } from "./components/Breadcrumb";

const categories = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    href: "/examples",
  },
  {
    id: "ui",
    label: "UI Components",
    icon: Component,
    href: "/examples/ui",
    items: [
      { id: "inputs", label: "Inputs" },
      { id: "feedback", label: "Feedback" },
      { id: "layout", label: "Layout" },
      { id: "data-display", label: "Data Display" },
      { id: "overlay", label: "Overlay" },
      { id: "effects", label: "Effects" },
    ],
  },
  {
    id: "3d",
    label: "3D Graphics",
    icon: Box,
    href: "/examples/3d",
    items: [
      { id: "basic", label: "Physical Materials" },
      { id: "interactive", label: "Interactive Controls" },
      { id: "advanced", label: "Geometry Morphing" },
      { id: "physics", label: "Interactive Physics" },
    ],
  },
  {
    id: "nextjs",
    label: "Next.js Features",
    icon: FileCode,
    href: "/examples/nextjs",
    items: [
      { id: "api", label: "API Routes" },
      { id: "routing", label: "Dynamic Routing" },
      { id: "server", label: "Server Components" },
    ],
  },
  {
    id: "data",
    label: "Data & Forms",
    icon: FormInput,
    href: "/examples/data",
    items: [
      { id: "forms", label: "Form Validation" },
      { id: "state", label: "State Management" },
      { id: "storage", label: "Local Storage" },
    ],
  },
  {
    id: "theme",
    label: "Theming",
    icon: Palette,
    href: "/examples/theme",
    items: [
      { id: "darkmode", label: "Dark Mode" },
      { id: "colors", label: "Color System" },
      { id: "gradients", label: "Gradients" },
    ],
  },
];

function Navigation() {
  const pathname = usePathname();
  const { section: activeSection, category: activeCategory } = useActiveSection();

  return (
    <nav
      className="fixed inset-y-0 left-0 z-30 w-64 border-r bg-background flex flex-col"
      aria-label="Examples navigation"
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
        <Link
          href="/examples"
          className="flex items-center space-x-2 hover:opacity-80"
          aria-label="Examples home"
        >
          <div className="flex p-0 h-7 w-7 items-center justify-center rounded-lg border bg-background">
            <Component className="h-8 w-8" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl mt-4 relative group">
            <span className="relative z-10">Examples</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = pathname.startsWith(category.href);

            return (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors duration-200",
                    isActive ? "bg-background-secondary" : "hover:bg-background-secondary/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{category.label}</span>
                </Link>
                {isActive && category.items && (
                  <ul className="mt-1 ml-4 space-y-1 border-l pl-4">
                    {category.items.map((item) => {
                      const isItemActive =
                        activeSection === item.id || (!activeSection && activeCategory === item.id);

                      return (
                        <li key={item.id}>
                          <Link
                            href={`${category.href}?section=${item.id}`}
                            className={cn(
                              "block rounded-lg px-3 py-2 transition-all duration-200",
                              isItemActive
                                ? "bg-background-secondary text-primary font-medium"
                                : "hover:bg-background-secondary/25"
                            )}
                            aria-current={isItemActive ? "true" : undefined}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Suspense fallback={<div className="w-64" />}>
        <Navigation />
      </Suspense>

      {/* Main content */}
      <div className="flex-1 pl-64 flex flex-col">
        <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <Suspense fallback={<div className="h-6" />}>
              <Breadcrumb />
            </Suspense>
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
