"use client";

import React from "react";
import { X } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  children?: React.ReactNode;
}

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
  children
}: ConfirmationModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card variant="modal" padding="lg" className="w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
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
