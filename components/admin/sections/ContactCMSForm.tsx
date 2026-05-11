"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownField, TextField } from "../Field";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext } from "react-hook-form";

export function ContactCMSForm() {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
  const links = useFieldArray({ control, name: "contact.socialLinks" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact / CTA</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="contact.title" label="CTA Title" />
        <MarkdownField name="contact.description" label="Description (Markdown)" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="contact.emailText" label="Email Button Text" />
          <TextField name="contact.emailLink" label="Email Link" placeholder="mailto:hello@domain.com" />
        </div>
        <TextField name="contact.email" label="Email (optional)" placeholder="hello@domain.com" />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Social Links</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              links.append({ platform: "Instagram", url: "" });
              crudToast.created("Contact social link");
            }}
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    links.remove(idx);
                    crudToast.deleted("Contact social link");
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
