"use client";

import { Badge } from "~/components/ui/Badge";

import { ComponentExample } from "../types";

export const badgeCode = `import { Badge } from '~/components/ui/Badge';

export function BadgeExample() {
  return (
    <div className="flex gap-4">
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="solid" color="primary">Primary</Badge>
      <Badge variant="solid" color="success">Success</Badge>
      <Badge variant="solid" color="error">Error</Badge>
    </div>
  );
}`;

export function BadgeExample() {
  return (
    <div className="flex gap-4">
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="solid" color="primary">
        Primary
      </Badge>
      <Badge variant="solid" color="success">
        Success
      </Badge>
      <Badge variant="solid" color="error">
        Error
      </Badge>
    </div>
  );
}

export const badgeMeta: ComponentExample = {
  id: "badge",
  title: "Badge",
  description: "Status indicators and labels",
  code: badgeCode,
  component: <BadgeExample />,
};
