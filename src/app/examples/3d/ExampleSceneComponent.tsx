"use client";

import { useEffect, useRef } from "react";

import { ExampleScene } from "./ExampleScene";

interface ExampleSceneComponentProps {
  onSceneReady?: (scene: ExampleScene) => void;
  className?: string;
  id?: string;
}

export function ExampleSceneComponent({ onSceneReady, className, id }: ExampleSceneComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ExampleScene | null>(null);

  useEffect(() => {
    if (containerRef.current && !sceneRef.current) {
      sceneRef.current = new ExampleScene(containerRef.current);
      if (onSceneReady) {
        onSceneReady(sceneRef.current);
      }
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, [onSceneReady]);

  return <div ref={containerRef} id={id} className={className} />;
}
