"use client";

import * as React from "react";
import { MarkdownContent } from "@/components/landing/MarkdownContent";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { useEditModeContext } from "@/components/cms/EditModeProvider";

export function EditableMarkdown({
  path,
  value,
  className,
  rows = 6,
  tone,
}: {
  path: string;
  value?: string | null;
  className?: string;
  rows?: number;
  tone?: "light" | "dark";
}) {
  const context = useEditModeContext();
  const contextValue = context?.getFieldValue(path);
  const displayValue = typeof contextValue === "string" ? contextValue : value || "";

  if (!context?.isEditMode) {
    return <MarkdownContent content={displayValue} className={className} tone={tone} />;
  }

  return <EditableTextarea path={path} value={displayValue} rows={rows} className={className} />;
}

