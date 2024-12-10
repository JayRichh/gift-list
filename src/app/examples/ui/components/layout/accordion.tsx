"use client";

import { Accordion } from "~/components/ui/Accordion";

import { ComponentExample } from "../types";

export const accordionCode = `import { Accordion } from '~/components/ui/Accordion';

export function AccordionExample() {
  const items = [
    {
      id: '1',
      title: 'Section 1',
      content: 'Content for section 1'
    },
    {
      id: '2',
      title: 'Section 2',
      content: 'Content for section 2'
    }
  ];

  return <Accordion items={items} />;
}`;

export function AccordionExample() {
  const items = [
    {
      id: "1",
      title: "Section 1",
      content: "Content for section 1",
    },
    {
      id: "2",
      title: "Section 2",
      content: "Content for section 2",
    },
  ];

  return <Accordion items={items} />;
}

export const accordionMeta: ComponentExample = {
  id: "accordion",
  title: "Accordion",
  description: "Collapsible content sections",
  code: accordionCode,
  component: <AccordionExample />,
};
