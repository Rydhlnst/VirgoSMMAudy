"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useFieldArray, useFormContext } from "react-hook-form";

export function BrandStripCMSForm() {
  const { control } = useFormContext();
  const items = useFieldArray({ control, name: "brandStrip.items" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Strip</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Brands</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => items.append({ name: "New Brand", imageUrl: "", link: "" })}
          >
            Add Brand
          </Button>
        </div>
        <Separator />
        <div className="grid gap-4">
          {items.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-5">
                <TextField name={`brandStrip.items.${idx}.name`} label="Name" placeholder="Brand name" />
              </div>
              <div className="md:col-span-3">
                <TextField name={`brandStrip.items.${idx}.link`} label="Link (optional)" placeholder="https://..." />
              </div>
              <div className="md:col-span-4">
                <ImageUrlInput
                  name={`brandStrip.items.${idx}.imageUrl`}
                  label="Image URL (optional)"
                  previewClassName="mt-0"
                />
              </div>
              <div className="md:col-span-12">
                <Button type="button" variant="outline" onClick={() => items.remove(idx)}>
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

