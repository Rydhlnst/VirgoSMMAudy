import { Badge } from "@/components/ui/badge";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkProcessSection({ workProcess }: { workProcess: LandingPageContent["workProcess"] }) {
  return (
    <section className="bg-[color:var(--surface)] py-14 text-[color:var(--surface-foreground)] md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={workProcess.title}
          description="Simple steps. Clear output. Easy collaboration."
          kicker="PROCESS"
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {workProcess.steps.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center"
            >
              <div className="relative size-32 overflow-hidden rounded-[28px] bg-[color:var(--overlay-1)]">
                <Skeleton className="absolute inset-0 h-full w-full rounded-[28px] bg-foreground/10" />
                <div className="absolute inset-0 bg-[color:var(--overlay-3)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-black tracking-tight text-[color:var(--surface-inverse-foreground)] drop-shadow-sm">
                    {s.number}
                  </div>
                </div>
              </div>

              <div className="mt-5 text-base font-black">{s.title}</div>
              {s.description ? (
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">{s.description}</p>
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
