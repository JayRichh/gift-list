"use client";

import { Suspense } from "react";

import Link from "next/link";

import { ExampleContainer } from "~/components/ExampleSection";
import { Card, CardContent } from "~/components/ui/Card";
import { WaterText } from "~/components/ui/WaterText";

interface Category {
  id: string;
  label: string;
  description: string;
  examples: string[];
}

const categories: Category[] = [
  {
    id: "ui",
    label: "UI Components",
    description:
      "Core UI components and interactive elements including buttons, tooltips, progress indicators, and more.",
    examples: ["Button", "Tooltip", "Progress", "Form", "Modal", "Card"],
  },
  {
    id: "3d",
    label: "3D Graphics",
    description:
      "Three.js powered 3D scenes and interactions with customizable properties and controls.",
    examples: ["Physical Materials", "Interactive Controls", "Geometry Morphing", "Physics"],
  },
  {
    id: "nextjs",
    label: "Next.js Features",
    description:
      "Examples showcasing Next.js capabilities including API routes, dynamic routing, and server components.",
    examples: ["API Routes", "Dynamic Routing", "Server Components", "Middleware"],
  },
  {
    id: "data",
    label: "Data & Forms",
    description:
      "Form handling, data management, and state persistence examples with validation and local storage.",
    examples: ["Form Validation", "Data Selection", "Local Storage", "Custom Hooks"],
  },
  {
    id: "theme",
    label: "Theming",
    description:
      "Theme customization examples including dark mode, color system, and gradient utilities.",
    examples: ["Dark Mode", "Color System", "Gradients", "CSS Variables"],
  },
];

function ExamplesContent() {
  return (
    <ExampleContainer
      _category="overview"
      title="Examples Overview"
      description="Browse through our collection of examples showcasing various features and components."
    >
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <nav className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Example categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/examples/${category.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg group"
            >
              <Card className="h-full hover:border-primary/50 transition-colors duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-wide">
                      <WaterText
                        text={category.label}
                        className="group-hover:opacity-80 cursor-pointer"
                        maxDistance={50}
                        decaySpeed={0.02}
                      />
                    </h2>
                    <p className="text-foreground-secondary text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <p className="font-medium text-xs uppercase tracking-wider text-foreground-secondary/70">
                      Includes examples of:
                    </p>
                    <ul
                      className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-foreground-secondary"
                      aria-label={`Examples in ${category.label}`}
                    >
                      {category.examples.map((example) => (
                        <li key={example} className="flex items-center">
                          <span className="w-1 h-1 rounded-full bg-foreground-secondary/50 mr-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </nav>
      </div>
    </ExampleContainer>
  );
}

export default function ExamplesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamplesContent />
    </Suspense>
  );
}
