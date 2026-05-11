"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

async function call(endpoint: string) {
  const res = await fetch(endpoint, { method: "POST" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
}

export function EditModeToggle({ goTo = "/" }: { goTo?: string }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          setError(null);
          try {
            await call("/api/admin/cms/edit-mode/enable");
            window.location.href = goTo;
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to enable edit mode.");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {isLoading ? "Enabling..." : "Enable Inline Edit"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          setError(null);
          try {
            await call("/api/admin/cms/edit-mode/disable");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to disable edit mode.");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        Disable Inline Edit
      </Button>

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

