"use client";

import { Skeleton } from "~/components/ui/Skeleton";

import { ComponentExample } from "../types";

export const skeletonCode = `import { Skeleton } from '~/components/ui/Skeleton';

export function SkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  );
}`;

export function SkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  );
}

export const skeletonMeta: ComponentExample = {
  id: "skeleton",
  title: "Loading Skeletons",
  description: "Content loading placeholders",
  code: skeletonCode,
  component: <SkeletonExample />,
};
