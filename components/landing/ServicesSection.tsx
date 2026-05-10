import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { ServicesCarouselClient } from "./ServicesCarouselClient";
import Link from "next/link";

export function ServicesSection({ services }: { services: LandingPageContent["services"] }) {
  const parts = (services.title || "").split("&").map((p) => p.trim()).filter(Boolean);
  const first = parts[0] ?? "SERVICES";
  const rest = parts.slice(1).join(" & ");

  return (
    <section
      id="services"
      className="bg-[color:var(--surface-inverse)] py-14 text-[color:var(--surface-inverse-foreground)] md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center ">
          <div className="flex flex-col items-center gap-4">
            <h2 className="hero-name text-[64px] sm:text-[84px] md:text-[108px]">
              <span className="text-[color:var(--accent)]">{first}</span>{" "}
              {rest ? <span className="text-[color:var(--surface-inverse-foreground)]">&amp; {rest}</span> : null}
            </h2>
            {services.subtitle ? (
              <p className="max-w-2xl text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground-weaker)]">
                {services.subtitle}
              </p>
            ) : null}
            <Button asChild variant="accent" className="h-11 px-6">
              <Link href={services.viewAllLink}>{services.viewAllText || "Lihat semua layanan"}</Link>
            </Button>
          </div>
        </div>

        <ServicesCarouselClient items={services.items} />
      </div>
    </section>
  );
}
