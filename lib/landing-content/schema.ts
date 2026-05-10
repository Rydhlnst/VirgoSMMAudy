/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const urlOrEmpty = z.string().url("URL tidak valid").or(z.literal("")).default("");

export const navbarSchema = z.object({
  brandName: z.string().min(1, "Brand name wajib diisi").default("Audy"),
  menu: z
    .array(
      z.object({
        label: z.string().min(1, "Label wajib diisi"),
        href: z.string().min(1, "Href wajib diisi"),
      }),
    )
    .default([
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ]),
  ctaText: z.string().min(1, "CTA text wajib diisi").default("Let's Talk"),
  ctaLink: z.string().min(1, "CTA link wajib diisi").default("/contact"),
});

export const heroSchema = z.object({
  title: z.string().min(1, "Hero title wajib diisi"),
  badge: z.string().default("SOCIAL MEDIA MANAGER"),
  description: z.string().default(""),
  imageUrl: urlOrEmpty,
  ctaText: z.string().min(1, "CTA text wajib diisi").default("Book a Call"),
  ctaLink: z.string().min(1, "CTA link wajib diisi").default("/contact"),
  tags: z.array(z.string().min(1)).default([]),
});

export const brandStripSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Nama brand wajib diisi"),
        imageUrl: urlOrEmpty.optional(),
        link: z.string().url("Link tidak valid").or(z.literal("")).optional(),
      }),
    )
    .default([]),
});

export const introductionSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("MY INTRODUCTION"),
  description: z.string().min(1, "Description wajib diisi"),
  imageUrl: urlOrEmpty,
  badgeText: z.string().default(""),
});

export const aboutSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("ABOUT ME"),
  label: z.string().min(1, "Label wajib diisi").default("Who I am?"),
  description: z.string().min(1, "Description wajib diisi"),
  images: z
    .array(
      z.object({
        imageUrl: urlOrEmpty,
        alt: z.string().min(1, "Alt wajib diisi").default("About image"),
      }),
    )
    .default([]),
});

export const portfolioSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("PORTFOLIO"),
  items: z
    .array(
      z.object({
        type: z.enum(["video", "photo"]),
        title: z.string().min(1, "Title wajib diisi"),
        thumbnailUrl: urlOrEmpty,
        link: z.string().url("Link tidak valid").or(z.literal("")).optional(),
        caption: z.string().optional(),
      }),
    )
    .default([]),
});

export const portfolioDetailsSchema = z.object({
  projects: z
    .array(
      z.object({
        title: z.string().min(1, "Title wajib diisi"),
        client: z.string().default(""),
        brief: z.string().default(""),
        approach: z.array(z.string().min(1)).default([]),
        result: z.string().default(""),
        deliverables: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
});

export const servicesSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("SERVICES"),
  subtitle: z.string().default(""),
  viewAllText: z.string().min(1, "View all text wajib diisi").default("View all services"),
  viewAllLink: z.string().min(1, "View all link wajib diisi").default("/services"),
  items: z
    .array(
      z.object({
        title: z.string().default(""),
        name: z.string().min(1, "Name wajib diisi"),
        description: z.string().default(""),
        // Allow empty for "contact/custom pricing" packages.
        price: z.string().default(""),
        hoursPerWeek: z.string().default(""),
        includes: z.array(z.string().min(1)).default([]),
        idealFor: z.string().default(""),
        imageUrl: urlOrEmpty,
        buttonText: z.string().min(1, "Button text wajib diisi").default("Get Started"),
        buttonLink: z.string().min(1, "Button link wajib diisi").default("/contact"),
        isHighlighted: z.boolean().default(false),
      }),
    )
    .default([]),
});

const slugSchema = z
  .string()
  .min(1, "Slug wajib diisi")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus lowercase dan pakai '-'");

export const supportDetailSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1, "Title wajib diisi"),
  description: z.string().default(""),
  heroImageUrl: urlOrEmpty.optional(),
  bullets: z.array(z.string().min(1)).default([]),
});

