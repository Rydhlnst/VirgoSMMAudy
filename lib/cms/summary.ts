import type { ChangedField } from "@/lib/cms/diff";

export function buildFriendlyChangeSummary(changedFields: ChangedField[]): string[] {
  if (changedFields.length === 0) return [];
  const added = changedFields.filter((item) => item.type === "added").length;
  const removed = changedFields.filter((item) => item.type === "removed").length;
  const updated = changedFields.filter((item) => item.type === "updated").length;

  const lines: string[] = [];
  if (updated > 0) lines.push(`${updated} field updated`);
  if (added > 0) lines.push(`${added} item added`);
  if (removed > 0) lines.push(`${removed} item removed`);

  for (const field of changedFields.slice(0, 4)) {
    lines.push(`${field.label} ${field.type}`);
  }
  return lines;
}
