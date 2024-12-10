"use client";

import { Select } from "~/components/ui/Select";

import { ComponentExample } from "../types";

export const selectCode = `import { Select } from '~/components/ui/Select';

export function SelectExample() {
  return (
    <Select
      options={[
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ]}
      placeholder="Select an option"
    />
  );
}`;

export function SelectExample() {
  return (
    <Select
      options={[
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
      ]}
      placeholder="Select an option"
    />
  );
}

export const selectMeta: ComponentExample = {
  id: "select",
  title: "Select Menus",
  description: "Dropdown selection inputs",
  code: selectCode,
  component: <SelectExample />,
};
