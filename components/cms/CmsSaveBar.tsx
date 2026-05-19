"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useEditModeContext } from "./EditModeProvider";
import { Loader2 } from "lucide-react";

export function CmsSaveBar() {
  const context = useEditModeContext();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  // Hooks must be unconditional (Rules of Hooks). Keep all hooks above any returns.
  React.useEffect(() => {
    if (!context?.isEditMode) return;
    // Close confirm step automatically once state is clean or a save starts.
    if (confirmOpen && (!context.isDirty || context.isSaving)) {
      setConfirmOpen(false);
    }
  }, [confirmOpen, context?.isEditMode, context?.isDirty, context?.isSaving]);

  if (!context?.isEditMode) {
    return null;
  }

  const shouldShowStatus = context.isSaving || Boolean(context.saveError) || Boolean(context.saveMessage);

  return (
    <div className="fixed bottom-5 right-5 z-[70] w-[min(92vw,420px)]">
      <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)]/95 p-3 shadow-lg backdrop-blur">
        {shouldShowStatus ? (
          <div className="mb-2 text-sm text-[color:var(--muted-foreground)]">
            {context.isSaving ? "Saving changes..." : context.saveError ? context.saveError : context.saveMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={context.isSaving || isExiting}
            onClick={async () => {
              setIsExiting(true);
              try {
                await fetch("/api/admin/cms/edit-mode/disable", { method: "POST" });
              } finally {
                // Hard reload to ensure cookie cleared and edit provider removed.
                window.location.reload();
              }
            }}
          >
            {isExiting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Exiting...
              </span>
            ) : (
              "Exit edit"
            )}
          </Button>

          {context.isDirty ? (
            <Button type="button" variant="outline" onClick={context.resetChanges} disabled={context.isSaving}>
              Reset
            </Button>
          ) : null}

          {confirmOpen ? (
            <>
              <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={context.isSaving}>
                Cancel
              </Button>
              <Button type="button" variant="accent" onClick={context.saveChanges} disabled={context.isSaving || !context.isDirty}>
                {context.isSaving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Confirm save"
                )}
              </Button>
            </>
          ) : (
            <Button type="button" variant="accent" onClick={() => setConfirmOpen(true)} disabled={context.isSaving || !context.isDirty}>
              {context.isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving draft...
                </span>
              ) : context.isDirty ? (
                  "Save Changes"
                ) : (
                  "No changes"
                )}
            </Button>
          )}
        </div>

        {confirmOpen ? (
          <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">Saving will create a new revision version.</div>
        ) : null}
      </div>
    </div>
  );
}
