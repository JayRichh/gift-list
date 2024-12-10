"use client";

import { Box, CircleIcon, Trash } from "lucide-react";

import { useCallback, useState } from "react";

import { Button } from "~/components/ui/Button";

import { PhysicsScene } from "../scenes/PhysicsScene";

export function PhysicsExample() {
  const [scene, setScene] = useState<PhysicsScene | null>(null);

  const handleSceneReady = useCallback((container: HTMLDivElement) => {
    const newScene = new PhysicsScene(container);
    setScene(newScene);
    return () => newScene.dispose();
  }, []);

  const addSphere = () => {
    scene?.addObject("sphere", {
      x: (Math.random() - 0.5) * 3,
      y: 5,
      z: (Math.random() - 0.5) * 3,
    });
  };

  const addCube = () => {
    scene?.addObject("box", {
      x: (Math.random() - 0.5) * 3,
      y: 5,
      z: (Math.random() - 0.5) * 3,
    });
  };

  const clearObjects = () => {
    scene?.clearObjects();
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      {/* Scene Container */}
      <div className="relative flex-1 min-h-[400px] bg-background rounded-lg shadow-sm overflow-hidden">
        <div ref={handleSceneReady} className="absolute inset-0" />
      </div>

      {/* Controls */}
      <div className="mt-8 p-4 bg-background rounded-lg shadow-sm">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
          <Button onClick={addSphere} className="w-full">
            <CircleIcon className="h-4 w-4 mr-2" />
            Add Sphere
          </Button>
          <Button onClick={addCube} className="w-full">
            <Box className="h-4 w-4 mr-2" />
            Add Cube
          </Button>
          <Button variant="secondary" onClick={clearObjects}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
