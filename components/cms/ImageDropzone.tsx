"use client";

import * as React from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

export function ImageDropzone({
  onUploadedUrl,
  className,
}: {
  onUploadedUrl: (url: string) => void;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url;
      if (url) onUploadedUrl(url);
    },
  });

  const [isDragOver, setIsDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    setError(null);
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files supported.");
      return;
    }
    try {
      await startUpload([file]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--overlay-1)] p-4 text-center transition",
          isDragOver ? "border-[color:var(--accent)] bg-[color:var(--accent)]/10" : "",
        )}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6" />}
        <div className="text-sm font-semibold">{isUploading ? "Uploading..." : "Drop image here"}</div>
        <div className="text-xs text-[color:var(--muted-foreground)]">or click to choose file</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFiles(e.currentTarget.files)}
      />

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

