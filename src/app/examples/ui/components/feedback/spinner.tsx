"use client";

import { Spinner } from "~/components/ui/Spinner";

import { ComponentExample } from "../types";

export const spinnerCode = `import { Spinner } from '~/components/ui/Spinner';

export function SpinnerExample() {
  return (
    <div className="w-full space-y-8">
      {/* Different sizes */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Sizes</div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-sm text-muted-foreground">Large</span>
          </div>
        </div>
      </div>

      {/* Different variants */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Variants</div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="default" />
            <span className="text-sm text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="primary" />
            <span className="text-sm text-muted-foreground">Primary</span>
          </div>
        </div>
      </div>

      {/* Common use cases */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Common Use Cases</div>
        <div className="flex flex-wrap gap-8">
          {/* Loading text */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background">
            <Spinner size="sm" />
            <span>Loading...</span>
          </div>

          {/* Button loading state */}
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            disabled
          >
            <Spinner size="sm" />
            <span>Processing</span>
          </button>

          {/* Card loading state */}
          <div className="flex items-center justify-center w-32 h-32 rounded-lg border">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
}`;

export function SpinnerExample() {
  return (
    <div className="w-full space-y-8">
      {/* Different sizes */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Sizes</div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-sm text-muted-foreground">Large</span>
          </div>
        </div>
      </div>

      {/* Different variants */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Variants</div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="default" />
            <span className="text-sm text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="primary" />
            <span className="text-sm text-muted-foreground">Primary</span>
          </div>
        </div>
      </div>

      {/* Common use cases */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Common Use Cases</div>
        <div className="flex flex-wrap gap-8">
          {/* Loading text */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background">
            <Spinner size="sm" />
            <span>Loading...</span>
          </div>

          {/* Button loading state */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            disabled
          >
            <Spinner size="sm" />
            <span>Processing</span>
          </button>

          {/* Card loading state */}
          <div className="flex items-center justify-center w-32 h-32 rounded-lg border">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
}

export const spinnerMeta: ComponentExample = {
  id: "spinner",
  title: "Spinner",
  description: "Loading spinner indicators for various states",
  code: spinnerCode,
  component: <SpinnerExample />,
};
