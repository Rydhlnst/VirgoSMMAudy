export const CMS_SECTION_KEYS = [
  "navbar",
  "hero",
  "brandStrip",
  "introduction",
  "about",
  "portfolio",
  "services",
  "servicesDetails",
  "testimonials",
  "branding",
  "workProcess",
  "contact",
  "footer",
  "pages.about",
  "pages.contact",
  "pages.portfolio",
  "pages.services",
] as const;

export type CmsSectionKey = (typeof CMS_SECTION_KEYS)[number];

export function sectionKeyToBlockKey(page: string, section: CmsSectionKey): string {
  return `${page}:${section}`;
}

export function getValueAtPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc) && /^\d+$/.test(key)) return acc[Number(key)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

export function setValueAtPath(source: unknown, path: string, value: unknown): unknown {
  const keys = path.split(".");
  const [head, ...rest] = keys;
  if (!head) return source;

  const isIndex = /^\d+$/.test(head);
  const index = isIndex ? Number(head) : -1;

  if (rest.length === 0) {
    if (isIndex) {
      const arr = Array.isArray(source) ? [...source] : [];
      arr[index] = value;
      return arr;
    }
    const obj = source && typeof source === "object" ? { ...(source as Record<string, unknown>) } : {};
    obj[head] = value;
    return obj;
  }

  if (isIndex) {
    const arr = Array.isArray(source) ? [...source] : [];
    arr[index] = setValueAtPath(arr[index], rest.join("."), value);
    return arr;
  }

  const obj = source && typeof source === "object" ? { ...(source as Record<string, unknown>) } : {};
  obj[head] = setValueAtPath(obj[head], rest.join("."), value);
  return obj;
}
