"use client";

import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RepeaterItem = {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  isVisible?: boolean;
};

export function RepeaterEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: RepeaterItem[];
  onChange: (items: RepeaterItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="rounded-xl border border-[color:var(--border-subtle)] p-3">
          <div className="mb-2 text-sm font-semibold">{label} {idx + 1}</div>
          <div className="grid gap-2">
            <Input
              placeholder="Card Title"
              value={item.title ?? ""}
              onChange={(event) => onChange(items.map((it, i) => (i === idx ? { ...it, title: event.target.value } : it)))}
            />
            <Textarea
              placeholder="Card Description"
              value={item.description ?? ""}
              onChange={(event) => onChange(items.map((it, i) => (i === idx ? { ...it, description: event.target.value } : it)))}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => idx > 0 && onChange(items.map((it, i) => (i === idx - 1 ? items[idx] : i === idx ? items[idx - 1] : it)))}>
                <ArrowUp className="mr-1 h-3.5 w-3.5" /> Move up
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => idx < items.length - 1 && onChange(items.map((it, i) => (i === idx + 1 ? items[idx] : i === idx ? items[idx + 1] : it)))}>
                <ArrowDown className="mr-1 h-3.5 w-3.5" /> Move down
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items.slice(0, idx + 1), { ...item, id: crypto.randomUUID() }, ...items.slice(idx + 1)])}>
                <Copy className="mr-1 h-3.5 w-3.5" /> Duplicate
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onChange(items.filter((_, i) => i !== idx))}>
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...items,
            { id: crypto.randomUUID(), title: "", description: "", isVisible: true, order: items.length + 1 },
          ])
        }
      >
        + Add Card
      </Button>
    </div>
  );
}
