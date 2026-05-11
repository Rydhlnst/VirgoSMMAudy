"use client";

import * as React from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    setPending(true);
    try {
      const response = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (response.error) {
        toast.error(response.error.message || "Login gagal.");
        return;
      }

      toast.success("Login berhasil.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@domain.com"
          autoComplete="email"
          disabled={pending}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
          autoComplete="current-password"
          disabled={pending}
          required
        />
      </div>

      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        <span>{pending ? "Signing in..." : "Sign In"}</span>
      </Button>
    </form>
  );
}

