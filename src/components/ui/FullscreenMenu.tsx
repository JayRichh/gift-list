"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Users, PieChart, Settings, Sun, Moon, Monitor, DollarSign, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Select } from "./Select";
import type { BudgetPreference } from "~/types/gift-list";
import { usePlannedGifts } from "~/hooks/gift-list/usePlannedGifts";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainLinks = [
  { label: "Groups", path: "/groups", icon: Users },
  { label: "All Gifts", path: "/gifts", icon: Gift },
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

  React.useEffect(() => {
    setMounted(true);
    const storedPrefs = localStorage.getItem(STORAGE_KEYS.BUDGET_PREFERENCES);
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
    onClose();
    router.push('/');
  };

  if (!mounted) return null;

  const menuContent = (
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
          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4"
        >
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 sm:px-8">
            <motion.h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Menu
            </motion.h2>
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3"
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
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Navigation
                  </h3>
                  <div className="space-y-4">
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
                          whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        >
                          <button
                            onClick={() => handleNavigation(item.path)}
                            className={cn(
                              "flex items-center gap-3 text-lg font-medium transition-colors duration-300 w-full text-left",
                              isActive 
                                ? "text-blue-500 dark:text-blue-400" 
                                : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    To Buy
                  </h3>
                  <div className="space-y-4">
                    {!giftsLoading && plannedGifts.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No planned gifts yet
                      </p>
                    )}
                    {plannedGifts.map((gift, index) => (
                      <motion.div
                        key={gift.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate={isOpen ? "visible" : "hidden"}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {gift.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${gift.cost.toFixed(2)}
                            </p>
                          </div>
                          {gift.priority && (
                            <span className={cn(
                              "px-2 py-1 text-xs rounded-full",
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
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Settings
                  </h3>
                  <div className="space-y-8">
                    {/* Theme Settings */}
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Theme
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {themeOptions.map(({ label, value, icon: Icon }, index) => (
                          <motion.button
                            key={value}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate={isOpen ? "visible" : "hidden"}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setTheme(value)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200",
                              theme === value
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Settings */}
                    {budgetPrefs && (
                      <div>
                        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Budget Preferences
                        </h4>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Default Budget
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={budgetPrefs.defaultBudget || ""}
                                onChange={(e) => updateBudgetPreferences({ defaultBudget: parseFloat(e.target.value) })}
                                placeholder="Enter default budget"
                                className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Budget Tracking Level
                            </label>
                            <Select
                              value={budgetPrefs.trackingLevel}
                              onChange={(value) => updateBudgetPreferences({ trackingLevel: value as BudgetPreference["trackingLevel"] })}
                              options={[
                                { value: "group", label: "Track at Group Level" },
                                { value: "member", label: "Track at Member Level" },
                                { value: "both", label: "Track at Both Levels" },
                              ]}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={budgetPrefs.enableAnalytics}
                                onChange={(e) => updateBudgetPreferences({ enableAnalytics: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enable Analytics
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reset Button */}
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Reset Application
                      </h4>
                      <Button
                        variant="destructive"
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="h-5 w-5" />
                        Reset All Data
                      </Button>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        This will clear all your data and preferences, and return you to the setup screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  return createPortal(menuContent, document.body);
}
