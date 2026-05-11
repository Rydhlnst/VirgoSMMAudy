"use client";

import * as React from "react";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { EditableImage } from "@/components/cms/EditableImage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TestimonialsWorkImageFrameClient({
  idx,
  src,
  alt,
  className,
  imgClassName,
}: {
  idx: number;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}) {
  const context = useEditModeContext();
  const contextValue = context?.getFieldValue(`testimonials.items.${idx}.workImageUrl`);
  const liveSrc = typeof contextValue === "string" ? contextValue : src || "";
  const hasImage = Boolean(liveSrc && liveSrc.trim().length);

  return (
    <div className={cn("absolute inset-0", className)}>
      <EditableImage
        path={`testimonials.items.${idx}.workImageUrl`}
        src={src}
        alt={alt}
        className="absolute inset-0"
        imgClassName={imgClassName}
      />

      {!hasImage ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="w-full max-w-[420px] px-6">
            <Skeleton className="h-10 w-full rounded-full bg-white/10" />
            <div className="mt-4 text-center text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/70">
              No Image
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

