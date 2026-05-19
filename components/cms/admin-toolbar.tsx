"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminToolbar({ editMode = true }: { editMode?: boolean }) {
  return (
    <div className="fixed right-4 top-4 z-[80] rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)]/95 px-3 py-2 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold">MiawCMS</span>
        <span className="text-[color:var(--muted-foreground)]">Edit Mode: {editMode ? "ON" : "OFF"}</span>
        <Button asChild size="sm" variant="outline"><Link href="/admin">Content</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href="/admin">History</Link></Button>
      </div>
    </div>
  );
}
