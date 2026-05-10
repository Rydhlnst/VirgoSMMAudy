"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useFieldArray, useFormContext } from "react-hook-form";

export function ServicesCMSForm() {
  const { control, watch, setValue } = useFormContext();
  const items = useFieldArray({ control, name: "services.items" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="services.title" label="Title" placeholder="SERVICES & PRICELIST" />
          <TextField name="services.subtitle" label="Subtitle" placeholder="Short subtitle..." />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Service Cards</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() =>
              items.append({
                title: "Custom",
                name: "New Service",
                description: "",
                price: "",
                hoursPerWeek: "",
                includes: ["New bullet"],
                idealFor: "",
                imageUrl: "",
                buttonText: "Get Started",
                buttonLink: "#contact",
                isHighlighted: false,
              })
            }
          >
            Add Service
          </Button>
        </div>
        <Separator />

        <div className="grid gap-4">
          {items.fields.map((f, idx) => {
            const highlighted = Boolean(watch(`services.items.${idx}.isHighlighted`));
            const includes = useFieldArray({ control, name: `services.items.${idx}.includes` as const });
            return (
              <div key={f.id} className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField name={`services.items.${idx}.title`} label="Card Title (optional)" placeholder="Custom" />
                  <TextField name={`services.items.${idx}.name`} label="Name" placeholder="Service name" />
                </div>
                <TextField name={`services.items.${idx}.price`} label="Price (IDR)" placeholder="IDR 2.500.000" />
                <TextField
                  name={`services.items.${idx}.hoursPerWeek`}
                  label="Hours Per Week (optional)"
                  placeholder="10 hours per week"
                />
                <TextAreaField name={`services.items.${idx}.description`} label="Description" rows={3} />
                <ImageUrlInput name={`services.items.${idx}.imageUrl`} label="Image URL" />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField name={`services.items.${idx}.buttonText`} label="Button Text" placeholder="Get This" />
                  <TextField name={`services.items.${idx}.buttonLink`} label="Button Link" placeholder="#contact" />
                </div>

                <TextAreaField
                  name={`services.items.${idx}.idealFor`}
                  label="Ideal For (optional)"
                  placeholder="Small businesses, solo entrepreneurs, creators."
                  rows={2}
                />

                <div className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Includes</div>
                      <div className="text-xs text-[color:var(--muted-foreground-weak)]">Bullet list shown on the card.</div>
                    </div>
                    <Button type="button" variant="accent" size="sm" onClick={() => includes.append("New bullet")}>
                      Add Bullet
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {includes.fields.map((b, bIdx) => (
                      <div
                        key={b.id}
                        className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12"
                      >
                        <div className="md:col-span-10">
                          <TextField
                            name={`services.items.${idx}.includes.${bIdx}`}
                            label={`Bullet ${bIdx + 1}`}
                            placeholder="Administrative support"
                          />
                        </div>
                        <div className="md:col-span-2 md:flex md:items-end">
                          <Button type="button" variant="outline" className="w-full" onClick={() => includes.remove(bIdx)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-3xl border border-[color:var(--border)]/15 p-4">
                  <div>
                    <div className="text-sm font-semibold">Highlight Card</div>
                    <div className="text-xs text-[color:var(--muted-foreground-weak)]">Makes it appear as the main offer.</div>
                  </div>
                  <Switch
                    checked={highlighted}
                    onCheckedChange={(v) => setValue(`services.items.${idx}.isHighlighted`, v, { shouldDirty: true })}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => items.remove(idx)}>
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
