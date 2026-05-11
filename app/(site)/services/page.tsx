import { LandingShell } from "@/components/landing/LandingShell";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableMarkdown } from "@/components/cms/EditableMarkdown";
import { EditableText } from "@/components/cms/EditableText";

export const dynamic = "force-dynamic";

function ServicesDivider() {
  return <div className="my-12 h-px w-full bg-foreground/10" />;
}

function ServiceCard({
  href,
  title,
  description,
  pointsText,
  detailText,
  imagePath,
  imageUrl,
  titlePath,
  descriptionPath,
}: {
  href: string;
  title: string;
  description?: string;
  pointsText: string;
  detailText: string;
  imagePath: string;
  imageUrl?: string;
  titlePath: string;
  descriptionPath?: string;
}) {
  return (
    <div className="group rounded-[44px] border border-foreground/10 bg-card p-5 transition motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0">
      <EditableImage path={imagePath} src={imageUrl} alt={title} imgClassName="aspect-[4/3] w-full rounded-[34px] object-cover" />
      <div className="mt-5">
        <EditableText as="h3" path={titlePath} value={title} className="hero-name text-2xl" />
        {description ? (
          <EditableMarkdown path={descriptionPath || ""} value={description} className="mt-2 text-sm text-foreground/70" />
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">
            {pointsText}
          </div>
          <Link
            href={href}
            className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
          >
            {detailText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ServicesPage() {
  const content = await readLandingPageContent();
  const details = content.servicesDetails;
  const page = content.pages.services;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex rounded-full bg-[color:var(--accent)] px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              <EditableText path="pages.services.badge" value={page.badge} />
            </div>
            <EditableText
              path="servicesDetails.name"
              value={details.name}
              as="h1"
              className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]"
            />
            {details.intro ? (
              <EditableMarkdown path="servicesDetails.intro" value={details.intro} className="mt-6 max-w-2xl text-base text-foreground/75 sm:text-lg" />
            ) : null}
          </div>
          <div className="md:col-span-5">
            <div className="rounded-[52px] border border-foreground/10 bg-foreground p-6 text-background">
              <EditableText
                as="div"
                path="pages.services.howToChooseLabel"
                value={page.howToChooseLabel}
                className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70"
              />
              <EditableText
                as="p"
                path="pages.services.howToChooseText"
                value={page.howToChooseText}
                className="mt-3 text-sm text-background/85"
              />
              <Link
                href="/contact"
                className="mt-5 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
              >
                <EditableText path="pages.services.checkAvailabilityCtaText" value={page.checkAvailabilityCtaText} />
              </Link>
            </div>
          </div>
        </div>

        <ServicesDivider />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="rounded-[44px] border border-foreground/10 bg-background p-6">
              <EditableText
                as="div"
                path="pages.services.coreServicesLabel"
                value={page.coreServicesLabel}
                className="text-xs font-black tracking-[0.22em] text-foreground/60"
              />
              <EditableText
                as="div"
                path="pages.services.coreServicesTitle"
                value={page.coreServicesTitle}
                className="hero-name mt-2 text-4xl"
              />
              <EditableText
                as="p"
                path="pages.services.coreServicesText"
                value={page.coreServicesText}
                className="mt-4 text-sm text-foreground/70"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.categories.map((c, idx) => (
                <ServiceCard
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  title={c.title}
                  description={c.description}
                  pointsText={page.cardPointsText.replace("{count}", `${c.bullets.length}`)}
                  detailText={page.cardDetailText}
                  imagePath={`servicesDetails.categories.${idx}.heroImageUrl`}
                  imageUrl={c.heroImageUrl}
                  titlePath={`servicesDetails.categories.${idx}.title`}
                  descriptionPath={`servicesDetails.categories.${idx}.description`}
                />
              ))}
            </div>
          </div>
        </div>

        <ServicesDivider />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="rounded-[44px] border border-foreground/10 bg-background p-6">
              <EditableText
                as="div"
                path="pages.services.industriesLabel"
                value={page.industriesLabel}
                className="text-xs font-black tracking-[0.22em] text-foreground/60"
              />
              <EditableText
                as="div"
                path="pages.services.industriesTitle"
                value={page.industriesTitle}
                className="hero-name mt-2 text-4xl"
              />
              <EditableText
                as="p"
                path="pages.services.industriesText"
                value={page.industriesText}
                className="mt-4 text-sm text-foreground/70"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.industries.map((c, idx) => (
                <ServiceCard
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  title={c.title}
                  description={c.description}
                  pointsText={page.cardPointsText.replace("{count}", `${c.bullets.length}`)}
                  detailText={page.cardDetailText}
                  imagePath={`servicesDetails.industries.${idx}.heroImageUrl`}
                  imageUrl={c.heroImageUrl}
                  titlePath={`servicesDetails.industries.${idx}.title`}
                  descriptionPath={`servicesDetails.industries.${idx}.description`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
