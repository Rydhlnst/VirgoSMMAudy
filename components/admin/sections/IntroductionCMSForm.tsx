"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";

export function IntroductionCMSForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="introduction.title" label="Section Title" placeholder="MY INTRODUCTION" />
        <TextAreaField name="introduction.description" label="Description" rows={5} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="introduction.badgeText" label="Badge Text (optional)" placeholder="Available for projects" />
          <ImageUrlInput name="introduction.imageUrl" label="Image URL" />
        </div>
      </CardContent>
    </Card>
  );
}

