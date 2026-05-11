"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "./EditModeProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { ImageDropzone } from "@/components/cms/ImageDropzone";
import { Skeleton } from "@/components/ui/skeleton";

type EditableImageProps = {
  path: string;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
};

type ImageMeta = {
  x: number;
  y: number;
  zoom: number;
};

function encodePathKey(path: string): string {
  // Base64url without dots so we can use it as a record key in cmsMeta.images.<key>
  const b64 = window.btoa(unescape(encodeURIComponent(path)));
  return b64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function EditableImage({
  path,
  src,
  alt,
  className,
  imgClassName,
}: EditableImageProps) {
  const context = useEditModeContext();
  const [open, setOpen] = React.useState(false);

  const currentValue = context?.getFieldValue(path);
  const currentSrc = typeof currentValue === "string" && currentValue.length > 0 ? currentValue : src || "";
  const finalSrc = currentSrc;

  const metaKey = React.useMemo(() => encodePathKey(path), [path]);
  const metaPath = `cmsMeta.images.${metaKey}`;
  const metaValue = context?.getFieldValue(metaPath);

  const meta: ImageMeta = React.useMemo(() => {
    const raw = typeof metaValue === "object" && metaValue !== null ? (metaValue as Partial<ImageMeta>) : null;
    return {
      x: clamp(typeof raw?.x === "number" ? raw.x : 50, 0, 100),
      y: clamp(typeof raw?.y === "number" ? raw.y : 50, 0, 100),
      zoom: clamp(typeof raw?.zoom === "number" ? raw.zoom : 1, 1, 3),
    };
  }, [metaValue]);

  const applyMeta = React.useCallback(
    (next: Partial<ImageMeta>) => {
      if (!context) return;
      context.updateField(metaPath, {
        x: typeof next.x === "number" ? next.x : meta.x,
        y: typeof next.y === "number" ? next.y : meta.y,
        zoom: typeof next.zoom === "number" ? next.zoom : meta.zoom,
      });
    },
    [context, meta.x, meta.y, meta.zoom, metaPath],
  );

  const imgStyle: React.CSSProperties = {
    objectPosition: `${meta.x}% ${meta.y}%`,
    transform: meta.zoom !== 1 ? `scale(${meta.zoom})` : undefined,
    transformOrigin: `${meta.x}% ${meta.y}%`,
  };

  return (
    <div className={cn(className)}>
      <div className="relative">
        {finalSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finalSrc}
            alt={alt || "Editable image"}
            className={cn("w-full object-cover", imgClassName, context?.isEditMode ? "cursor-pointer" : undefined)}
            style={imgStyle}
            onClick={() => {
              if (!context?.isEditMode) return;
              setOpen(true);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!context?.isEditMode) return;
              setOpen(true);
            }}
            className={cn("block w-full", context?.isEditMode ? "cursor-pointer" : "cursor-default")}
            aria-label={context?.isEditMode ? "Add image" : "Image placeholder"}
          >
            <Skeleton className={cn("w-full", imgClassName)} />
          </button>
        )}

        {context?.isEditMode ? (
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-dashed ring-[color:var(--accent)]/55" />
        ) : null}
      </div>

      {context?.isEditMode && open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-black">Edit Image</div>
                <div className="truncate text-xs text-[color:var(--muted-foreground)]">{path}</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-9 w-9 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label>Upload image</Label>
                <ImageDropzone
                  onUploadedUrl={(url) => {
                    context.updateField(path, url);
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => context.updateField(path, "")}>
                    Remove
                  </Button>
                  <Button type="button" variant="outline" onClick={() => context.updateField(metaPath, { x: 50, y: 50, zoom: 1 })}>
                    Reset crop
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-semibold">Crop / Position</div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Horizontal</Label>
                    <div className="text-xs text-[color:var(--muted-foreground)]">{Math.round(meta.x)}%</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={meta.x}
                    onChange={(e) => applyMeta({ x: Number(e.currentTarget.value) })}
                    className="w-full accent-[color:var(--accent)]"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Vertical</Label>
                    <div className="text-xs text-[color:var(--muted-foreground)]">{Math.round(meta.y)}%</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={meta.y}
                    onChange={(e) => applyMeta({ y: Number(e.currentTarget.value) })}
                    className="w-full accent-[color:var(--accent)]"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Zoom</Label>
                    <div className="text-xs text-[color:var(--muted-foreground)]">{meta.zoom.toFixed(2)}x</div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={meta.zoom}
                    onChange={(e) => applyMeta({ zoom: Number(e.currentTarget.value) })}
                    className="w-full accent-[color:var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-semibold">Preview</div>
                <div className="overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {finalSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={finalSrc} alt={alt || "Preview"} className="h-64 w-full object-cover" style={imgStyle} />
                  ) : (
                    <Skeleton className="h-64 w-full" />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
