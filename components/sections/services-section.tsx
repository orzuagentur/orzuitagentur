import { MotionNavLink, MotionReveal } from "@/components/motion";
import { ServicesCarousel } from "@/components/sections/services-carousel";
import type { ServiceCard, ServicesSectionContent } from "@/lib/cms/types";

type ServicesSectionProps = {
  section: ServicesSectionContent;
  services: ServiceCard[];
};

export function ServicesSection({ section, services }: ServicesSectionProps) {
  return (
    <section
      id="leistungen"
      aria-labelledby="services-heading"
      className="home-section-anchor home-section-deferred relative isolate overflow-x-visible overflow-y-visible border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_65%)]"
      />
      <div
        aria-hidden
        className="services-orb pointer-events-none absolute -right-20 top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_22%,transparent),transparent_68%)] blur-3xl opacity-80"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="max-w-3xl">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
                {section.kicker}
              </p>
              <h2
                id="services-heading"
                className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
              >
                {section.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--muted)] lg:hidden">
                {section.subtitle}
              </p>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[var(--muted)] lg:max-w-sm lg:text-right">
              {section.subtitleRight || section.subtitle}
            </p>
          </header>
        </MotionReveal>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <ServicesCarousel services={services} />
        </div>

        <p className="mt-10 text-center text-sm text-[var(--muted)] sm:mt-12">
          {section.footnote}
        </p>

        <MotionReveal
          delay={0.12}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:mt-12"
        >
          <p className="max-w-md text-center text-sm text-[var(--muted)] sm:text-left">
            {section.closing}
          </p>
          <MotionNavLink
            href={section.ctaHref ?? "#kontakt"}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            hoverLift={4}
          >
            {section.ctaLabel}
          </MotionNavLink>
        </MotionReveal>
      </div>
    </section>
  );
}
