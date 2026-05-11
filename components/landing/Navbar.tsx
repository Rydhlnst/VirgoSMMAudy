"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function Navbar({ navbar }: { navbar: LandingPageContent["navbar"] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const overlayTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: smoothEase };

  const itemTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: smoothEase };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-(--inverse-border-subtle) bg-(--surface-inverse) text-(--surface-inverse-foreground)">
        <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
          <div className="hidden items-center justify-between md:grid md:grid-cols-3">
            <nav className="flex items-center gap-7 text-[11px] font-medium tracking-[0.22em] text-(--inverse-muted-foreground)">
              {navbar.menu.slice(0, 2).map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="uppercase text-(--inverse-muted-foreground) transition-colors motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-(--surface-inverse-foreground) motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex justify-center">
              <Link
                href="/"
                className="hero-name text-center text-2xl transition-transform motion-reduce:transition-none hover:-rotate-1 motion-reduce:hover:rotate-0 md:text-3xl lg:text-4xl"
              >
                {navbar.brandName}
              </Link>
            </div>

            <nav className="flex items-center justify-end gap-7 text-[11px] font-medium tracking-[0.22em] text-(--inverse-muted-foreground)">
              {navbar.menu.slice(2, 4).map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="uppercase text-(--inverse-muted-foreground) transition-colors motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-(--surface-inverse-foreground) motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-between md:hidden">
            <Link
              href="/"
              onClick={closeMenu}
              className="hero-name max-w-[70%] truncate text-base transition-transform motion-reduce:transition-none hover:-rotate-1 motion-reduce:hover:rotate-0"
            >
              {navbar.brandName}
            </Link>

            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-(--inverse-border-subtle) text-(--surface-inverse-foreground) transition-transform active:scale-95"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, rotate: -45, scale: 0.8 }
                    }
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotate: 45, scale: 0.8 }
                    }
                    transition={itemTransition}
                    className="flex"
                  >
                    <X className="size-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, rotate: 45, scale: 0.8 }
                    }
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotate: -45, scale: 0.8 }
                    }
                    transition={itemTransition}
                    className="flex"
                  >
                    <Menu className="size-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu-overlay"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="fixed inset-0 z-40 bg-(--surface-inverse) text-(--surface-inverse-foreground) md:hidden"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: -16, opacity: 0 }
              }
              transition={overlayTransition}
              className="flex min-h-dvh flex-col px-6 pb-8 pt-28"
            >
              <nav className="flex flex-1 flex-col justify-center gap-5">
                {navbar.menu.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 18, rotate: -1 }
                    }
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 12, rotate: -1 }
                    }
                    transition={{
                      ...itemTransition,
                      delay: shouldReduceMotion ? 0 : idx * 0.045,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block border-b border-(--inverse-border-subtle) pb-4 text-4xl font-black uppercase tracking-[-0.04em] text-(--surface-inverse-foreground) transition-transform active:scale-[0.98]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{
                  ...itemTransition,
                  delay: shouldReduceMotion
                    ? 0
                    : Math.max(navbar.menu.length * 0.045, 0.12),
                }}
                className="mt-8 space-y-5"
              >
                <Button asChild variant="accent" className="h-12 w-full px-6">
                  <Link href={navbar.ctaLink} onClick={closeMenu}>
                    {navbar.ctaText}
                  </Link>
                </Button>

                <p className="text-xs font-medium uppercase tracking-[0.22em] text-(--inverse-muted-foreground)">
                  {navbar.brandName}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}