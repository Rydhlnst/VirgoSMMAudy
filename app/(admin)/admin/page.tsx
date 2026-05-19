import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LandingContentAdmin } from "@/components/admin/LandingContentAdmin";
import { AdminSessionActions } from "@/components/admin/AdminSessionActions";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";
import Link from "next/link";
import { EditModeToggle } from "@/components/admin/EditModeToggle";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!isAdminSession(session)) {
    redirect("/admin/login?reason=unauthorized");
  }
  const adminSession = session as NonNullable<typeof session>;

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-[color:var(--border-subtle)] bg-[color:var(--card)]/70 p-4 lg:p-6">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted-foreground-weak)]">CMS Dashboard</div>
          <h1 className="mt-2 text-xl font-black tracking-tight">Admin Panel</h1>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">Manage draft revisions and publish safely.</p>
          <div className="mt-6 grid gap-2">
            <Button asChild variant="accent" className="justify-start rounded-xl">
              <Link href="/admin/pages/home/edit">Inline Editor</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start rounded-xl">
              <Link href="/">View Public Site</Link>
            </Button>
            <EditModeToggle goTo="/" />
          </div>
        </aside>
        <main className="min-w-0">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--card)]/90 px-4 py-4 backdrop-blur sm:px-6">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--muted-foreground-weak)]">Content Operations</div>
              <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">Draft, review, publish, and rollback from one place.</div>
            </div>
            <AdminSessionActions email={adminSession.user.email} />
          </div>
          <LandingContentAdmin />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
