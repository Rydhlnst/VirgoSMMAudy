export type ChangedField = {
  path: string;
  type: "added" | "removed" | "updated";
  label: string;
  before: unknown;
  after: unknown;
};

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((key) => `${key}:${stableStringify(obj[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function labelFromPath(path: string) {
  const cleaned = path
    .replace(/\[(\d+)\]/g, " $1 ")
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Content";
  return cleaned.replace(/\b\w/g, (m) => m.toUpperCase());
}

function getItemId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const candidate = (value as Record<string, unknown>).id;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : null;
}

function diffArray(before: unknown[], after: unknown[], path: string): ChangedField[] {
  const beforeById = new Map<string, unknown>();
  const afterById = new Map<string, unknown>();
  const beforeNoId: Array<{ idx: number; value: unknown }> = [];
  const afterNoId: Array<{ idx: number; value: unknown }> = [];

  before.forEach((item, idx) => {
    const id = getItemId(item);
    if (id) beforeById.set(id, item);
    else beforeNoId.push({ idx, value: item });
  });
  after.forEach((item, idx) => {
    const id = getItemId(item);
    if (id) afterById.set(id, item);
    else afterNoId.push({ idx, value: item });
  });

  const fields: ChangedField[] = [];
  for (const [id, nextValue] of afterById) {
    if (!beforeById.has(id)) {
      fields.push({ path: `${path}[id=${id}]`, type: "added", label: `${labelFromPath(path)} Item Added`, before: null, after: nextValue });
      continue;
    }
    fields.push(...diffValues(beforeById.get(id), nextValue, `${path}[id=${id}]`));
  }

  for (const [id, prevValue] of beforeById) {
    if (!afterById.has(id)) {
      fields.push({ path: `${path}[id=${id}]`, type: "removed", label: `${labelFromPath(path)} Item Removed`, before: prevValue, after: null });
    }
  }

  const maxNoId = Math.max(beforeNoId.length, afterNoId.length);
  for (let i = 0; i < maxNoId; i += 1) {
    const prev = beforeNoId[i]?.value;
    const next = afterNoId[i]?.value;
    if (prev === undefined && next !== undefined) {
      fields.push({ path: `${path}[${i}]`, type: "added", label: `${labelFromPath(path)} ${i + 1} Added`, before: null, after: next });
      continue;
    }
    if (prev !== undefined && next === undefined) {
      fields.push({ path: `${path}[${i}]`, type: "removed", label: `${labelFromPath(path)} ${i + 1} Removed`, before: prev, after: null });
      continue;
    }
    fields.push(...diffValues(prev, next, `${path}[${i}]`));
  }

  return fields;
}

export function diffValues(before: unknown, after: unknown, path = ""): ChangedField[] {
  if (stableStringify(before) === stableStringify(after)) return [];
  if (before === undefined) {
    return [{ path, type: "added", label: labelFromPath(path), before: null, after }];
  }
  if (after === undefined) {
    return [{ path, type: "removed", label: labelFromPath(path), before, after: null }];
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    if (!Array.isArray(before) || !Array.isArray(after)) {
      return [{ path, type: "updated", label: labelFromPath(path), before, after }];
    }
    return diffArray(before, after, path);
  }
  const beforeObj = before && typeof before === "object" ? (before as Record<string, unknown>) : null;
  const afterObj = after && typeof after === "object" ? (after as Record<string, unknown>) : null;
  if (!beforeObj || !afterObj) {
    return [{ path, type: "updated", label: labelFromPath(path), before, after }];
  }

  const allKeys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);
  const changed: ChangedField[] = [];
  for (const key of allKeys) {
    const nextPath = path ? `${path}.${key}` : key;
    changed.push(...diffValues(beforeObj[key], afterObj[key], nextPath));
  }
  return changed;
}