export const servicesDetailsSchema = z.object({
  name: z.string().min(1, "Name wajib diisi").default("Virgo Social Services"),
  intro: z.string().default(""),
  categories: z.array(supportDetailSchema).default([]),
  industries: z.array(supportDetailSchema).default([]),
});

export const testimonialsSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("TESTIMONIALS"),
  description: z.string().default(""),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Name wajib diisi"),
        role: z.string().optional(),
        quote: z.string().min(1, "Quote wajib diisi"),
        workTitle: z.string().default(""),
        description: z.string().default(""),
        workImageUrl: urlOrEmpty.optional(),
        imageUrl: urlOrEmpty.optional(),
      }),
    )
    .default([]),
});

export const brandingSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("BRANDING"),
  description: z.string().default(""),
  beforeImageUrl: urlOrEmpty,
  afterImageUrl: urlOrEmpty,
  beforeLabel: z.string().min(1, "Before label wajib diisi").default("From This"),
  afterLabel: z.string().min(1, "After label wajib diisi").default("To This"),
});

export const workProcessSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("MY WORK PROCESS"),
  steps: z
    .array(
      z.object({
        number: z.string().min(1, "Number wajib diisi"),
        title: z.string().min(1, "Title wajib diisi"),
        description: z.string().default(""),
        icon: z.string().optional(),
      }),
    )
    .default([]),
});

export const contactSchema = z.object({
  title: z.string().min(1, "Title wajib diisi").default("LET'S WORK TOGETHER"),
  description: z.string().default(""),
  whatsappText: z.string().min(1, "WhatsApp text wajib diisi").default("Chat on WhatsApp"),
  whatsappLink: z.string().min(1, "WhatsApp link wajib diisi").default("https://wa.me/"),
  email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, "Platform wajib diisi"),
        url: z.string().url("URL tidak valid").or(z.literal("")),
      }),
    )
    .default([]),
});

export const footerSchema = z.object({
  brandName: z.string().min(1, "Brand name wajib diisi").default("Virgo Social"),
  description: z.string().default(""),
  links: z
    .array(
      z.object({
        label: z.string().min(1, "Label wajib diisi"),
        href: z.string().min(1, "Href wajib diisi"),
      }),
    )
    .default([
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ]),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, "Platform wajib diisi"),
        url: z.string().url("URL tidak valid").or(z.literal("")),
      }),
    )
    .default([]),
  copyrightText: z
    .string()
    .min(1, "Copyright wajib diisi")
    .default("© {year} Virgo Social. All rights reserved."),
});

