"use client";

import React, { useRef, useState } from "react";
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./Button";
import { Text } from "./Text";

interface VideoUploadProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string | null;
  label?: string;
  disabled?: boolean;
}

/**
 * Integrated Video Upload component for exercise tutorials.
 * Handles file selection, Supabase Storage upload, and preview.
 */
export const VideoUpload = ({
  onUploadSuccess,
  currentUrl,
  label,
  disabled = false,
}: VideoUploadProps): React.JSX.Element => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("video/mp4")) {
      setError("Please select an MP4 video file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for tutorials
      setError("Video must be under 10MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
      const filePath = `tutorials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("exercise-tutorials")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("exercise-tutorials")
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      setError("Failed to upload video. Ensure bucket is public.");
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = (): void => {
    setPreviewUrl(null);
    onUploadSuccess("");
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
        {uploading ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <Text size="xs" weight="bold" uppercase tracking="widest">Uploading...</Text>
          </div>
        ) : previewUrl ? (
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
              <Text size="xs" variant="subtle">Tutorial video (Max 10MB)</Text>
            </div>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || uploading}
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
