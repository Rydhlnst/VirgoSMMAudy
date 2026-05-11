import { z } from "zod";
import {
  aboutSchema,
  brandingSchema,
  brandStripSchema,
  contactSchema,
  footerSchema,
  heroSchema,
  introductionSchema,
  landingPageContentSchema,
  navbarSchema,
  pagesSchema,
  portfolioDetailsSchema,
  portfolioSchema,
  servicesDetailsSchema,
  servicesSchema,
  testimonialsSchema,
  workProcessSchema,
} from "@/lib/landing-content/schema";

export {
  navbarSchema,
  heroSchema,
  brandStripSchema,
  introductionSchema,
  aboutSchema,
  portfolioSchema,
  portfolioDetailsSchema,
  servicesSchema,
  servicesDetailsSchema,
  testimonialsSchema,
  brandingSchema,
  workProcessSchema,
  contactSchema,
  footerSchema,
  pagesSchema,
  landingPageContentSchema,
};

export const landingContentSections = [
  "navbar",
  "hero",
  "brandStrip",
  "introduction",
  "about",
  "portfolio",
  "portfolioDetails",
  "services",
  "servicesDetails",
  "testimonials",
  "branding",
  "workProcess",
  "contact",
  "footer",
  "pages",
] as const;

export type LandingContentSection = (typeof landingContentSections)[number];

export const landingContentSectionSchema = z.enum(landingContentSections);

export const landingContentSectionSchemas = {
  navbar: navbarSchema,
  hero: heroSchema,
  brandStrip: brandStripSchema,
  introduction: introductionSchema,
  about: aboutSchema,
  portfolio: portfolioSchema,
  portfolioDetails: portfolioDetailsSchema,
  services: servicesSchema,
  servicesDetails: servicesDetailsSchema,
  testimonials: testimonialsSchema,
  branding: brandingSchema,
  workProcess: workProcessSchema,
  contact: contactSchema,
  footer: footerSchema,
  pages: pagesSchema,
} as const;
