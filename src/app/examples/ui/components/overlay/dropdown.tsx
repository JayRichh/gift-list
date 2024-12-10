"use client";

import { Button } from "~/components/ui/Button";
import { Dropdown } from "~/components/ui/Dropdown";

import { ComponentExample } from "../types";

export const dropdownCode = `import { Dropdown } from '~/components/ui/Dropdown';
import { Button } from '~/components/ui/Button';

export function DropdownExample() {
  const items = [
    { value: '1', label: 'Item 1' },
    { value: '2', label: 'Item 2' },
    { value: '3', label: 'Item 3' }
  ];

  const handleChange = (_value: string) => {
    // Handle selection change
  };

  return (
    <Dropdown
      trigger={<Button>Open Menu</Button>}
      items={items}
      onChange={handleChange}
    />
  );
}`;

export function DropdownExample() {
  const items = [
    { value: "1", label: "Item 1" },
    { value: "2", label: "Item 2" },
    { value: "3", label: "Item 3" },
  ];

  const handleChange = (_value: string) => {
    // Handle selection change
  };

  return <Dropdown trigger={<Button>Open Menu</Button>} items={items} onChange={handleChange} />;
}

export const dropdownMeta: ComponentExample = {
  id: "dropdown",
  title: "Dropdown Menu",
  description: "Contextual menus and actions",
  code: dropdownCode,
  component: <DropdownExample />,
};
