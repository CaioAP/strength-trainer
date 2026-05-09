import React from "react";
import { X } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { Button } from "./Button";
import { Text } from "./Text";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

/**
 * Modal to display exercise tutorial videos.
 */
export const VideoModal = ({
  isOpen,
  onClose,
  videoUrl,
  title,
}: VideoModalProps): React.JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-secondary/95 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-brand-surface rounded-xl shadow-elevated border border-white/5 overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="p-4 flex items-center justify-between border-b border-white/5">
          <div>
            <Text size="xs" weight="bold" variant="primary" uppercase tracking="widest">Tutorial</Text>
            <Text weight="bold" size="lg" className="truncate">{title}</Text>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full p-2 text-text-subtle hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </header>

        <div className="p-1 sm:p-4">
          <VideoPlayer url={videoUrl} />
        </div>

        <footer className="p-4 bg-brand-secondary/50 flex justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
};
