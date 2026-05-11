import type { LandingPageContent } from "@/lib/landing-content/types";
import { EditableText } from "@/components/cms/EditableText";
import { AboutDescriptionClient } from "./AboutDescriptionClient";
import { AboutWorkflowClient } from "./AboutWorkflowClient";

export function AboutSection({ about }: { about: LandingPageContent["about"] }) {
  return (
    <section id="about" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10">
          <EditableText
            as="h2"
            path="about.title"
            value={about.title}
            className="hero-name text-[64px] sm:text-[84px] md:text-[108px]"
          />

          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <div className="flex flex-col gap-8">
                <div className="inline-flex items-center gap-3">
                  <div className="relative">
                    <EditableText
                      as="div"
                      path="about.label"
                      value={about.label}
                      className="rounded-full border-none border-accent px-5 py-2 text-sm font-semibold italic text-foreground"
                    />
                    <div className="pointer-events-none absolute -inset-2 -rotate-6 rounded-full border-none border-(--accent)/70" />
                    <div className="pointer-events-none absolute -inset-3 rotate-3 rounded-full border border-(--accent)/40" />
                  </div>
                </div>

                <AboutWorkflowClient steps={about.workflowSteps} workflowLabel={about.workflowLabel} />
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="rounded-3xl border border-foreground/10 bg-foreground/2 p-5 sm:p-6">
                <AboutDescriptionClient
                  path="about.description"
                  value={about.description}
                  readMoreText={about.readMoreText}
                  readLessText={about.readLessText}
                  className="max-w-none text-sm text-foreground/75 sm:text-base md:text-[17px] md:leading-8"
                />
              </div>
              <div className="mt-6 h-0.5 w-16 bg-foreground/25" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
