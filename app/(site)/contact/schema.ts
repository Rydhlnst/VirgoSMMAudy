import { z } from "zod";

export const contactEmailSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(2000),
  honeypot: z.string().optional().default(""),
});

export type ContactEmailValues = z.infer<typeof contactEmailSchema>;
export type ContactEmailInput = z.input<typeof contactEmailSchema>;
