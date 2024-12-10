"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useHeaderScroll } from "~/hooks/useHeaderScroll";

import { cn } from "~/utils/cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/examples", label: "Examples" },
  { href: "/three", label: "3D Demo" },
];

export function Navigation() {
  const isVisible = useHeaderScroll();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        !isVisible ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Navigation links */}
          <div className="flex items-center space-x-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={true}
                  className={cn(
                    "text-base font-medium transition-colors duration-200 relative group",
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-[19px] left-0 w-full h-[2px] bg-primary" />
                  )}
                  <span className="absolute -bottom-[19px] left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              );
            })}
          </div>

          {/* Right side - Additional actions */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/jayrichh/next-template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200 group relative"
            >
              GitHub
              <span className="absolute -bottom-[19px] left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
