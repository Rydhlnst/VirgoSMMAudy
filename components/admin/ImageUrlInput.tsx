"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";

export function ImageUrlInput({
  name,
  label,
  helperText,
  className,
  previewClassName,
}: {
  name: string;
  label: string;
  helperText?: string;
  className?: string;
  previewClassName?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const value = useWatch({ name }) as string | undefined;
  const errorMsg = (errors as any)?.[name.split(".")[0]]; // best-effort; detailed errors shown per section

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} placeholder="https://..." {...register(name)} />
      {helperText ? <div className="text-xs text-[color:var(--muted-foreground-weak)]">{helperText}</div> : null}
      {typeof value === "string" && value.length > 0 ? (
        <div
          className={cn(
            "mt-2 overflow-hidden rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-2",
            previewClassName,
          )}
        >
          <img src={value} alt="Preview" className="aspect-[4/3] w-full rounded-[22px] object-cover" loading="lazy" />
        </div>
      ) : null}
      {errorMsg ? null : null}
    </div>
  );
}
