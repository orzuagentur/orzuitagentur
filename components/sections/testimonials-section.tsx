import type { TestimonialCard, TestimonialsSectionContent } from "@/lib/cms/types";

const REVEAL = [
  "testimonial-reveal-1",
  "testimonial-reveal-2",
  "testimonial-reveal-3",
] as const;

type TestimonialsSectionProps = {
  section: TestimonialsSectionContent;
  items: TestimonialCard[];
};

export function TestimonialsSection({
  section,
  items,
}: TestimonialsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="warum-orzuit"
      aria-labelledby="why-heading"
      className="home-section-deferred relative isolate overflow-hidden border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_40%_110%,color-mix(in_oklab,var(--accent-2)_16%,transparent),transparent_65%)]"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-24 -z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="testimonial-orb h-[340px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)] blur-3xl opacity-90" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="testimonial-reveal testimonial-reveal-h mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
            {section.kicker}
          </p>
          <h2
            id="why-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            {section.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
            {section.subtitle}
          </p>
        </header>

        <ul className="mt-14 grid list-none grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {items.map((item, index) => {
            const revealClass = REVEAL[Math.min(index, REVEAL.length - 1)];
            const meta = [item.role, item.org].filter(Boolean).join(" · ");
            return (
              <li
                key={item.key}
                className={`testimonial-reveal ${revealClass} testimonial-card group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_80%,transparent)] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md sm:p-8`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_18%,transparent),transparent_68%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                />
                <div className="relative flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {item.author}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-[var(--muted)] sm:text-[17px]">
                    {item.quote}
                  </p>
                  {meta ? (
                    <p className="mt-6 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                      {meta}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="testimonial-reveal testimonial-reveal-foot mt-12 text-center text-sm text-[var(--muted)] lg:mt-14">
          {section.footnote}
        </p>
      </div>
    </section>
  );
}
