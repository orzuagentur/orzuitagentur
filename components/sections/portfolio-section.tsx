import { MotionReveal } from "@/components/motion";
import { PortfolioCarousel } from "@/components/sections/portfolio-carousel";
import type { PortfolioCard, PortfolioSectionContent } from "@/lib/cms/types";

type PortfolioSectionProps = {
  section: PortfolioSectionContent;
  projects: PortfolioCard[];
};

export function PortfolioSection({ section, projects }: PortfolioSectionProps) {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="home-section-deferred relative isolate overflow-x-visible overflow-y-visible border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_12%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_58%),radial-gradient(ellipse_55%_45%_at_88%_20%,color-mix(in_oklab,var(--accent-2)_14%,transparent),transparent_55%)]"
      />
      <div
        aria-hidden
        className="portfolio-orb pointer-events-none absolute -left-32 top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)] blur-3xl opacity-60"
      />
      <div
        aria-hidden
        className="portfolio-orb pointer-events-none absolute -right-24 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_20%,transparent),transparent_68%)] blur-3xl opacity-50"
        style={{ animationDelay: "-8s" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="max-w-3xl">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
                {section.kicker}
              </p>
              <h2
                id="portfolio-heading"
                className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
              >
                {section.title}
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[var(--muted)] lg:max-w-sm lg:text-right">
              {section.subtitleRight}
            </p>
          </header>
        </MotionReveal>

        <div className="mt-12 sm:mt-14 lg:mt-16">
          <PortfolioCarousel projects={projects} />
        </div>

        <p className="mt-10 text-center text-sm text-[var(--muted)] sm:mt-12">
          {section.footnote}
        </p>
      </div>
    </section>
  );
}
