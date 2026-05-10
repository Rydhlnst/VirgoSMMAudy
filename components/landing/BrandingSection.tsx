import { Badge } from "@/components/ui/badge";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";

export function BrandingSection({ branding }: { branding: LandingPageContent["branding"] }) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title={branding.title} description={branding.description} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[40px] border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3">
            <div className="relative overflow-hidden rounded-[30px]">
              <Skeleton className="aspect-[4/3] w-full rounded-[30px]" />
              <div className="absolute left-3 top-3">
                <Badge variant="dark">{branding.beforeLabel}</Badge>
              </div>
            </div>
          </div>
          <div className="rounded-[40px] border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3">
            <div className="relative overflow-hidden rounded-[30px]">
              <Skeleton className="aspect-[4/3] w-full rounded-[30px]" />
              <div className="absolute left-3 top-3">
                <Badge variant="accent">{branding.afterLabel}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
