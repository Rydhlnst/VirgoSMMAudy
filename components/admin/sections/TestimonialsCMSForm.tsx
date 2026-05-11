"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownField, TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext } from "react-hook-form";

export function TestimonialsCMSForm() {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
  const items = useFieldArray({ control, name: "testimonials.items" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="testimonials.title" label="Section Title" placeholder="TESTIMONIALS" />
        <MarkdownField name="testimonials.description" label="Section Description (Markdown, optional)" />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Items</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              items.append({
                name: "New Client",
                role: "",
                workTitle: "",
                description: "",
                quote: "Great work!",
                workImageUrl: "",
                imageUrl: "",
              });
              crudToast.created("Testimonial");
            }}
          >
            Add Testimonial
          </Button>
        </div>
        <Separator />

        <div className="grid gap-4">
          {items.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name={`testimonials.items.${idx}.name`} label="Name" placeholder="Client name" />
                <TextField name={`testimonials.items.${idx}.role`} label="Role (optional)" placeholder="Founder" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField name={`testimonials.items.${idx}.workTitle`} label="Work Title (optional)" placeholder="Project name" />
                <MarkdownField
                  name={`testimonials.items.${idx}.description`}
                  label="Work Description (Markdown, optional)"
                  minHeightClassName="min-h-[130px]"
                />
              </div>
              <TextAreaField name={`testimonials.items.${idx}.quote`} label="Quote" rows={4} />
              <div className="grid gap-4 md:grid-cols-2">
                <ImageUrlInput name={`testimonials.items.${idx}.workImageUrl`} label="Work Image URL (optional)" />
                <ImageUrlInput name={`testimonials.items.${idx}.imageUrl`} label="Client Image URL (optional)" />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    items.remove(idx);
                    crudToast.deleted("Testimonial");
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
