import type { LandingPageContent } from "@/lib/landing-content/types";
import { EditableText } from "@/components/cms/EditableText";
import { AboutDescriptionClient } from "./AboutDescriptionClient";
import { Button } from "@/components/ui/button";

export function AboutSection({ about }: { about: LandingPageContent["about"] }) {
  return (
    <section id="about" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:gap-12">
          <div className="grid gap-10 md:grid-cols-[180px,1fr] md:items-start">
            <div className="inline-flex items-start">
              <EditableText
                as="div"
                path="about.label"
                value={about.label}
                className="text-sm font-semibold italic text-foreground/70"
              />
            </div>

            <div className="grid gap-6">
              <EditableText
                as="h2"
                path="about.title"
                value={about.title}
                className="hero-name text-[56px] leading-[0.95] sm:text-[76px] md:text-[96px]"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button asChild variant="ghost" size="sm">
                  <a href="/about">
                    <EditableText as="span" path="about.readMoreText" value={about.readMoreText} />
                  </a>
                </Button>

                <Button asChild variant="outline">
                  <a href={about.ctaLink}>
                    <EditableText as="span" path="about.ctaText" value={about.ctaText} />
                  </a>
                </Button>
              </div>

              <AboutDescriptionClient
                path="about.description"
                value={about.description}
                readMoreText={about.readMoreText}
                readLessText={about.readLessText}
                className="text-sm text-foreground/75 sm:text-base md:text-[17px] md:leading-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
