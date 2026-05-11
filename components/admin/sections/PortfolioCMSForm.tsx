"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext } from "react-hook-form";

export function PortfolioCMSForm() {
  const crudToast = useCrudToast();
  const { control, register } = useFormContext();
  const items = useFieldArray({ control, name: "portfolio.items" as const });

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
              crudToast.created("Portfolio item");
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
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    items.remove(idx);
                    crudToast.deleted("Portfolio item");
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
