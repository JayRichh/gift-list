"use client";

import { useEffect, useRef } from "react";

import { ThreeScene } from "./ThreeScene";

interface ThreeClientProps {
  color?: string;
  rotation?: number;
  wireframe?: boolean;
  className?: string;
}

export default function ThreeClient({
  color = "#4338ca",
  rotation = 0,
  wireframe = false,
  className,
}: ThreeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    sceneRef.current = new ThreeScene(containerRef.current);

    // Cleanup
    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, []);

  // Handle prop updates
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.setMainMeshMaterial("color", color);
  }, [color]);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.setRotationSpeed(rotation);
  }, [rotation]);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.setMainMeshMaterial("metalness", wireframe ? 1 : 0.2);
  }, [wireframe]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    />
  );
}
