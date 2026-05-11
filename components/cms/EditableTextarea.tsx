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

  if (!context?.isEditMode) {
    return <div className={className}>{displayValue || placeholder}</div>;
  }

  return (
    <textarea
      value={displayValue}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => {
        context.updateField(path, event.currentTarget.value);
      }}
      className={cn(
        "w-full resize-y rounded-md border border-[color:var(--accent)]/55 bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
        className,
      )}
    />
  );
}
