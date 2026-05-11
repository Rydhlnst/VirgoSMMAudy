"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border-[color:var(--border-subtle)] group-[.toaster]:bg-[color:var(--card)] group-[.toaster]:text-[color:var(--card-foreground)] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[color:var(--muted-foreground)]",
          actionButton:
            "group-[.toast]:bg-[color:var(--accent)] group-[.toast]:text-[color:var(--accent-foreground)]",
          cancelButton:
            "group-[.toast]:bg-[color:var(--overlay-1)] group-[.toast]:text-[color:var(--foreground)]",
        },
      }}
      {...props}
    />
  );
}
