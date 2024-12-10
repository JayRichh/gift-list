"use client";

import { useState } from "react";

import { Slider } from "~/components/ui/Slider";

import { ComponentExample } from "../types";

export const sliderCode = `import { Slider } from '~/components/ui/Slider';

export function SliderExample() {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);

  return (
    <div className="space-y-8">
      <Slider
        label="Volume"
        value={volume}
        onChange={setVolume}
        min={0}
        max={100}
        step={1}
      />

      <Slider
        label="Brightness"
        value={brightness}
        onChange={setBrightness}
        min={0}
        max={100}
        step={5}
        showValue
      />
    </div>
  );
}`;

export function SliderExample() {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);

  return (
    <div className="space-y-8">
      <Slider label="Volume" value={volume} onChange={setVolume} min={0} max={100} step={1} />

      <Slider
        label="Brightness"
        value={brightness}
        onChange={setBrightness}
        min={0}
        max={100}
        step={5}
        showValue
      />
    </div>
  );
}

export const sliderMeta: ComponentExample = {
  id: "slider",
  title: "Slider",
  description: "Interactive range input control with customizable appearance and behavior.",
  code: sliderCode,
  component: <SliderExample />,
};
