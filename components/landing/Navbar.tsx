import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import Link from "next/link";

export function Navbar({ navbar }: { navbar: LandingPageContent["navbar"] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--inverse-border-subtle)] bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="hidden items-center justify-between md:grid md:grid-cols-3">
          <nav className="flex items-center gap-7 text-[11px] font-medium tracking-[0.22em] text-[color:var(--inverse-muted-foreground)]">
            {navbar.menu.slice(0, 2).map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="uppercase text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex justify-center">
            <Link
              href="/"
              className="hero-name text-2xl transition-transform motion-reduce:transition-none hover:-rotate-1 md:text-3xl lg:text-4xl motion-reduce:hover:rotate-0"
            >
              {navbar.brandName}
            </Link>
          </div>
          <nav className="flex items-center justify-end gap-7 text-[11px] font-medium tracking-[0.22em] text-[color:var(--inverse-muted-foreground)]">
            {navbar.menu.slice(2, 4).map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="uppercase text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
          {/* <div className="flex justify-end">
            <Button asChild variant="accent" className="h-10 px-5">
              <a href={navbar.ctaLink}>{navbar.ctaText}</a>
            </Button>
          </div> */}
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="hero-name text-base transition-transform motion-reduce:transition-none hover:-rotate-1 motion-reduce:hover:rotate-0"
            >
              {navbar.brandName}
            </Link>
            <Button asChild variant="accent" className="h-10 px-5">
              <Link href={navbar.ctaLink}>
                {navbar.ctaText}
              </Link>
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {navbar.menu.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="rounded-full border border-[color:var(--inverse-border-subtle)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
