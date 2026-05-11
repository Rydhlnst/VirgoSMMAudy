import { cn } from "@/lib/utils";

export function CmsSectionWrapper({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-dashed border-[color:var(--accent)]/35 p-4", className)}>
      <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[color:var(--muted-foreground-weak)]">{title}</div>
      {children}
    </section>
  );
}
