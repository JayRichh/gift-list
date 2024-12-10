import { dataDisplayComponents } from "./data-display";
import { effectsComponents } from "./effects";
import { feedbackComponents } from "./feedback";
import { inputComponents } from "./inputs";
import { layoutComponents } from "./layout";
import { overlayComponents } from "./overlay";
import { ComponentCategory, ComponentExample } from "./types";

export * from "./inputs";
export * from "./feedback";
export * from "./layout";
export * from "./data-display";
export * from "./overlay";
export * from "./effects";

export const allExamples: ComponentExample[] = [
  ...inputComponents,
  ...feedbackComponents,
  ...layoutComponents,
  ...dataDisplayComponents,
  ...overlayComponents,
  ...effectsComponents,
];

export const componentCategories: ComponentCategory[] = [
  {
    id: "inputs",
    title: "Inputs",
    description:
      "Form controls and input components for user interaction. Includes text inputs, buttons, selects, and other form elements.",
    components: inputComponents,
    meta: {
      core: true,
      complexity: "basic",
      related: ["feedback", "overlay"],
    },
  },
  {
    id: "feedback",
    title: "Feedback",
    description:
      "Components that provide visual feedback to users, including loading states, progress indicators, and notifications.",
    components: feedbackComponents,
    meta: {
      core: true,
      complexity: "intermediate",
      related: ["overlay"],
    },
  },
  {
    id: "layout",
    title: "Layout",
    description:
      "Structural components for organizing content and creating consistent page layouts. Includes containers, grids, and spacing utilities.",
    components: layoutComponents,
    meta: {
      core: true,
      complexity: "basic",
      related: ["data-display"],
    },
  },
  {
    id: "data-display",
    title: "Data Display",
    description:
      "Components for presenting data and content in various formats. Includes cards, tables, lists, and typography elements.",
    components: dataDisplayComponents,
    meta: {
      core: true,
      complexity: "intermediate",
      related: ["layout"],
    },
  },
  {
    id: "overlay",
    title: "Overlay",
    description:
      "Components that appear above the main content layer. Includes modals, dropdowns, tooltips, and other floating elements.",
    components: overlayComponents,
    meta: {
      core: false,
      complexity: "advanced",
      related: ["feedback"],
    },
  },
  {
    id: "effects",
    title: "Effects",
    description:
      "Visual effects and animations to enhance the user experience. Includes transitions, animations, and decorative elements.",
    components: effectsComponents,
    meta: {
      core: false,
      complexity: "advanced",
      related: ["feedback"],
    },
  },
];

/**
 * Get related examples for a given category
 */
export function getRelatedExamples(categoryId: string): ComponentExample[] {
  const category = componentCategories.find((c) => c.id === categoryId);
  if (!category?.meta?.related) return [];

  return category.meta.related.flatMap((relatedId) => {
    const relatedCategory = componentCategories.find((c) => c.id === relatedId);
    return relatedCategory?.components || [];
  });
}

/**
 * Get examples by complexity level
 */
export function getExamplesByComplexity(
  complexity: "basic" | "intermediate" | "advanced"
): ComponentCategory[] {
  return componentCategories.filter((category) => category.meta?.complexity === complexity);
}

/**
 * Get core component categories
 */
export function getCoreCategories(): ComponentCategory[] {
  return componentCategories.filter((category) => category.meta?.core === true);
}
