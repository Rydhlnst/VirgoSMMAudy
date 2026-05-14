"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "./EditModeProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoDropzone } from "@/components/cms/VideoDropzone";

type EditableVideoProps = {
  path: string;
  src?: string;
  posterSrc?: string;
  className?: string;
  videoClassName?: string;
};

function getInstagramEmbedUrl(raw: string): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "instagram.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  const kind = parts[0]?.toLowerCase();
  const id = parts[1];
  if (!id) return null;

  // Most common: /reel/{id}/
  if (kind === "reel" || kind === "reels") {
    return `https://www.instagram.com/reel/${id}/embed`;
  }

  return null;
}

export function EditableVideo({
  path,
  src,
  posterSrc,
  className,
  videoClassName,
}: EditableVideoProps) {
  const context = useEditModeContext();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [urlDraft, setUrlDraft] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentValue = context?.getFieldValue(path);
  const currentSrc =
    typeof currentValue === "string" && currentValue.length > 0 ? currentValue : src || "";

  React.useEffect(() => {
    if (!open) return;
    setUrlDraft(currentSrc);
  }, [open, currentSrc]);

  const finalSrc = currentSrc;
  const showVideo = Boolean(finalSrc);
  const instagramEmbedUrl = getInstagramEmbedUrl(finalSrc);

  const modalContent =
    context?.isEditMode && open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-3 sm:p-4">
            <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] shadow-xl sm:max-h-[calc(100dvh-2rem)]">
              <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--border-subtle)] px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-black">Edit Video</div>
                  <div className="truncate text-xs text-[color:var(--muted-foreground)]">{path}</div>
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
                  <Label>Instagram reel URL or upload video</Label>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.currentTarget.value)}
                      placeholder="https://www.instagram.com/reel/..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        context.updateField(path, urlDraft.trim());
                      }}
                      className="shrink-0"
                    >
                      Set URL
                    </Button>
                  </div>

                  <VideoDropzone
                    onUploadedUrl={(url) => {
                      context.updateField(path, url);
                    }}
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => context.updateField(path, "")}>
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Preview</div>
                  <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-black/5">
                    {finalSrc ? (
                      instagramEmbedUrl ? (
                        <iframe
                          src={instagramEmbedUrl}
                          title="Instagram reel preview"
                          className="h-[420px] w-full bg-white sm:h-[520px]"
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        />
                      ) : (
                        <video
                          src={finalSrc}
                          poster={posterSrc}
                          controls
                          preload="metadata"
                          className="h-[220px] w-full object-cover sm:h-[280px]"
                        />
                      )
                    ) : (
                      <Skeleton className="h-[220px] w-full sm:h-[280px]" />
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
        className={cn("group relative", context?.isEditMode ? "select-none" : undefined)}
        onClick={(e) => {
          if (!context?.isEditMode) return;
          if (e.defaultPrevented) return;
          setOpen(true);
        }}
      >
        {showVideo ? (
          instagramEmbedUrl ? (
            <iframe
              src={instagramEmbedUrl}
              title="Instagram reel"
              className={cn("w-full bg-white", videoClassName, context?.isEditMode ? "cursor-pointer" : undefined)}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          ) : (
            <video
              src={finalSrc}
              poster={posterSrc}
              className={cn(
                "w-full object-cover",
                videoClassName,
                context?.isEditMode ? "cursor-pointer" : undefined,
              )}
              preload="metadata"
              muted
              playsInline
            />
          )
        ) : (
          <button
            type="button"
            onClick={(e) => {
              if (!context?.isEditMode) return;

              e.preventDefault();
              setOpen(true);
            }}
            className={cn("block w-full", context?.isEditMode ? "cursor-pointer" : "cursor-default")}
            aria-label={context?.isEditMode ? "Add video" : "Video placeholder"}
          >
            <Skeleton className={cn("w-full", videoClassName)} />
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
                  className="h-8 gap-2 rounded-full bg-[color:var(--card)] px-3 shadow-sm"
                >
                  <Pencil className="h-4 w-4" />
                  {showVideo ? "Edit" : "Add"}
                </Button>

                {showVideo ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      context?.updateField(path, "");
                    }}
                    className="h-8 rounded-full border-red-500/40 bg-card px-3 text-red-600 shadow-sm hover:bg-red-500/10"
                    aria-label="Remove video"
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
