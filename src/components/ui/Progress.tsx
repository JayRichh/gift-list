"use client";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import { cn } from "~/utils/cn";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animate?: boolean;
  variant?: "default" | "gradient" | "striped";
  className?: string;
}

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-4",
};

const variants = {
  default: "bg-blue-500",
  gradient: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
  striped: "progress-striped bg-blue-500",
};

export function Progress({
  value,
  max = 100,
  size = "md",
  showValue = false,
  animate = true,
  variant = "default",
  className,
}: ProgressProps) {
  const [mounted, setMounted] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    setMounted(true);
    setCurrentValue(value);
  }, [value]);

  if (!mounted) {
    return null;
  }

  const percentage = Math.min(Math.max((currentValue / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          "bg-slate-200 dark:bg-slate-800",
          "ring-1 ring-inset ring-slate-900/5 dark:ring-slate-100/10",
          sizeStyles[size]
        )}
      >
        <motion.div
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("absolute inset-y-0 left-0 flex items-center", variants[variant], {
            "animate-[progress-stripe_1s_linear_infinite]": variant === "striped",
            "shadow-[0_0_12px_rgba(59,130,246,0.5)] dark:shadow-[0_0_12px_rgba(59,130,246,0.3)]":
              variant === "default",
            "shadow-[0_0_12px_rgba(99,102,241,0.5)] dark:shadow-[0_0_12px_rgba(99,102,241,0.3)]":
              variant === "gradient",
          })}
        >
          {variant === "striped" && (
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripe_1s_linear_infinite]" />
          )}
        </motion.div>
      </div>
      {showValue && (
        <div className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// Example usage:
export function ProgressDemo() {
  const [progress, setProgress] = useState(36);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p + 1) % 101);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Default Progress */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Default Progress
        </div>
        <Progress value={progress} showValue />
      </div>

      {/* Gradient Progress */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Gradient Progress
        </div>
        <Progress value={progress} variant="gradient" size="lg" showValue />
      </div>

      {/* Striped Progress */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Striped Progress
        </div>
        <Progress value={progress} variant="striped" size="lg" showValue />
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Different Sizes
        </div>
        <Progress value={75} size="sm" />
        <Progress value={75} size="md" />
        <Progress value={75} size="lg" />
      </div>
    </div>
  );
}

// Code preview
export const progressCode = `// Progress Component Usage
// Basic usage with default style
<Progress value={75} />

// Gradient variant with percentage
<Progress 
  value={75}
  variant="gradient"
  size="lg"
  showValue 
/>

// Animated striped variant
<Progress 
  value={75}
  variant="striped"
  animate
  showValue 
/>

// Different sizes
<Progress value={75} size="sm" />
<Progress value={75} size="md" />
<Progress value={75} size="lg" />`;

// Add keyframes for striped animation to your global CSS:
// @keyframes progress-stripe {
//   from { background-position: 1rem 0; }
//   to { background-position: 0 0; }
// }
