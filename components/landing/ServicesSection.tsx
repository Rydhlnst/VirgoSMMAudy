import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { ServicesCarouselClient } from "./ServicesCarouselClient";
import Link from "next/link";
import { EditableText } from "@/components/cms/EditableText";

export function ServicesSection({ services }: { services: LandingPageContent["services"] }) {
  return (
    <section
      id="services"
      className="bg-[color:var(--surface-inverse)] py-14 text-[color:var(--surface-inverse-foreground)] md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center ">
          <div className="flex flex-col items-center gap-4">
            <EditableText
              as="h2"
              path="services.title"
              value={services.title}
              className="hero-name text-[64px] sm:text-[84px] md:text-[108px]"
            />
            {services.subtitle ? (
              <EditableText
                as="p"
                path="services.subtitle"
                value={services.subtitle}
                className="max-w-2xl text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground-weaker)]"
              />
            ) : null}
            <Button asChild variant="accent" className="h-11 px-6">
              <Link href={services.viewAllLink}>
                <EditableText path="services.viewAllText" value={services.viewAllText || "View all services"} />
              </Link>
            </Button>
          </div>
        </div>

        <ServicesCarouselClient
          items={services.items}
          carouselHintText={services.carouselHintText}
          idealForLabel={services.idealForLabel}
        />
      </div>
    </section>
  );
}
