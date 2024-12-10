"use client";

import { useCallback, useState } from "react";

import { Slider } from "~/components/ui/Slider";

import { MaterialScene } from "../scenes/MaterialScene";

export function MaterialExample() {
  const [scene, setScene] = useState<MaterialScene | null>(null);
  const [properties, setProperties] = useState({
    metalness: 0.2,
    roughness: 0.1,
    clearcoat: 0.8,
    transmission: 0,
    ior: 1.5,
  });

  const handleSceneReady = useCallback((container: HTMLDivElement) => {
    const newScene = new MaterialScene(container);
    setScene(newScene);
    return () => newScene.dispose();
  }, []);

  const handlePropertyChange = (property: keyof typeof properties) => (value: number) => {
    setProperties((prev) => ({ ...prev, [property]: value }));
    scene?.setMaterialProperty(property, value);
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
              <span>Metalness</span>
              <span>{properties.metalness.toFixed(2)}</span>
            </div>
            <Slider
              value={properties.metalness}
              onChange={handlePropertyChange("metalness")}
              min={0}
              max={1}
              step={0.01}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Roughness</span>
              <span>{properties.roughness.toFixed(2)}</span>
            </div>
            <Slider
              value={properties.roughness}
              onChange={handlePropertyChange("roughness")}
              min={0}
              max={1}
              step={0.01}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Clearcoat</span>
              <span>{properties.clearcoat.toFixed(2)}</span>
            </div>
            <Slider
              value={properties.clearcoat}
              onChange={handlePropertyChange("clearcoat")}
              min={0}
              max={1}
              step={0.01}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Transmission</span>
              <span>{properties.transmission.toFixed(2)}</span>
            </div>
            <Slider
              value={properties.transmission}
              onChange={handlePropertyChange("transmission")}
              min={0}
              max={1}
              step={0.01}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>IOR</span>
              <span>{properties.ior.toFixed(2)}</span>
            </div>
            <Slider
              value={properties.ior}
              onChange={handlePropertyChange("ior")}
              min={1}
              max={2.33}
              step={0.01}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
