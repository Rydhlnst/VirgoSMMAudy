import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {kicker ? (
        <div className="mb-3 inline-flex rounded-full bg-accent px-4 py-1 text-xs font-black tracking-[0.22em] text-accent-foreground">
          {kicker}
        </div>
      ) : null}
      <h2
        className={cn(
          "hero-name text-[52px] sm:text-[64px] md:text-[84px]",
          tone === "dark"
            ? "text-(--surface-inverse-foreground)"
            : "text-foreground",
        )}
        style={{ whiteSpace: "pre-line" }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "app-description mt-3 max-w-2xl text-base sm:text-lg",
            tone === "dark"
              ? "text-(--inverse-muted-foreground)"
              : "text-(--muted-foreground)",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
