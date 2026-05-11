"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "./EditModeProvider";

type EditableTextProps = {
  path: string;
  value?: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
};

export function EditableText({
  path,
  value,
  as = "span",
  className,
  placeholder = "Click to edit",
}: EditableTextProps) {
  const context = useEditModeContext();
  const Comp = as as React.ElementType;

  const contextValue = context?.getFieldValue(path);
  const displayValue = typeof contextValue === "string" ? contextValue : value || "";

  if (!context?.isEditMode) {
    return <Comp className={className}>{displayValue || placeholder}</Comp>;
  }

  return (
    <Comp
      className={cn(
        "rounded-md outline-none ring-1 ring-dashed ring-[color:var(--accent)]/55 transition focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
        className,
      )}
      contentEditable
      suppressContentEditableWarning
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        context.updateField(path, event.currentTarget.innerText);
      }}
    >
      {displayValue || placeholder}
    </Comp>
  );
}
