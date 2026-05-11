"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

function getErrorAtPath(errors: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = errors;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  if (!cur || typeof cur !== "object") return undefined;
  const maybeMessage = (cur as { message?: unknown }).message;
  return typeof maybeMessage === "string" ? maybeMessage : undefined;
}

export function TextField({
  name,
  label,
  placeholder,
  helperText,
  className,
}: {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const msg = getErrorAtPath(errors, name);

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} placeholder={placeholder} {...register(name)} />
      {helperText ? <div className="text-xs text-[color:var(--muted-foreground-weak)]">{helperText}</div> : null}
      {msg ? <div className="text-xs font-semibold text-red-600">{msg}</div> : null}
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  placeholder,
  helperText,
  className,
  rows,
}: {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  rows?: number;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const msg = getErrorAtPath(errors, name);

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} placeholder={placeholder} rows={rows} {...register(name)} />
      {helperText ? <div className="text-xs text-[color:var(--muted-foreground-weak)]">{helperText}</div> : null}
      {msg ? <div className="text-xs font-semibold text-red-600">{msg}</div> : null}
    </div>
  );
}

export function MarkdownField({
  name,
  label,
  placeholder,
  helperText,
  className,
  minHeightClassName,
}: {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  minHeightClassName?: string;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const msg = getErrorAtPath(errors, name);

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <MarkdownEditor
            value={typeof field.value === "string" ? field.value : ""}
            onChange={field.onChange}
            placeholder={placeholder}
            minHeightClassName={minHeightClassName}
          />
        )}
      />
      {helperText ? <div className="text-xs text-[color:var(--muted-foreground-weak)]">{helperText}</div> : null}
      {msg ? <div className="text-xs font-semibold text-red-600">{msg}</div> : null}
    </div>
  );
}
