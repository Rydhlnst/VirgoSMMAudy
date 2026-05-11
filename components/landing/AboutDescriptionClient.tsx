"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { EditableTextarea } from "@/components/cms/EditableTextarea";

type AboutDescriptionClientProps = {
  path: string;
  value?: string;
  className?: string;
  readMoreText?: string;
  readLessText?: string;
};

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
    <div className={cn("whitespace-pre-wrap break-words", className)}>
      {displayValue || "-"}
    </div>
  );
}
