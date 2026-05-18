/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "./EditModeProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import { ImageDropzone } from "@/components/cms/ImageDropzone";
import { Skeleton } from "@/components/ui/skeleton";

type EditableImageProps = {
  path: string;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  cropAspect?: number;
};

type ImageMeta = {
  x: number;
  y: number;
  zoom: number;
};

function encodePathKey(path: string): string {
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(path, "utf8").toString("base64")
      : window.btoa(unescape(encodeURIComponent(path)));

  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function metaToCrop(meta: ImageMeta): Point {
  return {
    x: (50 - meta.x) * 2,
    y: (50 - meta.y) * 2,
  };
}

function cropToMeta(crop: Point) {
  return {
    x: clamp(50 - crop.x / 2, 0, 100),
    y: clamp(50 - crop.y / 2, 0, 100),
  };
}

export function EditableImage({
  path,
  src,
  alt,
  className,
  imgClassName,
  cropAspect = 16 / 9,
}: EditableImageProps) {
  const context = useEditModeContext();
  const [open, setOpen] = React.useState(false);
  const [imgFailed, setImgFailed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentValue = context?.getFieldValue(path);
  const currentSrc =
    typeof currentValue === "string" && currentValue.length > 0 ? currentValue : src || "";

  const finalSrc = currentSrc;
  const showImage = Boolean(finalSrc) && !imgFailed;

  React.useEffect(() => {
    setImgFailed(false);
  }, [finalSrc]);

  const metaKey = React.useMemo(() => encodePathKey(path), [path]);
  const metaPath = `cmsMeta.images.${metaKey}`;
  const metaValue = context?.getFieldValue(metaPath);

  const meta: ImageMeta = React.useMemo(() => {
    const raw =
      typeof metaValue === "object" && metaValue !== null
        ? (metaValue as Partial<ImageMeta>)
        : null;

    return {
      x: clamp(typeof raw?.x === "number" ? raw.x : 50, 0, 100),
      y: clamp(typeof raw?.y === "number" ? raw.y : 50, 0, 100),
      zoom: clamp(typeof raw?.zoom === "number" ? raw.zoom : 1, 1, 3),
    };
  }, [metaValue]);

  const [crop, setCrop] = React.useState<Point>(() => metaToCrop(meta));
  const [zoom, setZoom] = React.useState(meta.zoom);

  React.useEffect(() => {
    if (!open) return;

    setCrop(metaToCrop(meta));
    setZoom(meta.zoom);
  }, [open, meta.x, meta.y, meta.zoom]);

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

  const handleCropChange = React.useCallback(
    (nextCrop: Point) => {
      setCrop(nextCrop);

      const nextMetaPosition = cropToMeta(nextCrop);

      applyMeta({
        x: nextMetaPosition.x,
        y: nextMetaPosition.y,
        zoom,
      });
    },
    [applyMeta, zoom],
  );

  const handleZoomChange = React.useCallback(
    (nextZoom: number) => {
      const safeZoom = clamp(nextZoom, 1, 3);

      setZoom(safeZoom);

      const nextMetaPosition = cropToMeta(crop);

      applyMeta({
        x: nextMetaPosition.x,
        y: nextMetaPosition.y,
        zoom: safeZoom,
      });
    },
    [applyMeta, crop],
  );

  const handleCropComplete = React.useCallback(
    (_croppedArea: Area, _croppedAreaPixels: Area) => {
      // Crop tidak diexport menjadi file baru.
      // Behavior lama tetap dipertahankan: hanya metadata tampilan yang diupdate.
    },
    [],
  );

  const handleResetCrop = React.useCallback(() => {
    const defaultMeta = { x: 50, y: 50, zoom: 1 };

    setCrop(metaToCrop(defaultMeta));
    setZoom(defaultMeta.zoom);

    context?.updateField(metaPath, defaultMeta);
  }, [context, metaPath]);

  const imgStyle: React.CSSProperties = {
    objectPosition: `${meta.x}% ${meta.y}%`,
    transform: meta.zoom !== 1 ? `scale(${meta.zoom})` : undefined,
    transformOrigin: `${meta.x}% ${meta.y}%`,
  };

  const modalContent =
    context?.isEditMode && open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-3 sm:p-4">
            <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] shadow-xl sm:max-h-[calc(100dvh-2rem)]">
              <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--border-subtle)] px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-black">Edit Image</div>
                  <div className="truncate text-xs text-[color:var(--muted-foreground)]">
                    {path}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 shrink-0 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid flex-1 gap-4 overflow-y-auto p-4">
                <div className="grid gap-2">
                  <Label>Upload image</Label>

                  <ImageDropzone
                    onUploadedUrl={(url) => {
                      setImgFailed(false);
                      context.updateField(path, url);
                      handleResetCrop();
                    }}
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImgFailed(false);
                        context.updateField(path, "");
                      }}
                    >
                      Remove
                    </Button>

                    <Button type="button" variant="outline" onClick={handleResetCrop}>
                      Reset crop
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">Crop / Position</div>
                    <div className="shrink-0 text-xs text-[color:var(--muted-foreground)]">
                      Zoom {zoom.toFixed(2)}x
                    </div>
                  </div>

                  <div className="relative mx-auto h-[220px] w-full max-w-[640px] overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-black/10 sm:h-[280px] md:h-[320px]">
                    {finalSrc ? (
                      <Cropper
                        image={finalSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={cropAspect}
                        minZoom={1}
                        maxZoom={3}
                        cropShape="rect"
                        showGrid={false}
                        restrictPosition={false}
                        objectFit="contain"
                        onCropChange={handleCropChange}
                        onZoomChange={handleZoomChange}
                        onCropComplete={handleCropComplete}
                      />
                    ) : (
                      <Skeleton className="h-full w-full" />
                    )}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Zoom</Label>
                      <div className="text-xs text-[color:var(--muted-foreground)]">
                        {zoom.toFixed(2)}x
                      </div>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => handleZoomChange(Number(e.currentTarget.value))}
                      className="w-full accent-[color:var(--accent)]"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Preview</div>

                  <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-black/5">
                    {finalSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={finalSrc}
                        alt={alt || "Preview"}
                        className="h-[160px] w-full object-cover sm:h-[220px]"
                        style={imgStyle}
                      />
                    ) : (
                      <Skeleton className="h-[160px] w-full sm:h-[220px]" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pb-1">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "group relative h-full w-full",
          context?.isEditMode ? "select-none" : undefined,
        )}
        onClick={(e) => {
          if (!context?.isEditMode) return;
          if (e.defaultPrevented) return;

          setOpen(true);
        }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finalSrc}
            alt={alt || "Editable image"}
            className={cn(
              "h-full w-full object-cover",
              imgClassName,
              context?.isEditMode ? "cursor-pointer" : undefined,
            )}
            style={imgStyle}
            onError={() => setImgFailed(true)}
            onLoad={() => setImgFailed(false)}
          />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              if (!context?.isEditMode) return;

              e.preventDefault();
              setOpen(true);
            }}
            className={cn(
              "relative block h-full w-full",
              context?.isEditMode ? "cursor-pointer" : "cursor-default",
            )}
            aria-label={context?.isEditMode ? "Add image" : "Image placeholder"}
          >
            <div
              className={cn(
                "flex h-full w-full items-center justify-center rounded-[inherit] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--overlay-1)]",
                imgClassName,
              )}
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                <ImagePlus className="h-4 w-4" />
                {context?.isEditMode ? "Add image" : "No image"}
              </div>
            </div>
          </button>
        )}

        {context?.isEditMode ? (
          <>
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-dashed ring-[color:var(--accent)]/55" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/0 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100" />

            <div className="absolute inset-0 flex items-start justify-end p-2 opacity-0 transition group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  className="h-8 gap-2 rounded-full bg-[color:var(--card)] px-3 shadow-sm transition-transform motion-reduce:transition-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                >
                  <Pencil className="h-4 w-4" />
                  {showImage ? "Edit" : "Add"}
                </Button>

                {showImage ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImgFailed(false);
                      context?.updateField(path, "");
                    }}
                    className="h-8 rounded-full border-red-500/40 bg-card px-3 text-red-600 shadow-sm transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:bg-red-500/10 active:translate-y-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {modalContent}
    </div>
  );
}
