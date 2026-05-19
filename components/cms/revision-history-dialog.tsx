"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type HistoryItem = {
  revisionId: string;
  versionNumber: number;
  changeSummary: string | null;
  createdBy: string | null;
  createdAt: string;
};

export function RevisionHistoryDialog({ slug = "home" }: { slug?: string }) {
  const [items, setItems] = React.useState<HistoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function loadHistory() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/cms/pages/${slug}/history`);
      const json = (await response.json()) as { success: boolean; data?: { items: HistoryItem[] } };
      if (json.success) setItems(json.data?.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadHistory();
  }, []);

  return (
    <div className="rounded-2xl border border-[color:var(--border-subtle)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Revision History</h3>
        <Button type="button" size="sm" variant="outline" onClick={() => void loadHistory()} disabled={loading}>
          Refresh
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.revisionId} className="rounded-xl border border-[color:var(--border-subtle)] p-3 text-sm">
            <div className="font-medium">Version {item.versionNumber}</div>
            <div className="text-xs text-[color:var(--muted-foreground)]">{item.createdBy ?? "Admin"} · {new Date(item.createdAt).toLocaleString()}</div>
            <div className="mt-1 text-xs">{item.changeSummary ?? "Content updated."}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
