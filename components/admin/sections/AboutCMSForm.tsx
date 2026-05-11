"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext } from "react-hook-form";

export function AboutCMSForm() {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
  const images = useFieldArray({ control, name: "about.images" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="about.title" label="Title" placeholder="ABOUT ME" />
          <TextField name="about.label" label="Label" placeholder="Who I am?" />
        </div>
        <MarkdownField name="about.description" label="Description (Markdown)" />

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Images</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              images.append({ imageUrl: "", alt: "About image" });
              crudToast.created("About image");
            }}
          >
            Add Image
          </Button>
        </div>
        <div className="grid gap-4">
          {images.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-6">
                <ImageUrlInput name={`about.images.${idx}.imageUrl`} label="Image URL" />
              </div>
              <div className="md:col-span-4">
                <TextField name={`about.images.${idx}.alt`} label="Alt" placeholder="Portrait" />
              </div>
              <div className="md:col-span-2 md:flex md:items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    images.remove(idx);
                    crudToast.deleted("About image");
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
