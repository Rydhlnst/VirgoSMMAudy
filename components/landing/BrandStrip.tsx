import type { LandingPageContent } from "@/lib/landing-content/types";

export function BrandStrip({ brandStrip }: { brandStrip: LandingPageContent["brandStrip"] }) {
  if (!brandStrip.items.length) return null;
  return (
    <section className="bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {brandStrip.items.map((item, idx) => {
            const Comp = item.link ? "a" : "div";
            return (
              <Comp
                key={idx}
                {...(item.link ? { href: item.link, target: "_blank", rel: "noreferrer" } : {})}
                className="flex shrink-0 items-center gap-3 rounded-full border border-[color:var(--inverse-border-subtle)] bg-[color:var(--overlay-inverse-1)] px-5 py-2 text-sm font-semibold tracking-wide text-[color:var(--inverse-muted-foreground)]"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                )}
                {item.name}
              </Comp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
