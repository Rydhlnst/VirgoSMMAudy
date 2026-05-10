"use client";

import Scrollbar from "smooth-scrollbar";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type SmoothScrollbarRootProps = {
  children: React.ReactNode;
  className?: string;
};

export function SmoothScrollbarRoot({
  children,
  className,
}: SmoothScrollbarRootProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollbar = Scrollbar.init(viewport, {
      damping: prefersReducedMotion ? 1 : 0.08,
      alwaysShowTracks: false,
      continuousScrolling: true,
    });

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return (
    <div ref={viewportRef} className={cn("h-dvh w-full overflow-hidden", className)}>
      <div className="min-h-dvh w-full">{children}</div>
    </div>
  );
}

