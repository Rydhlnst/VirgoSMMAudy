"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadFiles } from "@/lib/uploadthing";
import { useFormContext, useWatch } from "react-hook-form";

export function ImageUrlInput({
  name,
  label,
  helperText,
  className,
  previewClassName,
}: {
  name: string;
  label: string;
  helperText?: string;
  className?: string;
  previewClassName?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, setValue } = useFormContext();

  const value = useWatch({ name }) as string | undefined;
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    try {
      setUploading(true);
      const res = await uploadFiles("imageUploader", { files: [file] });
      const first = res[0];
      const url =
        (first as { serverData?: { url?: string } } | undefined)?.serverData?.url ??
        (first as { ufsUrl?: string } | undefined)?.ufsUrl;
      if (!url) {
        throw new Error("Image upload failed (missing uploaded url).");
      }

      setValue(name, url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <div className="grid gap-2">
        <Input id={name} placeholder="/uploads/..." {...register(name)} />
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.currentTarget.files?.[0];
              if (!file) return;
              await handleUpload(file);
              event.currentTarget.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploading ? "Uploading..." : "Upload Image"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue(name, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
              toast.success("Image cleared.");
            }}
            disabled={!value}
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>
      </div>
      {helperText ? <div className="text-xs text-[color:var(--muted-foreground-weak)]">{helperText}</div> : null}
      {typeof value === "string" && value.length > 0 ? (
        <div
          className={cn(
            "mt-1 overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-2",
            previewClassName,
          )}
        >
          <div className="relative overflow-hidden rounded-lg">
            <img src={value} alt="Preview" className="h-40 w-full rounded-lg object-cover" loading="lazy" />
          </div>
        </div>
      ) : (
        <div className="mt-1 flex h-20 items-center justify-center rounded-xl border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--overlay-1)] text-xs text-[color:var(--muted-foreground-weak)]">
          <ImagePlus className="mr-2 h-4 w-4" />
          No image selected
        </div>
      )}
    </div>
  );
}
