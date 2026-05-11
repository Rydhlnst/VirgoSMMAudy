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
      <div className="border-b border-[color:var(--border-subtle)] bg-[color:var(--card)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--muted-foreground-weak)]">CMS Admin</div>
            <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">ShadCN-based content editor</div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="accent" className="rounded-full">
              <Link href="/admin/pages/home/edit">Inline Edit</Link>
            </Button>
            <EditModeToggle goTo="/" />
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">View Site</Link>
            </Button>
            <AdminSessionActions email={adminSession.user.email} />
          </div>
        </div>
      </div>
      <LandingContentAdmin />
      <Toaster richColors position="top-right" />
    </div>
  );
}
