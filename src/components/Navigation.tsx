"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Gift, Users, PieChart, GiftIcon, Menu } from "lucide-react";
import { useHeaderScroll } from "~/hooks/useHeaderScroll";
import { cn } from "~/utils/cn";
import { useState, useEffect } from "react";
import { FullscreenMenu } from "./ui/FullscreenMenu";

const PROTECTED_ROUTES = ["/groups", "/gifts", "/analytics"];
const STORAGE_KEYS = {
  SETUP_COMPLETED: 'hasCompletedSetup',
};

const navLinks = [
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/gifts", label: "All Gifts", icon: Gift },
  { href: "/analytics", label: "Analytics", icon: PieChart },
];

export function Navigation() {
  const isVisible = useHeaderScroll();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasCheckedSetup, setHasCheckedSetup] = useState(false);

  useEffect(() => {
    const hasCompletedSetup = localStorage.getItem(STORAGE_KEYS.SETUP_COMPLETED);
    if (!hasCompletedSetup && PROTECTED_ROUTES.some(route => pathname?.startsWith(route))) {
      router.push('/');
    }
    setHasCheckedSetup(true);
  }, [pathname, router]);

  // Don't render anything until we've checked setup status
  if (!hasCheckedSetup) {
    return null;
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-30 transition-all duration-300",
          !isVisible ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              href="/"
              className="flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <GiftIcon className="w-6 h-6" />
              <span className="text-lg">Gift List</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname?.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={cn(
                      "text-base font-medium transition-colors duration-200 relative group flex items-center gap-2",
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {isActive && (
                      <span className="absolute -bottom-[23px] sm:-bottom-[27px] left-0 w-full h-[2px] bg-primary" />
                    )}
                    <span className="absolute -bottom-[23px] sm:-bottom-[27px] left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  </Link>
                );
              })}
            </div>

            {/* Menu Button (visible on all screens) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-background-secondary/80 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu */}
      <FullscreenMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
