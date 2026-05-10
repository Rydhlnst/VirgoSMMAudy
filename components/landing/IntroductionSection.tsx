import type { LandingPageContent } from "@/lib/landing-content/types";
import { SectionHeading } from "./SectionHeading";
import { TypingBubbleClient } from "./TypingBubbleClient";
import { ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function IntroductionSection({ introduction }: { introduction: LandingPageContent["introduction"] }) {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-6 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div className="flex h-full flex-col">
            <SectionHeading title={introduction.title} />
            <div className="mt-8 rounded-[44px] bg-[color:var(--surface-inverse)] p-8 text-[color:var(--surface-inverse-foreground)] shadow-[var(--shadow-2)]">
              <p className="app-description text-base text-[color:var(--inverse-muted-foreground)] sm:text-lg">
                {introduction.description}
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="relative w-full rounded-2xl shadow-sm">
            <div className="absolute left-4 top-4 z-10 lg:-left-6 lg:top-12">
              {introduction.badgeText ? <TypingBubbleClient text={introduction.badgeText} /> : null}
            </div>

            <div className="relative overflow-hidden rounded-[36px]">
              <Skeleton className="aspect-[4/3] w-full rounded-[36px]" />
            </div>

            <div className="absolute bottom-4 right-4 z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-sm lg:-bottom-5 lg:-right-5">
              <ThumbsUp className="h-7 w-7 fill-accent-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
