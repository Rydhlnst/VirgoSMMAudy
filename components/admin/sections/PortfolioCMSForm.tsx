"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TextAreaField, TextField } from "../Field";
import { Textarea } from "@/components/ui/textarea";
import { ImageUrlInput } from "../ImageUrlInput";
import { useFieldArray, useFormContext } from "react-hook-form";

function LinesField({ name, label, rows = 4 }: { name: string; label: string; rows?: number }) {
  const { setValue, watch, formState } = useFormContext();
  const value = watch(name) as unknown;
  const text = Array.isArray(value) ? value.join("\n") : "";

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        rows={rows}
        value={text}
        onChange={(e) => {
          const next = e.target.value
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
          setValue(name as any, next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        }}
      />
      {Array.isArray((formState.errors as any)?.[name]?.message) ? (
        <div className="text-xs font-semibold text-red-600">{String((formState.errors as any)[name].message)}</div>
      ) : null}
    </div>
  );
}

export function PortfolioCMSForm() {
  const { control, register } = useFormContext();
  const items = useFieldArray({ control, name: "portfolio.items" as const });
  const details = useFieldArray({ control, name: "portfolioDetails.projects" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="portfolio.title" label="Section Title" placeholder="PORTFOLIO" />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Items</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              items.append({ type: "photo", title: "New Item", thumbnailUrl: "", link: "", caption: "" });
              details.append({
                title: "New Item",
                client: "",
                brief: "",
                approach: [],
                deliverables: [],
                result: "",
              });
            }}
          >
            Add Item
          </Button>
        </div>
        <Separator />

        <div className="grid gap-4">
          {items.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor={`portfolio.items.${idx}.type`}>
                    Type
                  </label>
                  <select
                    id={`portfolio.items.${idx}.type`}
                    className="h-10 w-full rounded-2xl border border-[color:var(--border-subtle-2)] bg-[color:var(--card)] px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                    {...register(`portfolio.items.${idx}.type`)}
                  >
                    <option value="photo">photo</option>
                    <option value="video">video</option>
                  </select>
                </div>
                <TextField name={`portfolio.items.${idx}.title`} label="Title" placeholder="Project title" />
                <TextField name={`portfolio.items.${idx}.link`} label="Link (optional)" placeholder="https://..." />
              </div>
              <ImageUrlInput name={`portfolio.items.${idx}.thumbnailUrl`} label="Thumbnail URL" />
              <TextAreaField name={`portfolio.items.${idx}.caption`} label="Caption (optional)" rows={3} />
                <div className="grid gap-4 rounded-3xl border border-[color:var(--border)]/10 bg-[color:var(--overlay-1)] p-4">
                  <div className="text-sm font-semibold">Details</div>
                  <TextField name={`portfolioDetails.projects.${idx}.title`} label="Title (match item)" placeholder="Project title" />
                  <TextField name={`portfolioDetails.projects.${idx}.client`} label="Client (optional)" placeholder="Client name / type" />
                  <TextAreaField name={`portfolioDetails.projects.${idx}.brief`} label="Client brief" rows={3} />
                  <LinesField name={`portfolioDetails.projects.${idx}.approach`} label="Approach (one per line)" rows={4} />
                  <LinesField
                    name={`portfolioDetails.projects.${idx}.deliverables`}
                    label="Deliverables (one per line)"
                    rows={4}
                  />
                  <TextAreaField name={`portfolioDetails.projects.${idx}.result`} label="Result / outcome" rows={3} />
                </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    items.remove(idx);
                    details.remove(idx);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
