"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { ImageDropzone } from "@/components/cms/ImageDropzone";

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
  const { register, setValue } = useFormContext();

  const value = useWatch({ name }) as string | undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <div className="grid gap-2">
        <input
          type="url"
          value={value ?? ""}
          onChange={(event) => {
            setValue(name, event.currentTarget.value, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
          placeholder="https://example.com/image.jpg atau /uploads/cms/example.jpg"
          className="h-10 w-full rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--card)] px-3 text-sm outline-none ring-0 transition focus:border-[color:var(--accent)]"
        />

        <ImageDropzone
          onUploadedUrl={(url) => {
            setValue(name, url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
            toast.success("Image uploaded.");
          }}
        />

        <div className="flex items-center justify-end">
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

      {/* Keep the field registered in react-hook-form even without a text input */}
      <input type="hidden" {...register(name)} />
    </div>
  );
}
