"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";
import { useFieldArray, useFormContext } from "react-hook-form";

export function WorkProcessCMSForm() {
  const { control } = useFormContext();
  const steps = useFieldArray({ control, name: "workProcess.steps" as const });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Process</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="workProcess.title" label="Section Title" placeholder="MY WORK PROCESS" />

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Steps</div>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => steps.append({ number: "01", title: "New Step", description: "", icon: "" })}
          >
            Add Step
          </Button>
        </div>
        <Separator />

        <div className="grid gap-4">
          {steps.fields.map((f, idx) => (
            <div key={f.id} className="grid gap-4 rounded-3xl border border-[color:var(--border)]/15 p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <TextField name={`workProcess.steps.${idx}.number`} label="Number" placeholder="01" />
                <TextField name={`workProcess.steps.${idx}.title`} label="Title" placeholder="Audit" />
                <ImageUrlInput name={`workProcess.steps.${idx}.icon`} label="Step Image URL (optional)" />
              </div>
              <TextAreaField name={`workProcess.steps.${idx}.description`} label="Description" rows={3} />
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => steps.remove(idx)}>
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
