"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextAreaField, TextField } from "../Field";
import { useFieldArray, useFormContext } from "react-hook-form";

export function ContactCMSForm() {
  const { control } = useFormContext();
  const links = useFieldArray({ control, name: "contact.socialLinks" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact / CTA</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="contact.title" label="CTA Title" />
        <TextAreaField name="contact.description" label="Description" rows={4} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="contact.whatsappText" label="WhatsApp Button Text" />
          <TextField name="contact.whatsappLink" label="WhatsApp Link" placeholder="https://wa.me/628..." />
        </div>
        <TextField name="contact.email" label="Email (optional)" placeholder="hello@domain.com" />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Social Links</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => links.append({ platform: "Instagram", url: "" })}
          >
            Add Social
          </Button>
        </div>
        <Separator />
        <div className="grid gap-4">
          {links.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <TextField name={`contact.socialLinks.${idx}.platform`} label="Platform" placeholder="Instagram" />
              </div>
              <div className="md:col-span-6">
                <TextField name={`contact.socialLinks.${idx}.url`} label="URL" placeholder="https://..." />
              </div>
              <div className="md:col-span-2 md:flex md:items-end">
                <Button type="button" variant="outline" className="w-full" onClick={() => links.remove(idx)}>
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

