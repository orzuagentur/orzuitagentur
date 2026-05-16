import Link from "next/link";
import type { PortfolioCard, PortfolioSectionContent } from "@/lib/cms/types";

const CARD_REVEAL = [
  "portfolio-reveal-1",
  "portfolio-reveal-2",
  "portfolio-reveal-3",
] as const;

type PortfolioSectionProps = {
  section: PortfolioSectionContent;
  projects: PortfolioCard[];
};

export function PortfolioSection({ section, projects }: PortfolioSectionProps) {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="home-section-deferred relative isolate overflow-hidden border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_45%_at_20%_0%,color-mix(in_oklab,var(--accent-2)_14%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden
        className="portfolio-orb pointer-events-none absolute -left-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_70%)] blur-3xl opacity-70"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="portfolio-reveal portfolio-reveal-h flex max-w-3xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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

        <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          {projects.map((project, index) => {
            const isFeatured = project.size === "featured";
            const revealClass = CARD_REVEAL[Math.min(index, CARD_REVEAL.length - 1)];
            return (
              <article
                key={project.key}
                className={`portfolio-reveal ${revealClass} portfolio-card group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-500 ease-out ${
                  isFeatured
                    ? "lg:col-span-7 lg:row-span-2 lg:min-h-[460px]"
                    : "lg:col-span-5 lg:min-h-[220px]"
                }`}
              >
                <div
                  aria-hidden
                  className={`portfolio-visual relative min-h-[140px] shrink-0 overflow-hidden border-b border-[var(--border)] sm:min-h-[160px] ${
                    isFeatured ? "lg:min-h-[240px]" : ""
                  } ${project.visualClass}`}
                >
                  <span className="portfolio-visual-grid absolute inset-0 opacity-40" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--background)_88%,black)] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
                    <span className="rounded-full border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--foreground)] backdrop-blur-md">
                      {project.category}
                    </span>
                    {isFeatured ? (
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--muted)] sm:block">
                        Case Study
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-5">
                    <Link
                      href="#kontakt"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] transition-[gap] duration-300 group-hover:gap-3"
                    >
                      <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                        Case besprechen
                      </span>
                      <span
                        aria-hidden
                        className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                      >
                        →
                      </span>
                    </Link>
                    <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                      OrzuIT
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="portfolio-reveal portfolio-reveal-foot mt-10 text-center text-sm text-[var(--muted)] lg:mt-12">
          {section.footnote}
        </p>
      </div>
    </section>
  );
}
