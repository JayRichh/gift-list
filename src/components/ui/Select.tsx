import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import { cn } from "~/utils/cn";

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  clearable = false,
  disabled = false,
  className,
  label,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (isOpen && filteredOptions[highlightedIndex]) {
          onChange?.(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((i) => (i < filteredOptions.length - 1 ? i + 1 : i));
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((i) => (i > 0 ? i - 1 : i));
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "relative w-full px-4 py-2 rounded-lg",
          "bg-background/50 backdrop-blur-sm",
          "border-2 border-border/50",
          "cursor-pointer select-none",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500/50 focus:ring-red-500/50"
        )}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between gap-2">
          {searchable && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder={placeholder}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <span className={cn(selectedOption ? "text-foreground" : "text-foreground/50")}>
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  {selectedOption.icon}
                  {selectedOption.label}
                </div>
              ) : (
                placeholder
              )}
            </span>
          )}

          <div className="flex items-center gap-2">
            {clearable && selectedOption && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.("");
                }}
                className="text-foreground/50 hover:text-foreground"
              >
                ✕
              </button>
            )}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              ▼
            </motion.div>
          </div>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 w-full mt-2",
              "bg-background/95 backdrop-blur-sm",
              "border-2 border-border/50 rounded-lg shadow-lg",
              "max-h-60 overflow-auto"
            )}
            ref={listRef}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-foreground/50">No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2 cursor-pointer",
                    "transition-colors duration-200",
                    index === highlightedIndex && "bg-primary/10",
                    option.value === value && "text-primary"
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-foreground/60">{option.description}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Example usage:
export function SelectDemo() {
  const [country, setCountry] = useState("");
  const [searchableValue, setSearchableValue] = useState("");

  const countries = [
    { value: "us", label: "United States", icon: "🇺🇸" },
    { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
    { value: "fr", label: "France", icon: "🇫🇷" },
    { value: "de", label: "Germany", icon: "🇩🇪" },
    { value: "jp", label: "Japan", icon: "🇯🇵" },
  ];

  const frameworks = [
    {
      value: "next",
      label: "Next.js",
      description: "React framework for production",
    },
    {
      value: "react",
      label: "React",
      description: "JavaScript library for user interfaces",
    },
    {
      value: "vue",
      label: "Vue",
      description: "Progressive JavaScript framework",
    },
  ];

  return (
    <div className="space-y-8 p-4">
      <Select
        label="Select Country"
        options={countries}
        value={country}
        onChange={setCountry}
        clearable
      />

      <Select
        label="Framework"
        options={frameworks}
        value={searchableValue}
        onChange={setSearchableValue}
        searchable
        placeholder="Search frameworks..."
      />

      <Select
        label="Disabled Select"
        options={countries}
        value={country}
        onChange={setCountry}
        disabled
      />
    </div>
  );
}

// Code preview
export const selectCode = `// Select Component Usage
const [value, setValue] = useState('');

const options = [
  { 
    value: 'next', 
    label: 'Next.js',
    icon: '⚡',
    description: 'React framework for production'
  }
];

// Basic usage
<Select
  options={options}
  value={value}
  onChange={setValue}
/>

// Searchable with clear button
<Select
  options={options}
  value={value}
  onChange={setValue}
  searchable
  clearable
  placeholder="Search options..."
/>

// With label and error
<Select
  label="Framework"
  options={options}
  value={value}
  onChange={setValue}
  error="Please select a framework"
/>`;
