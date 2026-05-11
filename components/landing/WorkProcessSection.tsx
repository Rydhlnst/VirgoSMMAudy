import { Badge } from "@/components/ui/badge";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownContent } from "@/components/landing/MarkdownContent";

export function WorkProcessSection({ workProcess }: { workProcess: LandingPageContent["workProcess"] }) {
  return (
    <section className="bg-(--surface) py-14 text-(--surface-foreground) md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={workProcess.title}
          description="A flexible process designed to support your business smoothly."
          kicker="PROCESS"
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {workProcess.steps.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center"
            >
              <div className="relative size-32 overflow-hidden rounded-[28px] bg-(--overlay-1)">
                <Skeleton className="absolute inset-0 h-full w-full rounded-[28px] bg-foreground/10" />
                <div className="absolute inset-0 bg-(--overlay-3)" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-black tracking-tight text-(--surface-inverse-foreground) drop-shadow-sm">
                    {s.number}
                  </div>
                </div>
              </div>

              <div className="mt-5 text-base font-black">{s.title}</div>
              {s.description ? (
                <MarkdownContent content={s.description} className="mt-2 text-sm text-[color:var(--muted-foreground)]" />
              ) : null}

              <div className="mt-4">
                <Badge variant="accent" className="w-fit">
                  Step
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
