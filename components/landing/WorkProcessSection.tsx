"use client";

import { Badge } from "@/components/ui/badge";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { CmsAddItemCard } from "@/components/cms/CmsAddItemCard";

export function WorkProcessSection({ workProcess }: { workProcess: LandingPageContent["workProcess"] }) {
  const context = useEditModeContext();
  const stepsFromContext = context?.getFieldValue("workProcess.steps");
  const steps = Array.isArray(stepsFromContext)
    ? (stepsFromContext as LandingPageContent["workProcess"]["steps"])
    : workProcess.steps;

  return (
    <section className="bg-(--surface) py-14 text-(--surface-foreground) md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-left">
          <EditableText
            as="div"
            path="workProcess.kicker"
            value={workProcess.kicker}
            className="mb-3 inline-flex rounded-full bg-accent px-4 py-1 text-xs font-black tracking-[0.22em] text-accent-foreground"
          />
          <EditableText as="h2" path="workProcess.title" value={workProcess.title} className="hero-name text-[52px] sm:text-[64px] md:text-[84px]" />
          <EditableTextarea path="workProcess.description" value={workProcess.description} className="mt-3 max-w-2xl text-base text-(--muted-foreground)" rows={3} />
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center"
            >
              <div className="relative size-32 overflow-hidden rounded-[28px] bg-(--overlay-1)">
                <EditableImage
                  path={`workProcess.steps.${idx}.icon`}
                  src={s.icon}
                  alt={s.title}
                  className="absolute inset-0"
                  imgClassName="absolute inset-0 h-full w-full rounded-[28px] object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-(--overlay-3)" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <EditableText
                    as="div"
                    path={`workProcess.steps.${idx}.number`}
                    value={s.number}
                    className="text-4xl font-black tracking-tight text-(--surface-inverse-foreground) drop-shadow-sm"
                  />
                </div>
              </div>

              <EditableText as="div" path={`workProcess.steps.${idx}.title`} value={s.title} className="mt-5 text-base font-black" />
              {s.description ? (
                <EditableTextarea path={`workProcess.steps.${idx}.description`} value={s.description} className="mt-2 text-sm text-[color:var(--muted-foreground)]" rows={3} />
              ) : null}

              <div className="mt-4">
                <Badge variant="accent" className="w-fit">
                  <EditableText path="workProcess.stepLabel" value={workProcess.stepLabel} />
                </Badge>
              </div>
            </div>
          ))}

          {context?.isEditMode ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative size-32 overflow-hidden rounded-[28px] bg-(--overlay-1)">
                <CmsAddItemCard
                  label="Add step"
                  onClick={() => {
                    context.updateField("workProcess.steps", [
                      ...steps,
                      {
                        icon: "",
                        number: String(steps.length + 1),
                        title: "New step",
                        description: "",
                      },
                    ]);
                  }}
                  className="absolute inset-0 size-32 rounded-[28px] border-accent/55 bg-transparent p-0"
                  contentClassName="gap-2"
                  iconClassName="h-12 w-12 rounded-2xl"
                />
              </div>
              <div className="mt-5 text-base font-black text-(--muted-foreground-weak)">Add step</div>
              <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">Click to append</div>
              <div className="mt-4">
                <Badge variant="accent" className="w-fit">
                  <EditableText path="workProcess.stepLabel" value={workProcess.stepLabel} />
                </Badge>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

