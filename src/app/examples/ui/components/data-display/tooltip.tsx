"use client";

import { Button } from "~/components/ui/Button";
import { Tooltip } from "~/components/ui/Tooltip";

import { ComponentExample } from "../types";

export const tooltipCode = `import { Tooltip } from '~/components/ui/Tooltip';
import { Button } from '~/components/ui/Button';

export function TooltipExample() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-8">
        <Tooltip content="Top tooltip" position="top">
          <Button variant="outline">Top</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" position="right">
          <Button variant="outline">Right</Button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-8">
        <Tooltip content="Bottom tooltip" position="bottom">
          <Button variant="outline">Bottom</Button>
        </Tooltip>
        <Tooltip content="Left tooltip" position="left">
          <Button variant="outline">Left</Button>
        </Tooltip>
      </div>
    </div>
  );
}`;

export function TooltipExample() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-8">
        <Tooltip content="Top tooltip" position="top">
          <Button variant="outline">Top</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" position="right">
          <Button variant="outline">Right</Button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-8">
        <Tooltip content="Bottom tooltip" position="bottom">
          <Button variant="outline">Bottom</Button>
        </Tooltip>
        <Tooltip content="Left tooltip" position="left">
          <Button variant="outline">Left</Button>
        </Tooltip>
      </div>
    </div>
  );
}

export const tooltipMeta: ComponentExample = {
  id: "tooltip",
  title: "Tooltip",
  description: "Hover information tooltips that appear in different positions around elements",
  code: tooltipCode,
  component: <TooltipExample />,
};
