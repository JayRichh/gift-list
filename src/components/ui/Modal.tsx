import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useState } from "react";

import { cn } from "~/utils/cn";

import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div
              className={cn(
                "bg-background/95 backdrop-blur-md",
                "rounded-xl shadow-xl border-2 border-border/50",
                "w-full max-w-lg p-6",
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <button
                    onClick={onClose}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Example usage:
export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Modal">
        <div className="space-y-4">
          <p className="text-foreground/80">
            This is an example modal with a backdrop blur effect and smooth animations. Press ESC or
            click outside to close.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Code preview
export const modalCode = `// Modal Component Usage
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Open Modal
</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Example Modal"
>
  <div className="space-y-4">
    <p>Modal content goes here...</p>
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setIsOpen(false)}>
        Confirm
      </Button>
    </div>
  </div>
</Modal>`;