export const pagesSchema = z
  .object({
    about: z
      .object({
        badge: z.string().min(1).default("ABOUT"),
        profileLabel: z.string().min(1).default("PROFILE"),
        storyLabel: z.string().min(1).default("STORY"),
        notesLabel: z.string().min(1).default("NOTES"),
        notesText: z
          .string()
          .min(1)
          .default("Images on this page are placeholders (skeletons) for fast loading. Replace them with real assets later."),
        processLabel: z.string().min(1).default("PROCESS"),
        processTitle: z.string().min(1).default("How I work"),
        focusLabel: z.string().min(1).default("FOCUS"),
        focusText: z
          .string()
          .min(1)
          .default("Editorial visuals, action-driven storytelling, and a content system you can run consistently."),
        availabilityLabel: z.string().min(1).default("AVAILABILITY"),
        availabilityText: z.string().min(1).default("One-off projects or monthly support."),
        contactCtaText: z.string().min(1).default("Contact"),
        servicesCtaText: z.string().min(1).default("Services"),
      })
      .default({
        badge: "ABOUT",
        profileLabel: "PROFILE",
        storyLabel: "STORY",
        notesLabel: "NOTES",
        notesText: "Images on this page are placeholders (skeletons) for fast loading. Replace them with real assets later.",
        processLabel: "PROCESS",
        processTitle: "How I work",
        focusLabel: "FOCUS",
        focusText: "Editorial visuals, action-driven storytelling, and a content system you can run consistently.",
        availabilityLabel: "AVAILABILITY",
        availabilityText: "One-off projects or monthly support.",
        contactCtaText: "Contact",
        servicesCtaText: "Services",
      }),
    contact: z
      .object({
        badge: z.string().min(1).default("CONTACT"),
        fastestLabel: z.string().min(1).default("FASTEST"),
        fastestText: z.string().min(1).default("Chat via WhatsApp. Include your goal and timeline."),
        contactOptionsLabel: z.string().min(1).default("CONTACT OPTIONS"),
        emailLabel: z.string().min(1).default("EMAIL"),
        emailCtaText: z.string().min(1).default("Send email"),
        socialLabel: z.string().min(1).default("SOCIAL"),
        noSocialText: z.string().min(1).default("No social links yet."),
        requiredInfoLabel: z.string().min(1).default("WHAT I NEED"),
        requiredInfoItems: z
          .array(z.string().min(1))
          .default(["Your offer + target audience", "This month’s goal (sales, leads, awareness)", "Timeline + budget range"]),
        previewLabel: z.string().min(1).default("PREVIEW"),
        previewText: z.string().min(1).default("Skeleton blocks = fast loading placeholders. Replace with real assets later."),
      })
      .default({} as any),
    portfolio: z
      .object({
        badge: z.string().min(1).default("PORTFOLIO"),
        introText: z
          .string()
          .min(1)
          .default(
            "Short-form campaigns, editorial visuals, and conversion-first carousels. Thumbnails are placeholders (skeletons) for fast loading.",
          ),
        statsProjectsLabel: z.string().min(1).default("Projects"),
        statsVideosLabel: z.string().min(1).default("Videos"),
        statsPhotosLabel: z.string().min(1).default("Photos"),
        gridLabel: z.string().min(1).default("GRID"),
        gridTitle: z.string().min(1).default("Selected work"),
        workTogetherCtaText: z.string().min(1).default("Work together"),
        openLinkText: z.string().min(1).default("Open"),
        noLinkText: z.string().min(1).default("No link"),
        detailLabel: z.string().min(1).default("DETAILS"),
        detailTitle: z.string().min(1).default("Client brief → outcome"),
        cmsHintText: z.string().min(1).default("Editable via CMS"),
        clientFallbackLabel: z.string().min(1).default("Client"),
        briefPillText: z.string().min(1).default("Brief"),
        resultPillText: z.string().min(1).default("Result"),
        approachLabel: z.string().min(1).default("Approach"),
        deliverablesLabel: z.string().min(1).default("Deliverables"),
        resultLabel: z.string().min(1).default("Result"),
      })
      .default({} as any),
    services: z
      .object({
        badge: z.string().min(1).default("SERVICES"),
        howToChooseLabel: z.string().min(1).default("HOW TO CHOOSE"),
        howToChooseText: z
          .string()
          .min(1)
          .default("Start with the core services, then choose an industry lane if needed."),
        checkAvailabilityCtaText: z.string().min(1).default("Check availability"),
        coreServicesLabel: z.string().min(1).default("CORE SERVICES"),
        coreServicesTitle: z.string().min(1).default("Start here"),
        coreServicesText: z.string().min(1).default("From strategy and systems to execution."),
        industriesLabel: z.string().min(1).default("INDUSTRIES"),
        industriesTitle: z.string().min(1).default("Industry lanes"),
        industriesText: z.string().min(1).default("Workflows tailored to your business type."),
        cardPointsText: z.string().min(1).default("{count} points"),
        cardDetailText: z.string().min(1).default("Details"),
        detailBackText: z.string().min(1).default("Back to services"),
        detailMediaLabel: z.string().min(1).default("MEDIA"),
        detailMediaText: z.string().min(1).default("Placeholder (skeleton) for now. Replace with real assets later."),
        detailIncludesLabel: z.string().min(1).default("INCLUDES"),
        detailCtaText: z.string().min(1).default("Check availability"),
        groupCoreLabel: z.string().min(1).default("Core services"),
        groupIndustryLabel: z.string().min(1).default("Industries"),
      })
      .default({} as any),
  })
  .default({} as any);

export const landingPageContentSchema = z.object({
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
});
