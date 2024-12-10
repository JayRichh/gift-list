"use client";

import { useCallback, useState } from "react";

import { Button } from "~/components/ui/Button";

import { MorphScene } from "../scenes/MorphScene";

const shapes = [
  { id: "sphere", label: "Sphere" },
  { id: "cube", label: "Cube" },
] as const;

export function MorphExample() {
  const [scene, setScene] = useState<MorphScene | null>(null);
  const [currentShape, setCurrentShape] = useState<(typeof shapes)[number]["id"]>("sphere");

  const handleSceneReady = useCallback((container: HTMLDivElement) => {
    const newScene = new MorphScene(container);
    setScene(newScene);
    return () => newScene.dispose();
  }, []);

  const handleShapeChange = (shape: (typeof shapes)[number]["id"]) => {
    if (shape === currentShape) return;
    setCurrentShape(shape);
    scene?.morphTo(shape);
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      {/* Scene Container */}
      <div className="relative flex-1 min-h-[400px] bg-background rounded-lg shadow-sm overflow-hidden">
        <div ref={handleSceneReady} className="absolute inset-0" />
      </div>

      {/* Controls */}
      <div className="mt-8 p-4 bg-background rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          {shapes.map(({ id, label }) => (
            <Button
              key={id}
              variant={currentShape === id ? "primary" : "secondary"}
              onClick={() => handleShapeChange(id)}
              className="w-full"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
