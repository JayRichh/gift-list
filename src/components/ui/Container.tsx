"use client";

import { HTMLMotionProps, motion } from "framer-motion";

import { ReactNode, forwardRef } from "react";

interface ContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "ultra";
  centered?: boolean;
  glass?: boolean;
  glassDark?: boolean;
  noPadding?: boolean;
  className?: string;
  innerClassName?: string;
  maxWidth?: boolean;
  gutter?: boolean;
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  ultra: "max-w-ultra",
  full: "max-w-full",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "lg",
      centered = true,
      glass = false,
      glassDark = false,
      noPadding = false,
      className = "",
      innerClassName = "",
      maxWidth = true,
      gutter = true,
      children,
      ...props
    },
    ref
  ) => {
    // Animation variants for container
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };

    // Base container styles
    const containerStyles = `
      relative
      w-full
      ${maxWidth ? containerSizes[size] : ""}
      ${gutter ? "px-4 sm:px-6 lg:px-8" : ""}
      ${centered ? "mx-auto" : ""}
      ${className}
    `;

    // Glass effect styles
    const glassStyles = `
      ${glass ? "glass" : ""}
      ${glassDark ? "dark:glass-dark" : ""}
      ${!noPadding ? "p-6 sm:p-8" : ""}
    `;

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={containerStyles}
        {...props}
      >
        {/* Optional glass effect wrapper */}
        {glass || glassDark ? (
          <div
            className={`
            rounded-xl
            backdrop-blur-sm
            ${glassStyles}
            ${innerClassName}
          `}
          >
            {/* Dynamic background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 dark:from-black/5 dark:to-black/0 rounded-xl" />

            {/* Content with relative positioning */}
            <div className="relative z-10">{children}</div>
          </div>
        ) : (
          // Regular content without glass effect
          <div className={innerClassName}>{children}</div>
        )}
      </motion.div>
    );
  }
);

Container.displayName = "Container";
