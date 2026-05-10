"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextAreaField, TextField } from "../Field";
import { useFieldArray, useFormContext } from "react-hook-form";

export function FooterCMSForm() {
  const { control } = useFormContext();
  const links = useFieldArray({ control, name: "footer.links" as const });
  const socialLinks = useFieldArray({ control, name: "footer.socialLinks" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="footer.brandName" label="Brand Name" placeholder="Audy Studio" />
          <TextField
            name="footer.copyrightText"
            label="Copyright Text"
            placeholder="© {year} Audy Studio. All rights reserved."
            helperText="Gunakan {year} untuk tahun otomatis."
          />
        </div>
        <TextAreaField
          name="footer.description"
          label="Description"
          placeholder="Short tagline / description"
          rows={3}
        />

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Footer Links</div>
          <Button type="button" variant="accent" size="sm" onClick={() => links.append({ label: "New", href: "#top" })}>
            Add Link
          </Button>
        </div>
        <div className="grid gap-4">
          {links.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-5">
                <TextField name={`footer.links.${idx}.label`} label="Label" placeholder="About" />
              </div>
              <div className="md:col-span-5">
                <TextField name={`footer.links.${idx}.href`} label="Href" placeholder="#about" />
              </div>
              <div className="md:col-span-2 md:flex md:items-end">
                <Button type="button" variant="outline" className="w-full" onClick={() => links.remove(idx)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Social Links</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => socialLinks.append({ platform: "Instagram", url: "" })}
          >
            Add Social
          </Button>
        </div>
        <div className="grid gap-4">
          {socialLinks.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-5">
                <TextField name={`footer.socialLinks.${idx}.platform`} label="Platform" placeholder="Instagram" />
              </div>
              <div className="md:col-span-5">
                <TextField name={`footer.socialLinks.${idx}.url`} label="URL" placeholder="https://instagram.com/..." />
              </div>
              <div className="md:col-span-2 md:flex md:items-end">
                <Button type="button" variant="outline" className="w-full" onClick={() => socialLinks.remove(idx)}>
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

