import type { CmsContent } from "./cms-content.types";

export type CmsAuditIssueKind =
  | "duplicate_identical"
  | "empty_value"
  | "placeholder_value";

export type CmsAuditIssue = {
  path: string;
  kind: CmsAuditIssueKind;
  message: string;
};

export type CmsAuditSummary = {
  section: string;
  itemCount: number;
  duplicateCount: number;
  emptyCount: number;
  placeholderCount: number;
};

export type CmsAuditReport = {
  summary: CmsAuditSummary[];
  issues: CmsAuditIssue[];
  fingerprints: Record<string, string>;
};

type DiffEntry = {
  path: string;
  value: unknown;
};

const PLACEHOLDER_PATTERNS = [
  /^team member\b/i,
  /^support specialist\b/i,
  /^click to edit\b/i,
  /^placeholder\b/i,
  /^lorem ipsum\b/i,
  /^new item\b/i,
];

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hashString(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function isEmptyValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (value === null || value === undefined) {
    return true;
  }
  return false;
}

function isPlaceholderValue(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function getByPath(source: unknown, path: string): unknown {
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

function setByPath(source: unknown, path: string, nextValue: unknown): unknown {
  const keys = path.split(".");
  const [head, ...rest] = keys;
  if (!head) return source;

  const keyIsIndex = /^\d+$/.test(head);
  const index = keyIsIndex ? Number(head) : -1;

  if (rest.length === 0) {
    if (keyIsIndex) {
      const arr = Array.isArray(source) ? [...source] : [];
      arr[index] = nextValue;
      return arr;
    }
    const obj = source && typeof source === "object" ? { ...(source as Record<string, unknown>) } : {};
    obj[head] = nextValue;
    return obj;
  }

  if (keyIsIndex) {
    const arr = Array.isArray(source) ? [...source] : [];
    arr[index] = setByPath(arr[index], rest.join("."), nextValue);
    return arr;
  }

  const obj = source && typeof source === "object" ? { ...(source as Record<string, unknown>) } : {};
  obj[head] = setByPath(obj[head], rest.join("."), nextValue);
  return obj;
}

export function hasPath(source: unknown, path: string): boolean {
  const keys = path.split(".");
  let cursor: unknown = source;

  for (const key of keys) {
    if (cursor === null || cursor === undefined) return false;
    if (Array.isArray(cursor)) {
      if (!/^\d+$/.test(key)) return false;
      const index = Number(key);
      if (index < 0 || index >= cursor.length) return false;
      cursor = cursor[index];
      continue;
    }
    if (typeof cursor === "object") {
      const obj = cursor as Record<string, unknown>;
      if (!(key in obj)) return false;
      cursor = obj[key];
      continue;
    }
    return false;
  }

  return true;
}

export function applyContentPathChanges(
  base: CmsContent,
  changes: Array<{ path: string; value: unknown }>,
): CmsContent {
  let next: unknown = base;
  for (const change of changes) {
    next = setByPath(next, change.path, change.value);
  }
  return next as CmsContent;
}

export function diffContentPaths(before: unknown, after: unknown, basePath = ""): DiffEntry[] {
  if (stableStringify(before) === stableStringify(after)) {
    return [];
  }

  const beforeIsArray = Array.isArray(before);
  const afterIsArray = Array.isArray(after);
  if (beforeIsArray || afterIsArray) {
    if (!beforeIsArray || !afterIsArray) {
      return [{ path: basePath || "$", value: after }];
    }
    const beforeArr = before as unknown[];
    const afterArr = after as unknown[];
    if (beforeArr.length !== afterArr.length) {
      return [{ path: basePath || "$", value: after }];
    }
    const next: DiffEntry[] = [];
    for (let i = 0; i < afterArr.length; i += 1) {
      const path = basePath ? `${basePath}.${i}` : `${i}`;
      next.push(...diffContentPaths(beforeArr[i], afterArr[i], path));
    }
    return next;
  }

  const beforeObj = before && typeof before === "object" ? (before as Record<string, unknown>) : null;
  const afterObj = after && typeof after === "object" ? (after as Record<string, unknown>) : null;
  if (!beforeObj || !afterObj) {
    return [{ path: basePath || "$", value: after }];
  }

  const allKeys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);
  const entries: DiffEntry[] = [];
  for (const key of allKeys) {
    const path = basePath ? `${basePath}.${key}` : key;
    entries.push(...diffContentPaths(beforeObj[key], afterObj[key], path));
  }
  return entries;
}

export function dedupeIdenticalArrayItems<T>(input: T[]): { next: T[]; removedIndexes: number[] } {
  const seen = new Set<string>();
  const next: T[] = [];
  const removedIndexes: number[] = [];

  input.forEach((item, index) => {
    const fingerprint = stableStringify(item);
    if (seen.has(fingerprint)) {
      removedIndexes.push(index);
      return;
    }
    seen.add(fingerprint);
    next.push(item);
  });

  return { next, removedIndexes };
}

export function createCmsAuditReport(content: CmsContent): CmsAuditReport {
  const issues: CmsAuditIssue[] = [];
  const summaryMap = new Map<string, CmsAuditSummary>();
  const fingerprints: Record<string, string> = {};

  function ensureSummary(section: string) {
    const existing = summaryMap.get(section);
    if (existing) return existing;
    const next: CmsAuditSummary = {
      section,
      itemCount: 0,
      duplicateCount: 0,
      emptyCount: 0,
      placeholderCount: 0,
    };
    summaryMap.set(section, next);
    return next;
  }

  function sectionFromPath(path: string): string {
    const [head, second] = path.split(".");
    if (!head) return "root";
    if (head === "pages" && second) return `${head}.${second}`;
    return head;
  }

  function walk(value: unknown, path: string) {
    const section = sectionFromPath(path);
    const summary = ensureSummary(section);

    const currentFingerprint = hashString(stableStringify(value));
    if (path) {
      fingerprints[path] = currentFingerprint;
    }

    if (Array.isArray(value)) {
      summary.itemCount += value.length;
      const grouped = new Map<string, number[]>();
      value.forEach((item, index) => {
        const fp = stableStringify(item);
        const list = grouped.get(fp) ?? [];
        list.push(index);
        grouped.set(fp, list);
      });

      for (const [, indexes] of grouped) {
        if (indexes.length > 1) {
          summary.duplicateCount += indexes.length - 1;
          issues.push({
            path,
            kind: "duplicate_identical",
            message: `Found ${indexes.length} identical items at indexes ${indexes.join(", ")}.`,
          });
        }
      }

      value.forEach((item, index) => {
        const nextPath = path ? `${path}.${index}` : `${index}`;
        walk(item, nextPath);
      });
      return;
    }

    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        const nextPath = path ? `${path}.${key}` : key;
        walk(child, nextPath);
      }
      return;
    }

    if (isEmptyValue(value)) {
      summary.emptyCount += 1;
      issues.push({
        path,
        kind: "empty_value",
        message: "Value is empty.",
      });
    } else if (isPlaceholderValue(value)) {
      summary.placeholderCount += 1;
      issues.push({
        path,
        kind: "placeholder_value",
        message: "Value looks like placeholder text.",
      });
    }
  }

  walk(content, "");

  return {
    summary: [...summaryMap.values()],
    issues,
    fingerprints,
  };
}

export function buildChangesFromPaths(
  base: CmsContent,
  target: CmsContent,
  paths: string[],
): Array<{ path: string; value: unknown }> {
  return paths.map((path) => ({
    path,
    value: getByPath(target, path),
  }));
}
