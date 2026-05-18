import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DepthExperienceLazy } from "@/components/home/depth-experience-lazy";
import { CinematicHero } from "@/components/sections/cinematic-hero";
import { ServicesSection } from "@/components/sections/services-section";
import {
  getHomeSeo,
  getMarketingContent,
  getPortfolioCards,
  getServiceCards,
  getTestimonialCards,
} from "@/lib/cms/load-public";
import { buildPageMetadata } from "@/lib/seo/metadata";

const PortfolioSection = dynamic(() =>
  import("@/components/sections/portfolio-section").then(
    (mod) => mod.PortfolioSection,
  ),
);

const TechnologiesSection = dynamic(() =>
  import("@/components/sections/technologies-section").then(
    (mod) => mod.TechnologiesSection,
  ),
);

const TestimonialsSection = dynamic(() =>
  import("@/components/sections/testimonials-section").then(
    (mod) => mod.TestimonialsSection,
  ),
);

const ContactSection = dynamic(() =>
  import("@/components/sections/contact-section").then(
    (mod) => mod.ContactSection,
  ),
);

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo();
  return buildPageMetadata({
    path: "/",
    title: seo.title,
    description: seo.description,
    ogImageUrl: seo.ogImageUrl,
  });
}

export default async function Home() {
  const [marketing, services, portfolio, testimonials] = await Promise.all([
    getMarketingContent(),
    getServiceCards(),
    getPortfolioCards(),
    getTestimonialCards(),
  ]);

  return (
    <div className="relative isolate z-0 flex flex-1 flex-col">
      <DepthExperienceLazy />
      <div className="relative z-10 flex flex-1 flex-col">
        <CinematicHero hero={marketing.hero} />
        <ServicesSection
          section={marketing.servicesSection}
          services={services}
        />
        <PortfolioSection
          section={marketing.portfolioSection}
          projects={portfolio}
        />
        <TechnologiesSection section={marketing.technologiesSection} />
        <TestimonialsSection
          section={marketing.testimonialsSection}
          items={testimonials}
        />
        <ContactSection contact={marketing.contact} />
      </div>
    </div>
  );
}
