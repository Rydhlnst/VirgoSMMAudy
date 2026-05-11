import { readLandingPageContent } from "@/lib/landing-content/storage";
import { HeroSection } from "@/components/landing/HeroSection";
import { BrandStrip } from "@/components/landing/BrandStrip";
import { AboutSection } from "@/components/landing/AboutSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { BrandingSection } from "@/components/landing/BrandingSection";
import { WorkProcessSection } from "@/components/landing/WorkProcessSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Divider } from "@/components/landing/Divider";
import { LandingShell } from "@/components/landing/LandingShell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readLandingPageContent();
  return (
    <LandingShell content={content}>
      <div>
        <HeroSection hero={content.hero} />
        <Divider className="py-6" />
        <BrandStrip brandStrip={content.brandStrip} />
        {/* <IntroductionSection introduction={content.introduction} /> */}
        <Divider className="py-10" />
        <AboutSection about={content.about} />
        <Divider className="py-10" />
        <PortfolioSection portfolio={content.portfolio} />
        <ServicesSection services={content.services} />
        <TestimonialsSection testimonials={content.testimonials} />
        <BrandingSection branding={content.branding} />
        <WorkProcessSection workProcess={content.workProcess} />
        <ContactSection contact={content.contact} />
      </div>
    </LandingShell>
  );
}
