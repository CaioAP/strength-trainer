"use client";

import React, { useRef, useState } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { Text } from "./Text";

interface VideoUploadProps {
  onFileSelected: (file: File | null) => void;
  currentUrl?: string | null;
  label?: string;
  disabled?: boolean;
}

export const VideoUpload = ({
  onFileSelected,
  currentUrl,
  label,
  disabled = false,
}: VideoUploadProps): React.JSX.Element => {
  const t = useTranslations("Common.VideoUpload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/mp4")) {
      setError(t("invalid_format"));
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError(t("size_exceeded"));
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelected(file);
  };

  const removeVideo = (): void => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onFileSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <Text size="xs" weight="bold" variant="subtle" uppercase tracking="widest" className="ml-1">
          {label}
        </Text>
      )}

      <div className={`relative border-2 border-dashed rounded-xl transition-all ${
        previewUrl ? "border-brand-primary/30 bg-brand-primary/5" : "border-white/10 bg-brand-secondary/30 hover:border-brand-primary/40"
      }`}>
        {previewUrl ? (
          <div className="p-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                <video src={previewUrl} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                  <Text size="xs" weight="bold" uppercase tracking="tight">Tutorial Ready</Text>
                </div>
                <Text size="xs" variant="subtle" className="truncate opacity-60">Exercise will show this video</Text>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeVideo}
              disabled={disabled}
              className="text-text-subtle hover:text-status-error"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full p-8 flex flex-col items-center justify-center gap-2 group/btn"
          >
            <div className="p-3 rounded-full bg-white/5 text-text-subtle group-hover/btn:bg-brand-primary/10 group-hover/btn:text-brand-primary transition-all">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <Text weight="bold" size="sm">Click to upload MP4</Text>
              <Text size="xs" variant="subtle">Tutorial video (Max 20MB)</Text>
            </div>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <Text size="xs" variant="error" weight="bold" className="ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </Text>
      )}
    </div>
  );
};
