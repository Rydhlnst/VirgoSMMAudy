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
  const userAutoReplyEnabled = parseBooleanEnv(process.env.CONTACT_EMAIL_SEND_AUTO_REPLY, true);
  if (!apiKey || !from || !ownerEmail) {
    console.error("[contact] email not configured", {
      hasApiKey: Boolean(apiKey),
      fromConfigured: Boolean(from),
      ownerToConfigured: Boolean(ownerEmail),
    });
    return { ok: false, error: "Email service is not configured." };
  }

  try {
    console.log("[contact] sending email", {
      to: maskEmail(data.email),
      from,
      ownerToConfigured: Boolean(ownerEmail),
      userAutoReplyEnabled,
    });

    const resend = new Resend(apiKey);

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeSubject = escapeHtml(data.subject);
    const safeMessageHtml = escapeHtml(data.message).replaceAll("\n", "<br />");

    const ownerSubject = `New contact: ${data.subject}`;
    const ownerText = [
      "New contact form submission:",
      "",
      `- Name: ${data.name}`,
      `- Email: ${data.email}`,
      `- Subject / Business Name: ${data.subject}`,
      "",
      data.message.trim(),
    ].join("\n");

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin: 0 0 12px;">New contact form submission</h2>
        <p style="margin: 0 0 6px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin: 0 0 6px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin: 0 0 6px;"><strong>Subject / Business Name:</strong> ${safeSubject}</p>
        <p style="margin: 16px 0 6px;"><strong>Message:</strong></p>
        <p>${safeMessageHtml}</p>
      </div>
    `;

    const { error: ownerError } = await resend.emails.send({
      from,
      to: ownerEmail,
      replyTo: data.email,
      text: ownerText,
      html: ownerHtml,
      subject: ownerSubject,
    });

    if (ownerError) {
      console.error("[contact] resend owner error", {
        to: maskEmail(ownerEmail),
        error: ownerError,
      });
      return { ok: false, error: "Failed to send email." };
    }

    if (userAutoReplyEnabled) {
      const userSubject = `We received your message: ${data.subject}`;
      const userText = [
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

      const userHtml = `
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

      const { error: userError } = await resend.emails.send({
        from,
        to: data.email,
        replyTo: ownerEmail,
        text: userText,
        html: userHtml,
        subject: userSubject,
      });

      if (userError) {
        console.error("[contact] resend user error", {
          to: maskEmail(data.email),
          error: userError,
        });
      }
    }

    console.log("[contact] email sent", { toOwner: maskEmail(ownerEmail) });
    return { ok: true };
  } catch (error) {
    console.error("[contact] send error", {
      owner: maskEmail(ownerEmail ?? ""),
      error,
    });
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

function maskEmail(email: string) {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at <= 1) return "***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  return `${local[0]}***@${domain}`;
}

function parseBooleanEnv(value: string | undefined, defaultValue: boolean) {
  if (!value) return defaultValue;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return defaultValue;
}
