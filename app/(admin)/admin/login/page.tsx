import { AlertTriangle, Shield } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminSessionActions } from "@/components/admin/AdminSessionActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (isAdminSession(session)) {
    redirect("/admin");
  }

  const { reason } = await searchParams;
  const showUnauthorizedMessage = reason === "unauthorized";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] p-4">
      <Card className="w-full max-w-md border-[color:var(--border-subtle)]">
        <CardHeader className="space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
            <Shield className="h-5 w-5" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in dengan akun admin untuk mengakses CMS.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {showUnauthorizedMessage ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Sesi kamu belum memiliki akses admin. Gunakan akun admin yang terdaftar.</span>
            </div>
          ) : null}
          {session?.user ? (
            <div className="rounded-md border border-[color:var(--border-subtle)] p-3 text-xs text-[color:var(--muted-foreground)]">
              <div className="mb-2">Current signed-in user: {session.user.email ?? "unknown"}</div>
              <AdminSessionActions email={session.user.email} />
            </div>
          ) : null}
          <AdminLoginForm />
          <Button asChild variant="ghost" className="justify-start px-0">
            <Link href="/">Back to landing page</Link>
          </Button>
        </CardContent>
      </Card>
      <Toaster richColors position="top-right" />
    </div>
  );
}
