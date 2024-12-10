"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useActiveSection } from "~/hooks/useActiveSection";

import { cn } from "~/utils/cn";

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const { section: activeSection, category: activeCategory } = useActiveSection();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  // Add active section to breadcrumb if it exists
  if (activeSection || activeCategory) {
    const sectionLabel = activeSection || activeCategory;
    if (sectionLabel) {
      const formattedLabel = sectionLabel
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbItems.push({
        href: `${pathname}?section=${sectionLabel}`,
        label: formattedLabel,
      });
    }
  }

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <span className="mx-2 text-foreground/40">/</span>
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-sm text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
