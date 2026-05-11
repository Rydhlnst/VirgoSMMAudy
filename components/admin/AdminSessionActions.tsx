"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function AdminSessionActions({ email }: { email?: string | null }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      const response = await authClient.signOut();
      if (response.error) {
        toast.error(response.error.message || "Logout gagal.");
        return;
      }

      toast.success("Logged out.");
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout gagal.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {email ? (
        <span className="hidden text-xs text-[color:var(--muted-foreground)] sm:inline-flex">{email}</span>
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={handleSignOut} disabled={pending}>
        <LogOut className="h-4 w-4" />
        <span>{pending ? "..." : "Sign Out"}</span>
      </Button>
    </div>
  );
}

