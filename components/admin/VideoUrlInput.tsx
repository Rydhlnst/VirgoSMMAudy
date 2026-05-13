"use client";

import { Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { VideoDropzone } from "@/components/cms/VideoDropzone";

export function VideoUrlInput({
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
  const { register, setValue } = useFormContext();

  const value = useWatch({ name }) as string | undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <div className="grid gap-2">
        <VideoDropzone
          onUploadedUrl={(url) => {
            setValue(name, url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
            toast.success("Video uploaded.");
          }}
        />

        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue(name, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
              toast.success("Video cleared.");
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
          <div className="relative overflow-hidden rounded-lg bg-black/5">
            <video src={value} controls className="h-40 w-full rounded-lg object-cover" preload="metadata" />
          </div>
        </div>
      ) : (
        <div className="mt-1 flex h-20 items-center justify-center rounded-xl border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--overlay-1)] text-xs text-[color:var(--muted-foreground-weak)]">
          <Video className="mr-2 h-4 w-4" />
          No video selected
        </div>
      )}

      {/* Keep the field registered in react-hook-form even without a text input */}
      <input type="hidden" {...register(name)} />
    </div>
  );
}
