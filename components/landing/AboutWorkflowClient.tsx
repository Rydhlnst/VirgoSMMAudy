"use client";

import * as React from "react";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type WorkflowStep = { title: string; description?: string };

export function AboutWorkflowClient({
  steps,
  workflowLabel,
}: {
  steps: WorkflowStep[];
  workflowLabel?: string;
}) {
  const context = useEditModeContext();
  const stepsFromContext = context?.getFieldValue("about.workflowSteps");
  const stepsValue = Array.isArray(stepsFromContext) ? (stepsFromContext as WorkflowStep[]) : steps;
  const safeSteps = stepsValue.filter((s) => s && typeof s.title === "string" && s.title.trim().length);

  return (
    <div className="rounded-3xl border border-foreground/10 bg-foreground/2 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <EditableText
          as="div"
          path="about.workflowLabel"
          value={workflowLabel || "WHAT WE DO"}
          className="text-xs font-extrabold uppercase tracking-[0.22em] text-foreground/60"
        />

        {context?.isEditMode ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-4"
            onClick={() => {
              context.updateField("about.workflowSteps", [
              ...(Array.isArray(stepsValue) ? stepsValue : []),
                { title: "New step", description: "" },
              ]);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add step
          </Button>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        {safeSteps.map((step, idx) => (
          <div key={`${step.title}-${idx}`} className="relative pl-7">
            {idx !== safeSteps.length - 1 ? (
              <div className="absolute left-[10px] top-5 h-[calc(100%+12px)] w-px bg-foreground/10" aria-hidden />
            ) : null}

            <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border border-foreground/15 bg-background" aria-hidden>
              <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--accent)]/70" />
            </div>

            <EditableText
              as="div"
              path={`about.workflowSteps.${idx}.title`}
              value={step.title}
              className="text-sm font-semibold text-foreground"
            />
            <EditableTextarea
              path={`about.workflowSteps.${idx}.description`}
              value={step.description || ""}
              rows={2}
              className="mt-1 max-w-none text-sm text-foreground/70"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
