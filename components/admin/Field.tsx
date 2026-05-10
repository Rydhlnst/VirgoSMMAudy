"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

function getErrorAtPath(errors: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let cur: any = errors;
  for (const p of parts) {
    if (!cur) return undefined;
    cur = cur[p];
  }
  return typeof cur?.message === "string" ? cur.message : undefined;
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
