import { Badge } from "@/components/ui/badge";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";

export function BrandingSection({ branding }: { branding: LandingPageContent["branding"] }) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-left">
          <EditableText as="h2" path="branding.title" value={branding.title} className="hero-name text-[52px] sm:text-[64px] md:text-[84px]" />
          <EditableTextarea path="branding.description" value={branding.description} className="mt-3 max-w-2xl text-base text-(--muted-foreground)" rows={3} />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[40px] border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3">
            <div className="relative overflow-hidden rounded-[30px]">
              <EditableImage
                path="branding.beforeImageUrl"
                src={branding.beforeImageUrl}
                alt={branding.beforeLabel}
                imgClassName="aspect-[4/3] w-full rounded-[30px] object-cover"
              />
              <div className="absolute left-3 top-3">
                <Badge variant="dark">
                  <EditableText path="branding.beforeLabel" value={branding.beforeLabel} />
                </Badge>
              </div>
            </div>
          </div>
          <div className="rounded-[40px] border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3">
            <div className="relative overflow-hidden rounded-[30px]">
              <EditableImage
                path="branding.afterImageUrl"
                src={branding.afterImageUrl}
                alt={branding.afterLabel}
                imgClassName="aspect-[4/3] w-full rounded-[30px] object-cover"
              />
              <div className="absolute left-3 top-3">
                <Badge variant="accent">
                  <EditableText path="branding.afterLabel" value={branding.afterLabel} />
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
