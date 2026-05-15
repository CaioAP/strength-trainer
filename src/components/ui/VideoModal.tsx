import React from "react";
import { createPortal } from "react-dom";
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

export const VideoModal = ({
  isOpen,
  onClose,
  videoUrl,
  title,
}: VideoModalProps): React.JSX.Element | null => {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-500 flex flex-col bg-brand-secondary animate-in fade-in duration-200">
      <header className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
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

      <div className="flex-1 overflow-hidden">
        <VideoPlayer url={videoUrl} />
      </div>
    </div>,
    document.body
  );
};
