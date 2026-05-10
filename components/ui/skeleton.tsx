import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-2xl bg-foreground/10", className)} aria-hidden="true" />;
}

