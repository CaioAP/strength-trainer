"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { ConfirmationModalProps } from "./ConfirmationModal.types";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
  children,
}: ConfirmationModalProps): React.JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const modal = document.getElementById("confirmation-modal");
    const firstButton = modal?.querySelector<HTMLElement>("button:not([disabled])");
    firstButton?.focus();

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const modal = document.getElementById("confirmation-modal");
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <Card variant="modal" padding="lg" className="w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <h3 id="modal-title" className="text-xl font-bold text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-text-subtle text-sm leading-relaxed mb-6">
          {message}
        </p>

        {children && (
          <div className="mb-8">
            {children}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            fullWidth
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
