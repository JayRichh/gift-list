"use client";

import { useEffect, useState } from "react";

import { Progress } from "~/components/ui/Progress";

import { ComponentExample } from "../types";

export const progressCode = `import { Progress } from '~/components/ui/Progress';

export function ProgressExample() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p + 1) % 101);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Default Progress */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Default</div>
        <Progress value={progress} showValue />
      </div>

      {/* Gradient Progress */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Gradient</div>
        <Progress value={progress} variant="gradient" showValue />
      </div>

      {/* Striped Progress */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Striped</div>
        <Progress value={progress} variant="striped" showValue />
      </div>
    </div>
  );
}`;

export function ProgressExample() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p + 1) % 101);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Default Progress */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Default</div>
        <Progress value={progress} showValue />
      </div>

      {/* Gradient Progress */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Gradient</div>
        <Progress value={progress} variant="gradient" showValue />
      </div>

      {/* Striped Progress */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Striped</div>
        <Progress value={progress} variant="striped" showValue />
      </div>
    </div>
  );
}

export const progressMeta: ComponentExample = {
  id: "progress",
  title: "Progress Indicators",
  description: "Loading and progress states",
  code: progressCode,
  component: <ProgressExample />,
};
