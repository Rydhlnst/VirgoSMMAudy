"use client";

import * as React from "react";
import type { CmsContent } from "@/lib/cms/cms-content.types";
import { diffContentPaths } from "@/lib/cms/content-audit";

type SaveResult = {
  title: string;
  contentJson: CmsContent;
  noChanges?: boolean;
  changeSummary?: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function setValueByPath(source: unknown, path: string, nextValue: unknown): unknown {
  const keys = path.split(".");
  const [head, ...rest] = keys;
  if (!head) {
    return source;
  }

  const keyIsIndex = /^\d+$/.test(head);
  const index = keyIsIndex ? Number(head) : -1;

  if (rest.length === 0) {
    if (keyIsIndex) {
      const arr = Array.isArray(source) ? [...source] : [];
      arr[index] = nextValue;
      return arr;
    }

    const obj = isRecord(source) ? { ...source } : {};
    obj[head] = nextValue;
    return obj;
  }

  if (keyIsIndex) {
    const arr = Array.isArray(source) ? [...source] : [];
    arr[index] = setValueByPath(arr[index], rest.join("."), nextValue);
    return arr;
  }

  const obj = isRecord(source) ? { ...source } : {};
  obj[head] = setValueByPath(obj[head], rest.join("."), nextValue);
  return obj;
}

function getValueByPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc) && /^\d+$/.test(key)) {
      return acc[Number(key)];
    }
    if (typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export type CmsEditState = {
  slug: string;
  title: string;
  content: CmsContent;
  originalContent: CmsContent;
  isEditMode: boolean;
  isDirty: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  pendingPublishCount: number;
  updateField: (path: string, value: unknown) => void;
  getFieldValue: (path: string) => unknown;
  saveChanges: () => Promise<void>;
  publishLatestDraft: () => Promise<void>;
  resetChanges: () => void;
};

const EditModeContext = React.createContext<CmsEditState | null>(null);

export function useEditModeContext() {
  return React.useContext(EditModeContext);
}

export function EditModeProvider({
  slug,
  initialTitle,
  initialContent,
  isEditMode = false,
  children,
}: {
  slug: string;
  initialTitle: string;
  initialContent: CmsContent;
  isEditMode?: boolean;
  children: React.ReactNode;
}) {
  const [title, setTitle] = React.useState(initialTitle);
  const [content, setContent] = React.useState(initialContent);
  const [originalContent, setOriginalContent] = React.useState(initialContent);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [pendingPublishCount, setPendingPublishCount] = React.useState(0);

  const isDirty = React.useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(originalContent);
  }, [content, originalContent]);

  const updateField = React.useCallback((path: string, value: unknown) => {
    setContent((prev) => setValueByPath(prev, path, value) as CmsContent);
  }, []);

  const getFieldValue = React.useCallback(
    (path: string) => getValueByPath(content, path),
    [content],
  );

  const resetChanges = React.useCallback(() => {
    setContent(originalContent);
    setSaveError(null);
    setSaveMessage(null);
  }, [originalContent]);

  const saveChanges = React.useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      const changes = diffContentPaths(originalContent, content).filter((entry) => entry.path !== "$");
      if (changes.length === 0) {
        setSaveMessage("No changes.");
        return;
      }

      const response = await fetch(`/api/admin/cms/pages/${slug}/content-paths`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          contentJson: content,
        }),
      });

      const json = (await response.json()) as
        | { success: true; data: SaveResult }
        | { success: false; error?: { message?: string } };

      if (!json.success) {
        throw new Error(json.error?.message || "Failed to save CMS content.");
      }

      setTitle(json.data.title);
      setOriginalContent(json.data.contentJson);
      setContent(json.data.contentJson);
      setPendingPublishCount(0);
      if (json.data.noChanges) {
        setSaveMessage("No changes detected.");
      } else {
        setSaveMessage(json.data.changeSummary?.[0] ?? "Changes saved as a new revision.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save CMS content.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }, [content, originalContent, slug, title]);

  const publishLatestDraft = React.useCallback(async () => {}, []);

  const contextValue = React.useMemo<CmsEditState>(
    () => ({
      slug,
      title,
      content,
      originalContent,
      isEditMode,
      isDirty,
      isSaving,
      pendingPublishCount,
      saveMessage,
      saveError,
      updateField,
      getFieldValue,
      saveChanges,
      publishLatestDraft,
      resetChanges,
    }),
    [
      content,
      getFieldValue,
      isDirty,
      isEditMode,
      isSaving,
      pendingPublishCount,
      originalContent,
      publishLatestDraft,
      resetChanges,
      saveChanges,
      saveError,
      saveMessage,
      slug,
      title,
      updateField,
    ],
  );

  return <EditModeContext.Provider value={contextValue}>{children}</EditModeContext.Provider>;
}
