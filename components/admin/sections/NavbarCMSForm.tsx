"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextField } from "../Field";
import { useCrudToast } from "../useCrudToast";
import { useFieldArray, useFormContext } from "react-hook-form";

export function NavbarCMSForm() {
  const crudToast = useCrudToast();
  const { control } = useFormContext();
  const menu = useFieldArray({ control, name: "navbar.menu" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navbar</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="navbar.brandName" label="Brand Name" placeholder="Virgo Social" />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="navbar.ctaText" label="CTA Text" placeholder="Let's Talk" />
            <TextField name="navbar.ctaLink" label="CTA Link" placeholder="#contact" />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Menu Items</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => {
              menu.append({ label: "New", href: "#section" });
              crudToast.created("Navbar menu item");
            }}
          >
            Add Item
          </Button>
        </div>
        <div className="grid gap-4">
          {menu.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-3 rounded-3xl border border-[color:var(--border)]/15 p-4 md:grid-cols-12">
              <div className="md:col-span-5">
                <TextField name={`navbar.menu.${idx}.label`} label="Label" placeholder="About" />
              </div>
              <div className="md:col-span-5">
                <TextField name={`navbar.menu.${idx}.href`} label="Href" placeholder="#about" />
              </div>
              <div className="md:col-span-2 md:flex md:items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    menu.remove(idx);
                    crudToast.deleted("Navbar menu item");
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
