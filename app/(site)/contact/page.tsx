import { LandingShell } from "@/components/landing/LandingShell";
import { Toaster } from "@/components/ui/sonner";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";
import { ContactForm } from "./_components/contact-form";
import { EditableMarkdown } from "@/components/cms/EditableMarkdown";
import { EditableText } from "@/components/cms/EditableText";
import { EditableLinkChip } from "@/components/cms/EditableLinkChip";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await readLandingPageContent();
  const c = content.contact;
  const page = content.pages.contact;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <Toaster richColors position="top-right" />

        <div className="grid gap-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <div className="inline-flex rounded-full bg-accent px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              <EditableText path="pages.contact.badge" value={page.badge} />
            </div>
            <EditableText
              path="contact.title"
              value={c.title}
              as="h1"
              className="hero-name mt-4 text-[56px] leading-[0.9] sm:text-[72px] md:text-[92px]"
            />
            <EditableMarkdown path="contact.description" value={c.description} className="mt-6 max-w-2xl text-base text-foreground/75 sm:text-lg" />

            <div className="mt-10 max-w-2xl">
              <ContactForm />
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-[44px] border border-foreground/10 bg-foreground p-6 text-background">
              <EditableText
                as="div"
                path="pages.contact.fastestLabel"
                value={page.fastestLabel}
                className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70"
              />
              <EditableText as="p" path="pages.contact.fastestText" value={page.fastestText} className="mt-3 text-sm text-background/85" />
              <Link
                href={c.emailLink?.length && c.emailLink !== "mailto:" ? c.emailLink : c.email?.length ? `mailto:${c.email}` : "#"}
                target={c.emailLink?.length && !c.emailLink.startsWith("mailto:") ? "_blank" : undefined}
                rel={c.emailLink?.length && !c.emailLink.startsWith("mailto:") ? "noreferrer" : undefined}
                className="mt-5 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
              >
                <EditableText path="contact.emailText" value={c.emailText} />
              </Link>
            </div>

            <div className="mt-6 rounded-[44px] border border-foreground/10 bg-card p-6">
              <EditableText
                as="div"
                path="pages.contact.requiredInfoLabel"
                value={page.requiredInfoLabel}
                className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60"
              />
              <div className="mt-4 grid gap-2 text-sm text-foreground/75">
                {page.requiredInfoItems.map((text, idx) => (
                  <div key={`${text}-${idx}`} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    <EditableText path={`pages.contact.requiredInfoItems.${idx}`} value={text} />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] border border-foreground/10 bg-background p-5">
                <EditableText
                  as="div"
                  path="pages.contact.socialLabel"
                  value={page.socialLabel}
                  className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.socialLinks?.map((s, idx) => (
                    <EditableLinkChip
                      key={`${s.platform}-${idx}`}
                      platformPath={`contact.socialLinks.${idx}.platform`}
                      urlPath={`contact.socialLinks.${idx}.url`}
                      platformValue={s.platform}
                      urlValue={s.url}
                      className="w-full sm:w-auto"
                    />
                  ))}
                  {!c.socialLinks?.length ? (
                    <EditableText path="pages.contact.noSocialText" value={page.noSocialText} className="text-sm text-foreground/60" />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
