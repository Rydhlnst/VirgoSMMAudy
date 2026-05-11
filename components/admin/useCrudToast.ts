"use client";

import { toast } from "sonner";

export function useCrudToast() {
  return {
    created(item: string) {
      toast.success(`${item} created.`);
    },
    updated(item: string) {
      toast.success(`${item} updated.`);
    },
    deleted(item: string) {
      toast.success(`${item} deleted.`);
    },
  };
}
