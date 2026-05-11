"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "./EditModeProvider";

type EditableTextareaProps = {
  path: string;
  value?: string;
  className?: string;
  placeholder?: string;
  rows?: number;
};

export function EditableTextarea({
  path,
  value,
  className,
  placeholder = "Click to edit",
  rows = 3,
}: EditableTextareaProps) {
  const context = useEditModeContext();
  const contextValue = context?.getFieldValue(path);
  const displayValue = typeof contextValue === "string" ? contextValue : value || "";
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  if (!context?.isEditMode) {
    return <div className={cn("whitespace-pre-wrap break-words", className)}>{displayValue || placeholder}</div>;
  }

  // Auto-grow textarea height to fit content (good UX for long copy).
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [displayValue]);

  return (
    <textarea
      ref={ref}
      value={displayValue}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => {
        context.updateField(path, event.currentTarget.value);
      }}
      className={cn(
        "w-full resize-none overflow-hidden rounded-md border border-[color:var(--accent)]/55 bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
        className,
      )}
    />
  );
}
