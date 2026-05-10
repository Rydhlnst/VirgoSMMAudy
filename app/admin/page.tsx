import { LandingContentAdmin } from "@/components/admin/LandingContentAdmin";
import Link from "next/link";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="min-h-[calc(100vh-1px)] bg-[color:var(--background)]">
      {/* TODO(phase-2): add auth protection if needed */}
      <div className="border-b border-[color:var(--inverse-border-subtle)] bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="hero-name text-sm">CMS Admin</div>
          <Link
            href="/"
            className="rounded-full border border-[color:var(--inverse-border-subtle)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
          >
            View Site
          </Link>
        </div>
      </div>
      <LandingContentAdmin />
      <Toaster richColors position="top-right" />
    </div>
  );
}
