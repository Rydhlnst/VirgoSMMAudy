# Final CMS Trace Report

## Converted

### Global
- [x] `app/layout.tsx` navbar now reads from DB content (`cms_pages` via `readLandingPageContent`).

### Landing Components
- [x] `components/landing/HeroSection.tsx`
  - `hero.title`
  - `hero.badge`
  - `hero.description`
  - `hero.tags.*`
  - `hero.ctaText`
  - `hero.imageUrl`
- [x] `components/landing/BrandStrip.tsx`
  - `brandStrip.items.*.name`
  - `brandStrip.items.*.imageUrl`
- [x] `components/landing/AboutSection.tsx`
  - `about.title`
  - `about.label`
  - `about.description`
  - `about.images.*.imageUrl`
  - `about.images.*.alt`
- [x] `components/landing/PortfolioSection.tsx`
  - `portfolio.title`
  - `portfolio.videoLabel`
  - `portfolio.photoLabel`
  - `portfolio.emptyVideoText`
  - `portfolio.emptyPhotoText`
  - `portfolio.items.*.title`
  - `portfolio.items.*.thumbnailUrl`
- [x] `components/landing/ServicesSection.tsx`
  - `services.title`
  - `services.subtitle`
  - `services.viewAllText`
- [x] `components/landing/ServicesCarouselClient.tsx`
  - `services.carouselHintText`
  - `services.idealForLabel`
  - `services.items.*.title`
  - `services.items.*.hoursPerWeek`
  - `services.items.*.description`
  - `services.items.*.includes.*`
  - `services.items.*.idealFor`
  - `services.items.*.buttonText`
  - `services.items.*.imageUrl`
- [x] `components/landing/TestimonialsSection.tsx`
  - `testimonials.kicker`
  - `testimonials.title`
  - `testimonials.description`
  - `testimonials.items.*.(name|role|workTitle|description|quote|workImageUrl)`
- [x] `components/landing/BrandingSection.tsx`
  - `branding.title`
  - `branding.description`
  - `branding.beforeImageUrl`
  - `branding.afterImageUrl`
  - `branding.beforeLabel`
  - `branding.afterLabel`
- [x] `components/landing/WorkProcessSection.tsx`
  - `workProcess.kicker`
  - `workProcess.title`
  - `workProcess.description`
  - `workProcess.stepLabel`
  - `workProcess.steps.*.(number|title|description|icon)`
- [x] `components/landing/ContactSection.tsx`
  - `contact.title`
  - `contact.description`
  - `contact.emailText`
  - `contact.email`
  - `contact.socialLinks.*.platform`
- [x] `components/landing/Footer.tsx`
  - `footer.brandName`
  - `footer.description`
  - `footer.links.*.label`
  - `footer.socialLinks.*.platform`

### Admin Inline Route
- [x] `/admin/pages/[slug]/edit`
  - inline edit mode enabled
  - save/reset bar enabled
  - save persists via `/api/admin/cms/pages/[slug]`

## Still Hardcoded Intentionally
- [x] ARIA labels, icon-only labels, and interaction affordance text (non-content UX constants).
- [x] Some link targets are still edited from dedicated admin block (`navbar.menu.*.href`) rather than clickable inline anchors to avoid accidental navigation while editing.
- [x] Footer heading labels `LINKS` and `SOCIAL` remain UI constants.

## Future Improvements
- Drag-safe inline editing for link URLs directly in visual anchor nodes.
- Rich text field-level toggle (markdown preview/edit hybrid).
- Version history per save.
