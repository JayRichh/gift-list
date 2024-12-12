"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift as GiftIcon, Users, PieChart, Settings, Sun, Moon, Monitor, DollarSign, RefreshCw, ShoppingCart, AlertCircle, Upload, Database } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Select } from "./Select";
import { Text } from "./Text";
import { CSVImport } from "./CSVImport";
import type { BudgetPreference, Group, Member, Gift } from "~/types/gift-list";
import { usePlannedGifts } from "~/hooks/gift-list/usePlannedGifts";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainLinks = [
  { label: "Groups", path: "/groups", icon: Users },
  { label: "All Gifts", path: "/gifts", icon: GiftIcon },
  { label: "Analytics", path: "/analytics", icon: PieChart },
];

const themeOptions = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
  { label: "System", value: "system", icon: Monitor },
];

const STORAGE_KEYS = {
  SETUP_COMPLETED: 'hasCompletedSetup',
  BUDGET_PREFERENCES: 'budgetPreferences',
  GROUPS: 'gift-list-groups',
  MEMBERS: 'gift-list-members',
  GIFTS: 'gift-list-gifts'
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const containerVariants = {
  hidden: { clipPath: "circle(0% at 95% 5%)" },
  visible: {
    clipPath: "circle(150% at 95% 5%)",
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    clipPath: "circle(0% at 95% 5%)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2
    }
  }
};

