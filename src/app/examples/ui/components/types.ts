import { ReactNode } from "react";

export interface ComponentExample {
  /** Unique identifier for the example */
  id: string;
  /** Display title of the example */
  title: string;
  /** Detailed description of what the example demonstrates */
  description: string;
  /** Source code to be displayed in the code preview */
  code: string;
  /** Live component demonstration */
  component: ReactNode;
  /** Optional metadata about the component */
  meta?: {
    /** Whether the component is responsive */
    responsive?: boolean;
    /** Whether the component supports dark mode */
    darkMode?: boolean;
    /** Whether the component is accessible */
    accessible?: boolean;
    /** Additional features the component supports */
    features?: string[];
  };
}

export interface CategoryItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label for the item */
  label: string;
}

export interface ComponentCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display title of the category */
  title: string;
  /** Detailed description of the category and its components */
  description: string;
  /** List of component examples in this category */
  components: ComponentExample[];
  /** Optional subcategory items */
  items?: CategoryItem[];
  /** Optional metadata about the category */
  meta?: {
    /** Whether this is a core category */
    core?: boolean;
    /** Level of complexity */
    complexity?: "basic" | "intermediate" | "advanced";
    /** Related categories */
    related?: string[];
  };
}

/**
 * Type guard to check if a component example has metadata
 */
export function hasMetadata(
  example: ComponentExample
): example is ComponentExample & { meta: NonNullable<ComponentExample["meta"]> } {
  return example.meta !== undefined;
}
