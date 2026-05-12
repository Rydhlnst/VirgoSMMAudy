"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { contactEmailSchema, type ContactEmailInput } from "../schema";
import { sendContactEmail } from "../actions";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ContactEmailInput>({
    resolver: zodResolver(contactEmailSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ContactEmailInput> = (values) => {
    startTransition(async () => {
      const result = await sendContactEmail(values);
      console.log("[contact] sendContactEmail result", result);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Email sent. Thank you!");
      form.reset();
    });
  };

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = form;

  return (
    <Card className="rounded-[44px] border border-foreground/10 bg-card p-6 sm:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" placeholder="Name" {...register("name")} />
          {errors.name?.message ? <p className="text-sm text-red-500">{errors.name.message}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="subject">Business Name</Label>
          <Input id="subject" placeholder="Business Name" {...register("subject")} />
          {errors.subject?.message ? <p className="text-sm text-red-500">{errors.subject.message}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="Email" {...register("email")} />
          {errors.email?.message ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={7} placeholder="What do you need support with?" {...register("message")} />
          {errors.message?.message ? <p className="text-sm text-red-500">{errors.message.message}</p> : null}
        </div>

        <div className="hidden">
          <Label htmlFor="honeypot">Company</Label>
          <Input id="honeypot" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-accent px-7 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground hover:bg-[color:var(--accent)]/90"
          >
            {isPending ? "Sending..." : "Send Email"}
          </Button>
          <p className="text-sm text-foreground/60">We&apos;ll reply as soon as possible.</p>
        </div>
      </form>
    </Card>
  );
}
