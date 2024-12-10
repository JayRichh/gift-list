import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import { cn } from "~/utils/cn";

interface DropdownProps {
  trigger: React.ReactNode;
  items: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Dropdown({ trigger, items, value, onChange, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (itemValue: string) => {
    onChange?.(itemValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="py-1">
              {items.map((item) => (
                <motion.button
                  key={item.value}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  onClick={() => handleSelect(item.value)}
                  className={cn(
                    "w-full px-4 py-2 text-left flex items-center gap-2",
                    "transition-colors duration-200",
                    "hover:text-primary",
                    value === item.value && "text-primary font-medium"
                  )}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
