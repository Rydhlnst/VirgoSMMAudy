"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useFieldArray, useFormContext } from "react-hook-form";

export function HeroCMSForm() {
  const { control } = useFormContext();
  const tags = useFieldArray({ control, name: "hero.tags" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="hero.badge" label="Badge" placeholder="SOCIAL MEDIA MANAGER" />
          <TextField name="hero.title" label="Title" placeholder="Big bold heading..." />
        </div>
        <TextAreaField name="hero.description" label="Description" rows={4} />
        <ImageUrlInput name="hero.imageUrl" label="Hero Image URL" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="hero.ctaText" label="CTA Text" placeholder="Book a Call" />
          <TextField name="hero.ctaLink" label="CTA Link" placeholder="#contact" />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Tags</div>
          <Button type="button" variant="accent" size="sm" onClick={() => tags.append("New tag")}>
            Add Tag
          </Button>
        </div>
        <div className="grid gap-3">
          {tags.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-10">
                <TextField name={`hero.tags.${idx}`} label={`Tag ${idx + 1}`} placeholder="Content Creation" />
              </div>
              <div className="md:col-span-2 md:flex md:items-end">
                <Button type="button" variant="outline" className="w-full" onClick={() => tags.remove(idx)}>
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

