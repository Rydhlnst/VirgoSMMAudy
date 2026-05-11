"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext } from "react-hook-form";

function BulletsEditor({ name }: { name: `servicesDetails.${"categories" | "industries"}.${number}.bullets` }) {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
  const bullets = useFieldArray({ control, name });

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Bullets</div>
        <Button
          type="button"
          variant="accent"
          size="sm"
          onClick={() => {
            bullets.append("New bullet");
            crudToast.created("Support bullet");
          }}
        >
          Add Bullet
        </Button>
      </div>
      <div className="grid gap-3">
        {bullets.fields.map((b, idx) => (
          <div
            key={b.id}
            className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12"
          >
            <div className="md:col-span-10">
              <TextField name={`${name}.${idx}`} label={`Bullet ${idx + 1}`} placeholder="Email & inbox management" />
            </div>
            <div className="md:col-span-2 md:flex md:items-end">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  bullets.remove(idx);
                  crudToast.deleted("Support bullet");
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportItemEditor({
  index,
  group,
  onRemove,
}: {
  index: number;
  group: "categories" | "industries";
  onRemove: () => void;
}) {
  const base = `servicesDetails.${group}.${index}` as const;

  return (
    <div className="grid gap-4 rounded-[34px] border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="hero-name text-lg">{group === "categories" ? "Category" : "Industry"}</div>
        <Button type="button" variant="outline" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField name={`${base}.title`} label="Title" placeholder="Administrative Support" />
        <TextField name={`${base}.slug`} label="Slug" placeholder="administrative-support" helperText="lowercase, gunakan '-'." />
      </div>
      <MarkdownField name={`${base}.description`} label="Description (Markdown, optional)" />
      <ImageUrlInput name={`${base}.heroImageUrl`} label="Hero Image URL (optional)" />
      <BulletsEditor name={`${base}.bullets`} />
    </div>
  );
}

export function ServicesDetailsCMSForm() {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
  const categories = useFieldArray({ control, name: "servicesDetails.categories" as const });
  const industries = useFieldArray({ control, name: "servicesDetails.industries" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virgo Social Services (Details Pages)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="servicesDetails.name" label="Service Name" placeholder="Virgo Social Services" />
          <TextField name="services.viewAllLink" label="Landing View-All Link" placeholder="/services" />
        </div>
        <MarkdownField name="servicesDetails.intro" label="Intro (Markdown, optional)" />

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Support Categories</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              categories.append({
                slug: "new-category",
                title: "New Category",
                description: "",
                heroImageUrl: "",
                bullets: ["New bullet"],
              });
              crudToast.created("Support category");
            }}
          >
            Add Category
          </Button>
        </div>
        <div className="grid gap-5">
          {categories.fields.map((f, idx) => (
            <SupportItemEditor
              key={f.id}
              index={idx}
              group="categories"
              onRemove={() => {
                categories.remove(idx);
                crudToast.deleted("Support category");
              }}
            />
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Industry-Specific Support</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              industries.append({
                slug: "new-industry",
                title: "New Industry",
                description: "",
                heroImageUrl: "",
                bullets: ["New bullet"],
              });
              crudToast.created("Support industry");
            }}
          >
            Add Industry
          </Button>
        </div>
        <div className="grid gap-5">
          {industries.fields.map((f, idx) => (
            <SupportItemEditor
              key={f.id}
              index={idx}
              group="industries"
              onRemove={() => {
                industries.remove(idx);
                crudToast.deleted("Support industry");
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
