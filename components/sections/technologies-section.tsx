import type { TechnologiesSectionContent } from "@/lib/cms/types";

const COLUMN_REVEAL = [
  "tech-reveal-1",
  "tech-reveal-2",
  "tech-reveal-3",
] as const;

type TechnologiesSectionProps = {
  section: TechnologiesSectionContent;
};

export function TechnologiesSection({ section }: TechnologiesSectionProps) {
  const [a, b, c] = section.stacks;

  return (
    <section
      id="technologien"
      aria-labelledby="technologies-heading"
      className="home-section-deferred relative isolate overflow-hidden border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_75%_15%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_62%)]"
      />
      <div
        aria-hidden
        className="tech-orb pointer-events-none absolute right-1/4 top-12 -z-10 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_24%,transparent),transparent_72%)] blur-3xl opacity-75"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="tech-reveal tech-reveal-h max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
            {section.kicker}
          </p>
          <h2
            id="technologies-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            {section.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
            {section.subtitle}
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {[a, b, c].map((stack, index) => (
            <div
              key={stack.title}
              className={`tech-reveal ${COLUMN_REVEAL[index]} tech-stack-card flex flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_78%,transparent)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md sm:p-7`}
            >
              <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                {stack.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                {stack.description}
              </p>
              <ul
                className="mt-6 flex flex-wrap gap-2"
                aria-label={`Tools: ${stack.title}`}
              >
                {stack.items.map((item) => (
                  <li key={item}>
                    <span className="tech-chip inline-flex rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,black)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="tech-reveal tech-reveal-marquee mt-14 lg:mt-16">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
            {section.marqueeKicker}
          </p>
          <div
            className="tech-marquee-viewport relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,black)] py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
            role="presentation"
          >
            <div className="tech-marquee-mask pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--background)] to-transparent sm:w-24" />
            <div className="tech-marquee-mask pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--background)] to-transparent sm:w-24" />
            <div className="px-3 sm:px-6">
              <div className="tech-marquee-track flex w-max">
                <div className="flex gap-4 pr-4 sm:gap-5 sm:pr-5" aria-hidden="true">
                  {section.marqueeItems.map((name) => (
                    <span
                      key={`a-${name}`}
                      className="tech-chip-marquee inline-flex shrink-0 whitespace-nowrap rounded-full border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] backdrop-blur-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 pr-4 sm:gap-5 sm:pr-5" aria-hidden="true">
                  {section.marqueeItems.map((name) => (
                    <span
                      key={`b-${name}`}
                      className="tech-chip-marquee inline-flex shrink-0 whitespace-nowrap rounded-full border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] backdrop-blur-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="sr-only">
            Technologien im Einsatz: {section.marqueeItems.join(", ")}.
          </p>
        </div>
      </div>
    </section>
  );
}
