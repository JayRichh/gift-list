"use client";

import { Form } from "~/components/ui/Form";

import { ComponentExample } from "../types";

export const formCode = `import { Form } from '~/components/ui/Form';

export function FormExample() {
  return (
    <Form />
  );
}`;

export function FormExample() {
  return <Form />;
}

export const formMeta: ComponentExample = {
  id: "form",
  title: "Form",
  description: "Form with validation and error handling",
  code: formCode,
  component: <FormExample />,
};
