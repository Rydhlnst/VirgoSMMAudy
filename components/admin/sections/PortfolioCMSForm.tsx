"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { VideoUrlInput } from "../VideoUrlInput";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

function PortfolioItemRow({
  idx,
  onRemove,
}: {
  idx: number;
  onRemove: () => void;
}) {
  const { register } = useFormContext();
  const type = useWatch({ name: `portfolio.items.${idx}.type` as const }) as
    | "photo"
    | "social"
    | "video"
    | undefined;

  return (
    <div className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4">
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
            <option value="social">social</option>
            <option value="photo">photo</option>
            <option value="video">video</option>
          </select>
        </div>

        {type !== "video" ? (
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor={`portfolio.items.${idx}.slot`}>
              Slot
            </label>
            <select
              id={`portfolio.items.${idx}.slot`}
              className="h-10 w-full rounded-2xl border border-[color:var(--border-subtle-2)] bg-[color:var(--card)] px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              {...register(`portfolio.items.${idx}.slot`)}
            >
              <option value="top">top</option>
              <option value="bottom">bottom</option>
            </select>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}

        <TextField name={`portfolio.items.${idx}.title`} label="Title" placeholder="Project title" />

        {type === "video" ? (
          <VideoUrlInput
            name={`portfolio.items.${idx}.link`}
            label="Video (optional)"
            helperText="Upload a video file."
          />
        ) : (
          <ImageUrlInput
            name={`portfolio.items.${idx}.link`}
            label={`${type === "social" ? "Social image" : "Photo"} (optional)`}
            helperText="Upload a photo file."
          />
        )}
      </div>

      <ImageUrlInput name={`portfolio.items.${idx}.thumbnailUrl`} label="Thumbnail URL" />
      <TextAreaField name={`portfolio.items.${idx}.caption`} label="Caption (optional)" rows={3} />
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
}

export function PortfolioCMSForm() {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
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
              items.append({
                type: "social",
                slot: "top",
                title: "New item",
                thumbnailUrl: "",
                link: "",
                caption: "",
              });
              crudToast.created("Portfolio item");
            }}
          >
            Add Item
          </Button>
        </div>
        <Separator />

        <div className="grid gap-4">
          {items.fields.map((f, idx) => (
            <PortfolioItemRow
              key={f.id}
              idx={idx}
              onRemove={() => {
                items.remove(idx);
                crudToast.deleted("Portfolio item");
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
