"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextAreaField, TextField } from "../Field";
import { ImageUrlInput } from "../ImageUrlInput";

export function BrandingCMSForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding (Before/After)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="branding.title" label="Title" />
          <TextField name="branding.description" label="Description (optional)" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField name="branding.beforeLabel" label="Before Label" />
          <TextField name="branding.afterLabel" label="After Label" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUrlInput name="branding.beforeImageUrl" label="Before Image URL" />
          <ImageUrlInput name="branding.afterImageUrl" label="After Image URL" />
        </div>
      </CardContent>
    </Card>
  );
}

