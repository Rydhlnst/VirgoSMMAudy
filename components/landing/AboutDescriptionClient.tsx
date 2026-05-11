"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/cms/EditableText";

type AboutDescriptionClientProps = {
  path: string;
  value?: string;
  className?: string;
  readMoreText?: string;
  readLessText?: string;
};

function splitIntoPreviewAndRemainder(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return { preview: "", remainder: "" };

  const paragraphs = normalized
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 2) return { preview: normalized, remainder: "" };

  return {
    preview: paragraphs.slice(0, 2).join("\n\n"),
    remainder: paragraphs.slice(2).join("\n\n"),
  };
}

export function AboutDescriptionClient({
  path,
  value,
  className,
  readMoreText = "Read more",
  readLessText = "Close",
}: AboutDescriptionClientProps) {
  const context = useEditModeContext();
  const contextValue = context?.getFieldValue(path);
  const displayValue = typeof contextValue === "string" ? contextValue : value || "";

  const [isOpen, setIsOpen] = React.useState(false);
  const { preview, remainder } = React.useMemo(
    () => splitIntoPreviewAndRemainder(displayValue),
    [displayValue],
  );

  if (context?.isEditMode) {
    return (
      <EditableTextarea
        path={path}
        value={displayValue}
        rows={8}
        className={className}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn("whitespace-pre-wrap break-words", className)}>
        {preview || "-"}
      </div>

      {remainder ? (
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? (
              <EditableText path="about.readLessText" value={readLessText} />
            ) : (
              <EditableText path="about.readMoreText" value={readMoreText} />
            )}
          </Button>

          {isOpen ? (
            <div className="rounded-3xl border border-foreground/10 bg-foreground/2 p-5 sm:p-6">
              <div className={cn("whitespace-pre-wrap break-words", className)}>
                {remainder}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
