import type { LandingPageContent } from "@/lib/landing-content/types";
import { SectionHeading } from "./SectionHeading";
import Image from "next/image";

function NotchedO({ className }: { className?: string }) {
  return (
    <span className={"relative inline-block " + (className ?? "")}>
      O
      {/* Cut-out notch to mimic the reference style */}
      <span className="pointer-events-none absolute left-1/2 top-[55%] h-[0.55em] w-[0.55em] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full bg-background" />
    </span>
  );
}

function AboutDisplayTitle({ title }: { title: string }) {
  const upper = title.toUpperCase();
  // Render like: AB( O-notched )UT ME when possible
  const parts = upper.split("O");
  if (parts.length < 2) {
    return <h2 className="hero-name text-[64px] sm:text-[84px] md:text-[108px]">{upper}</h2>;
  }

  return (
    <h2 className="hero-name text-[64px] sm:text-[84px] md:text-[108px]">
      {parts[0]}
      <NotchedO />
      {parts.slice(1).join("O")}
    </h2>
  );
}

export function AboutSection({ about }: { about: LandingPageContent["about"] }) {
  return (
    <section id="about" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10">
          <AboutDisplayTitle title={about.title} />

          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-3">
                <div className="relative">
                  <div className="rounded-full border-none border-accent px-5 py-2 text-sm font-semibold italic text-foreground">
                    {about.label}
                  </div>
                  <div className="pointer-events-none absolute -inset-2 -rotate-6 rounded-full border-none border-[color:var(--accent)]/70" />
                  <div className="pointer-events-none absolute -inset-3 rotate-3 rounded-full border border-[color:var(--accent)]/40" />
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">{about.description}</p>
              <div className="mt-6 h-0.5 w-16 bg-foreground/25" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {about.images.slice(0, 3).map((img, idx) => {
              const rotate = idx === 0 ? "-rotate-6" : idx === 1 ? "rotate-2" : "rotate-8";
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-[28px] border-none border-foreground bg-background p-2 shadow-sm ${rotate}`}
                >
                  <div className="relative overflow-hidden rounded-[20px]">
                    <Image
                      src={img.imageUrl || "https://placehold.co/1200x900?text=About"}
                      alt={img.alt}
                      width={1200}
                      height={900}
                      className="aspect-4/3 w-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
