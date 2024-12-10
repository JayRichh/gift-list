"use client";

import { useState } from "react";

import { Button } from "~/components/ui/Button";
import { Toast } from "~/components/ui/Toast";

import { ComponentExample } from "../types";

export const toastCode = `import { Toast } from '~/components/ui/Toast';
import { Button } from '~/components/ui/Button';

export function ToastExample() {
  const [isVisible, setIsVisible] = useState(false);
  const [toastType, setToastType] = useState('success');

  const showToast = (type) => {
    setToastType(type);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  };

  return (
    <div className="space-x-2">
      <Button onClick={() => showToast('success')}>Success</Button>
      <Button onClick={() => showToast('error')}>Error</Button>
      <Button onClick={() => showToast('info')}>Info</Button>
      <Button onClick={() => showToast('warning')}>Warning</Button>
      
      <Toast
        message={\`This is a \${toastType} message!\`}
        type={toastType}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
}`;

export function ToastExample() {
  const [isVisible, setIsVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("success");

  const showToast = (type: "success" | "error" | "info" | "warning") => {
    setToastType(type);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  };

  return (
    <div className="space-x-2">
      <Button onClick={() => showToast("success")}>Success</Button>
      <Button onClick={() => showToast("error")}>Error</Button>
      <Button onClick={() => showToast("info")}>Info</Button>
      <Button onClick={() => showToast("warning")}>Warning</Button>

      <Toast
        message={`This is a ${toastType} message!`}
        type={toastType}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
}

export const toastMeta: ComponentExample = {
  id: "toast",
  title: "Toast",
  description: "Notification messages with different types",
  code: toastCode,
  component: <ToastExample />,
};
