"use server";

import { contactEmailSchema, type ContactEmailInput } from "./schema";
import { Resend } from "resend";


export type SendContactEmailResult = { ok: true } | { ok: false; error: string };

export async function sendContactEmail(values: ContactEmailInput): Promise<SendContactEmailResult> {
  const parsed = contactEmailSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Invalid form data." };

  const data = parsed.data;
  if (data.honeypot?.trim()) return { ok: true };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const ownerEmail = process.env.CONTACT_EMAIL_TO?.trim();
  const replyTo = process.env.CONTACT_EMAIL_REPLY_TO?.trim() ?? ownerEmail;
  if (!apiKey || !from) return { ok: false, error: "Email service is not configured." };

  try {
    const resend = new Resend(apiKey);

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeSubject = escapeHtml(data.subject);
    const safeMessageHtml = escapeHtml(data.message).replaceAll("\n", "<br />");

    const subject = `We received your message: ${data.subject}`;
    const text = [
      `Hi ${data.name},`,
      "",
      "Thanks for contacting us. We have received your message and will get back to you soon.",
      "",
      "Your submission:",
      `- Name: ${data.name}`,
      `- Email: ${data.email}`,
      `- Subject / Business Name: ${data.subject}`,
      "",
      data.message.trim(),
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <p>Hi ${safeName},</p>
        <p>Thanks for contacting us. We have received your message and will get back to you soon.</p>
        <hr />
        <h3>Your submission</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject / Business Name:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessageHtml}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to: data.email,
      ...(ownerEmail ? { bcc: ownerEmail } : {}),
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
      subject,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return { ok: false, error: "Failed to send email." };
    }

    return { ok: true };
  } catch (error) {
    console.error("[contact] send error", error);
    return { ok: false, error: "Failed to send email." };
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
