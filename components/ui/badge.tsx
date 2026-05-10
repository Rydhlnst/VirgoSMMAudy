import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-[color:var(--border)]/20 px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--card)] text-[color:var(--card-foreground)]",
        accent: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] border-transparent",
        dark:
          "bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)] border-[color:var(--inverse-border-subtle)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        interactive
          ? "cursor-pointer transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
          : "",
        className,
      )}
      {...props}
    />
  );
}
