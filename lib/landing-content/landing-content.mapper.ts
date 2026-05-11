import type { LandingPageContentRow } from "@/db/schema/landing-content.schema";
import { landingPageContentSchema } from "@/lib/landing-content/landing-content.validation";
import type { LandingPageContent } from "@/lib/landing-content/types";

export function mapLandingContentRowToContent(row: LandingPageContentRow): LandingPageContent {
  return landingPageContentSchema.parse({
    navbar: row.navbar,
    hero: row.hero,
    brandStrip: row.brandStrip,
    introduction: row.introduction,
    about: row.about,
    portfolio: row.portfolio,
    services: row.services,
    servicesDetails: row.servicesDetails,
    testimonials: row.testimonials,
    branding: row.branding,
    workProcess: row.workProcess,
    contact: row.contact,
    footer: row.footer,
    pages: row.pages,
  });
}