export function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [budgetPrefs, setBudgetPrefs] = React.useState<BudgetPreference | null>(null);
  const { plannedGifts, loading: giftsLoading } = usePlannedGifts();
  const [hasCompletedSetup, setHasCompletedSetup] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedPrefs = localStorage.getItem(STORAGE_KEYS.BUDGET_PREFERENCES);
    const setupCompleted = localStorage.getItem(STORAGE_KEYS.SETUP_COMPLETED);
    setHasCompletedSetup(!!setupCompleted);
    if (storedPrefs) {
      setBudgetPrefs(JSON.parse(storedPrefs));
    }
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleSetupClick = () => {
    onClose();
    router.push('/?setup=true');
  };

  const updateBudgetPreferences = (updates: Partial<BudgetPreference>) => {
    const newPrefs = { ...budgetPrefs, ...updates } as BudgetPreference;
    setBudgetPrefs(newPrefs);
    localStorage.setItem(STORAGE_KEYS.BUDGET_PREFERENCES, JSON.stringify(newPrefs));
  };

  const handleReset = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    setBudgetPrefs(null);
    setHasCompletedSetup(false);
    onClose();
    router.push('/');
  };

  const handleImport = (data: { groups: Group[], members: Member[], gifts: Gift[] }) => {
    // Merge with existing data
    const existingGroups = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROUPS) || '[]');
    const existingMembers = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]');
    const existingGifts = JSON.parse(localStorage.getItem(STORAGE_KEYS.GIFTS) || '[]');

    const newGroups = [...existingGroups, ...data.groups];
    const newMembers = [...existingMembers, ...data.members];
    const newGifts = [...existingGifts, ...data.gifts];

    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(newGroups));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(newMembers));
    localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(newGifts));

    // Refresh the page to show new data
    router.refresh();
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[99] bg-gradient-to-br from-background/95 via-background to-background pointer-events-auto backdrop-blur-md"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={menuRef}
        variants={containerVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className={cn(
          "fixed inset-0 z-[100] flex min-h-screen w-screen flex-col bg-gradient-to-br from-background via-background to-background/90",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          className="border-b border-border/50 px-6 py-4"
        >
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 sm:px-8">
            <Text className="text-3xl font-bold">Menu</Text>
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="text-foreground hover:bg-background/95 p-3"
              aria-label="Close menu"
            >
              <X className="h-9 w-9" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="space-y-8">
                {!hasCompletedSetup && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate={isOpen ? "visible" : "hidden"}
                    className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div className="space-y-2">
                        <Text className="font-medium">Setup Required</Text>
                        <Text className="text-sm text-foreground/60">Complete the first-time setup to access all features.</Text>
                        <Button
                          variant="primary"
                          onClick={handleSetupClick}
                          className="w-full mt-2"
                        >
                          Complete Setup
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-6">
                  <Text className="text-lg font-medium">Navigation</Text>
                  <div className="grid gap-4">
                    {mainLinks.map((item, index) => {
                      const isActive = pathname === item.path;
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.path}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate={isOpen ? "visible" : "hidden"}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <button
                            onClick={() => handleNavigation(item.path)}
                            className={cn(
                              "w-full p-4 rounded-xl border-2 text-left transition-all",
                              isActive 
                                ? "border-primary bg-primary/5" 
                                : "border-border/50 bg-background/95 hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5" />
                              <Text className="font-medium">{item.label}</Text>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {hasCompletedSetup && plannedGifts.length > 0 && (
                  <div className="space-y-6">
                    <Text className="text-lg font-medium flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      To Buy
                    </Text>
                    <div className="grid gap-4">
                      {plannedGifts.map((gift, index) => (
                        <motion.div
                          key={gift.id}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate={isOpen ? "visible" : "hidden"}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="p-4 rounded-xl border-2 border-border/50 bg-background/95"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <Text className="font-medium">{gift.name}</Text>
                              <Text className="text-sm text-foreground/60">${gift.cost.toFixed(2)}</Text>
                            </div>
                            {gift.priority && (
                              <span className={cn(
                                "px-3 py-1 rounded-full text-sm",
                                gift.priority === 1 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                                gift.priority === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" :
                                "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              )}>
                                Priority {gift.priority}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

    <div className="space-y-8">
      <Text className="text-lg font-medium">Settings</Text>
      <div className="space-y-6">
        <div className="p-4 rounded-xl border-2 border-border/50 bg-background/95 space-y-4">
          <Text className="font-medium">Theme</Text>
          <div className="grid grid-cols-3 gap-4">
            {themeOptions.map(({ label, value, icon: Icon }, index) => (
              <motion.button
                key={value}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => setTheme(value)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  theme === value
                    ? "border-primary bg-primary/5"
                    : "border-border/50 bg-background/95 hover:border-primary/50"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <Text className="text-sm font-medium">{label}</Text>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {hasCompletedSetup && (
          <div className="p-4 rounded-xl border-2 border-border/50 bg-background/95 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <Text className="font-medium">Data Management</Text>
            </div>
            <CSVImport onImport={handleImport} />
          </div>
        )}

        {budgetPrefs && (
                    <div className="p-4 rounded-xl border-2 border-border/50 bg-background/95 space-y-4">
                      <Text className="font-medium">Budget Preferences</Text>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Text className="text-sm text-foreground/60">Default Budget</Text>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <DollarSign className="h-5 w-5 text-primary/60" />
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={budgetPrefs.defaultBudget || ""}
                              onChange={(e) => updateBudgetPreferences({ defaultBudget: parseFloat(e.target.value) })}
                              placeholder="Enter default budget"
                              className={cn(
                                "pl-11 w-full h-12 rounded-xl",
                                "bg-background/95",
                                "border-2 border-border/50",
                                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                                "placeholder:text-foreground/40"
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Text className="text-sm text-foreground/60">Budget Tracking Level</Text>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { value: "group", label: "Group", description: "Track per group" },
                              { value: "member", label: "Member", description: "Track per person" },
                              { value: "both", label: "Combined", description: "Track both" }
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => updateBudgetPreferences({ trackingLevel: option.value as BudgetPreference["trackingLevel"] })}
                                className={cn(
                                  "p-4 rounded-xl border-2 text-left relative",
                                  budgetPrefs.trackingLevel === option.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 bg-background/95 hover:border-primary/50"
                                )}
                              >
                                <div className="space-y-1">
                                  <Text className="text-sm font-medium">{option.label}</Text>
                                  <Text className="text-xs text-foreground/60">{option.description}</Text>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => updateBudgetPreferences({ enableAnalytics: !budgetPrefs.enableAnalytics })}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 text-left",
                            budgetPrefs.enableAnalytics ? "border-primary bg-primary/5" : "border-border/50 bg-background/95 hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Text className="font-medium">Enable Analytics</Text>
                              <Text className="text-sm text-foreground/60">Get insights into your gift giving patterns</Text>
                            </div>
                            <div className={cn(
                              "w-12 h-7 rounded-full transition-colors",
                              budgetPrefs.enableAnalytics ? "bg-primary" : "bg-foreground/20"
                            )}>
                              <div className={cn(
                                "w-5 h-5 rounded-full bg-white transform transition-transform m-1",
                                budgetPrefs.enableAnalytics ? "translate-x-5" : "translate-x-0"
                              )} />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
        )}

        <div className="p-4 rounded-xl border-2 border-border/50 bg-background/95 space-y-4">
          <Text className="font-medium">Reset Application</Text>
          <Button
            variant="destructive"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Reset All Data
          </Button>
          <Text className="text-sm text-foreground/60">
            This will clear all your data and preferences, and return you to the setup screen.
          </Text>
        </div>
      </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>,
    document.body
  );
}
