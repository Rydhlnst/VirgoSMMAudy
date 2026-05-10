import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-2xl border border-[color:var(--border-subtle-2)] bg-[color:var(--card)] px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-[color:var(--muted-foreground-weaker)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
