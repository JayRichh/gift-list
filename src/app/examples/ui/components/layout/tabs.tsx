"use client";

import { TabGroup } from "~/components/ui/TabGroup";

import { ComponentExample } from "../types";

export const tabsCode = `import { TabGroup } from '~/components/ui/TabGroup';

export function TabExample() {
  return (
    <TabGroup
      tabs={[
        { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
        { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
      ]}
    />
  );
}`;

export function TabExample() {
  return (
    <TabGroup
      tabs={[
        { id: "tab1", label: "Tab 1", content: "Content 1" },
        { id: "tab2", label: "Tab 2", content: "Content 2" },
        { id: "tab3", label: "Tab 3", content: "Content 3" },
      ]}
    />
  );
}

export const tabsMeta: ComponentExample = {
  id: "tabs",
  title: "Tab Groups",
  description: "Tabbed content navigation",
  code: tabsCode,
  component: <TabExample />,
};
