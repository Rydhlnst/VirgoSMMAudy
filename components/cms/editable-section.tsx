"use client";

import * as React from "react";
import { useEditModeContext } from "@/components/cms/EditModeProvider";

export function EditableSection({
  sectionKey,
  label,
  children,
}: {
  sectionKey: string;
  label: string;
  children: React.ReactNode;
}) {
  const context = useEditModeContext();
  const [hovered, setHovered] = React.useState(false);

  if (!context?.isEditMode) return <>{children}</>;

  return (
    <section
      data-section-key={sectionKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl transition-colors"
      style={{ outline: hovered ? "1px solid var(--border-subtle)" : "1px solid transparent" }}
    >
      {hovered ? (
        <div className="absolute -top-2 right-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--card)] px-2 py-0.5 text-[10px] font-semibold">
          {label}
        </div>
      ) : null}
      {children}
    </section>
  );
}
