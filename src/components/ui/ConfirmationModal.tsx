'use client';

import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
  children
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const confirmColors = variant === 'danger' 
    ? 'bg-status-error text-white hover:bg-status-error/90' 
    : 'bg-brand-primary text-black hover:opacity-90';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-brand-surface border border-gray-800 rounded-lg shadow-elevated overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="p-1 text-text-subtle hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-brand-secondary text-white font-bold rounded-md uppercase text-xs border border-gray-800 hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 ${confirmColors} font-bold rounded-md uppercase text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
