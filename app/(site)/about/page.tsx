import { LandingShell } from "@/components/landing/LandingShell";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableMarkdown } from "@/components/cms/EditableMarkdown";
import { EditableText } from "@/components/cms/EditableText";

export const dynamic = "force-dynamic";

function AboutDivider() {
  return <div className="my-12 h-px w-full bg-foreground/10" />;
}

function Tag({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/80">
      {text}
    </div>
  );
}

export default async function AboutPage() {
  const content = await readLandingPageContent();
  const about = content.about;
  const page = content.pages.about;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex rounded-full bg-[color:var(--accent)] px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              <EditableText path="pages.about.badge" value={page.badge} />
            </div>
            <EditableText
              path="about.title"
              value={about.title}
              as="h1"
              className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]"
            />
          </div>
        </div>

        {content.hero.tags.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {content.hero.tags.slice(0, 10).map((t, idx) => (
              <Tag key={`${t}-${idx}`} text={t} />
            ))}
          </div>
        ) : null}

        <AboutDivider />

        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <div className="sticky top-28 rounded-[44px] border border-foreground/10 bg-background p-6">
              <EditableText
                as="div"
                path="pages.about.profileLabel"
                value={page.profileLabel}
                className="text-xs font-black tracking-[0.22em] text-foreground/60"
              />
              <EditableText as="div" path="about.label" value={about.label} className="hero-name mt-3 text-3xl" />
              <div className="mt-6 h-0.5 w-14 bg-foreground/20" />
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-foreground p-5 text-background">
                  <EditableText
                    as="div"
                    path="pages.about.focusLabel"
                    value={page.focusLabel}
                    className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70"
                  />
                  <EditableText as="p" path="pages.about.focusText" value={page.focusText} className="mt-2 text-sm text-background/85" />
                </div>
                <div className="rounded-3xl border border-foreground/10 bg-card p-5">
                  <EditableText
                    as="div"
                    path="pages.about.availabilityLabel"
                    value={page.availabilityLabel}
                    className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60"
                  />
                  <EditableText as="p" path="pages.about.availabilityText" value={page.availabilityText} className="mt-2 text-sm text-foreground/75" />
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                  >
                    <EditableText path="pages.about.contactCtaText" value={page.contactCtaText} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-[48px] border border-foreground/10 bg-card p-6 sm:p-8">
              <EditableText
                as="div"
                path="pages.about.storyLabel"
                value={page.storyLabel}
                className="text-xs font-black tracking-[0.22em] text-foreground/60"
              />
              <EditableMarkdown path="about.description" value={about.description} className="mt-4 text-base text-foreground/80 sm:text-lg" />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {about.images.slice(0, 3).map((img, idx) => (
                  <div key={`${img.alt}-${idx}`} className="rounded-[28px] border border-foreground/10 bg-background p-3">
                    <EditableImage
                      path={`about.images.${idx}.imageUrl`}
                      src={img.imageUrl}
                      alt={img.alt}
                      className="w-full"
                      imgClassName="aspect-[4/3] w-full rounded-[22px] object-cover"
                    />
                    <EditableText path={`about.images.${idx}.alt`} value={img.alt} className="mt-3 text-xs font-semibold text-foreground/60" />
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-[36px] border border-foreground/10 bg-background p-6">
                <EditableText
                  as="div"
                  path="pages.about.notesLabel"
                  value={page.notesLabel}
                  className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60"
                />
                <EditableText as="p" path="pages.about.notesText" value={page.notesText} className="mt-3 text-sm text-foreground/75" />
              </div>
            </div>

            <div className="mt-10 w-full rounded-[48px] border border-foreground/10 bg-background p-6 sm:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <EditableText
                    as="div"
                    path="pages.about.meetTeamLabel"
                    value={page.meetTeamLabel}
                    className="text-xs font-black tracking-[0.22em] text-foreground/60"
                  />
                  <EditableText
                    as="div"
                    path="pages.about.meetTeamTitle"
                    value={page.meetTeamTitle}
                    className="hero-name mt-2 text-4xl sm:text-5xl"
                  />
                </div>
                <Link
                  href="/services"
                  className="hidden rounded-full border border-foreground/10 bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground shadow-sm transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] sm:inline-flex motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                >
                  <EditableText path="pages.about.servicesCtaText" value={page.servicesCtaText} />
                </Link>
              </div>
              {page.meetTeamDescription ? (
                <EditableMarkdown
                  path="pages.about.meetTeamDescription"
                  value={page.meetTeamDescription}
                  className="mt-4 max-w-3xl text-sm text-foreground/70 sm:text-base"
                />
              ) : null}
              <div className="mt-8 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
                {page.meetTeamMembers.map((member, idx) => (
                  <div key={`${member.name}-${idx}`} className="w-full overflow-hidden rounded-[32px] border border-foreground/10 bg-card p-4">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px]">
                      <EditableImage
                        path={`pages.about.meetTeamMembers.${idx}.imageUrl`}
                        src={member.imageUrl}
                        alt={member.name}
                        className="h-full w-full"
                        imgClassName="h-full w-full rounded-[24px] object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <EditableText path={`pages.about.meetTeamMembers.${idx}.name`} value={member.name} className="hero-name text-2xl" />
                      <EditableText
                        path={`pages.about.meetTeamMembers.${idx}.role`}
                        value={member.role}
                        className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/55"
                      />
                      {member.bio ? (
                        <EditableMarkdown
                          path={`pages.about.meetTeamMembers.${idx}.bio`}
                          value={member.bio}
                          className="mt-3 text-sm text-foreground/72"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
