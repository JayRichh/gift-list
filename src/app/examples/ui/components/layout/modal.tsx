"use client";

import { useState } from "react";

import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";

import { ComponentExample } from "../types";

export const modalCode = `import { Modal } from '~/components/ui/Modal';
import { Button } from '~/components/ui/Button';

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
        <div className="space-y-4">
          <p>Modal content goes here</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}`;

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
        <div className="space-y-4">
          <p>Modal content goes here</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export const modalMeta: ComponentExample = {
  id: "modal",
  title: "Modal Dialogs",
  description: "Overlay dialogs and popups",
  code: modalCode,
  component: <ModalExample />,
};
