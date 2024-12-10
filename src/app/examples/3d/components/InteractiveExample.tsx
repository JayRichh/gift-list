"use client";

import { useCallback, useState } from "react";

import { Slider } from "~/components/ui/Slider";

import { InteractiveScene } from "../scenes/InteractiveScene";

export function InteractiveExample() {
  const [scene, setScene] = useState<InteractiveScene | null>(null);
  const [lightPosition, setLightPosition] = useState({
    x: 5,
    y: 5,
    z: 5,
  });

  const handleSceneReady = useCallback((container: HTMLDivElement) => {
    const newScene = new InteractiveScene(container);
    setScene(newScene);
    return () => newScene.dispose();
  }, []);

  const handleLightPositionChange = (axis: "x" | "y" | "z") => (value: number) => {
    setLightPosition((prev) => {
      const newPosition = { ...prev, [axis]: value };
      scene?.setLightPosition(newPosition.x, newPosition.y, newPosition.z);
      return newPosition;
    });
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      {/* Scene Container */}
      <div className="relative flex-1 min-h-[400px] bg-background rounded-lg shadow-sm overflow-hidden">
        <div ref={handleSceneReady} className="absolute inset-0" />
      </div>

      {/* Controls */}
      <div className="mt-8 p-4 bg-background rounded-lg shadow-sm">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Light X Position</span>
              <span>{lightPosition.x.toFixed(1)}</span>
            </div>
            <Slider
              value={lightPosition.x}
              onChange={handleLightPositionChange("x")}
              min={-10}
              max={10}
              step={0.1}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Light Y Position</span>
              <span>{lightPosition.y.toFixed(1)}</span>
            </div>
            <Slider
              value={lightPosition.y}
              onChange={handleLightPositionChange("y")}
              min={-10}
              max={10}
              step={0.1}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Light Z Position</span>
              <span>{lightPosition.z.toFixed(1)}</span>
            </div>
            <Slider
              value={lightPosition.z}
              onChange={handleLightPositionChange("z")}
              min={-10}
              max={10}
              step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
