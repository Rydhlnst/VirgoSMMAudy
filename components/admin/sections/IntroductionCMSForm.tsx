"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";

export function IntroductionCMSForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <TextField name="introduction.title" label="Section Title" placeholder="MY INTRODUCTION" />
        <MarkdownField name="introduction.description" label="Description (Markdown)" />
        <TextField name="introduction.badgeText" label="Badge Text (optional)" placeholder="Available for projects" />
        <ImageUrlInput name="introduction.imageUrl" label="Image URL" previewClassName="max-w-3xl" />
      </CardContent>
    </Card>
  );
}
