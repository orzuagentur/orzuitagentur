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
      id="referenzen"
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            {section.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
            {section.subtitle}
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {items.map((item, index) => {
            const revealClass = REVEAL[Math.min(index, REVEAL.length - 1)];
            return (
              <figure
                key={item.key}
                className={`testimonial-reveal ${revealClass} testimonial-card group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_80%,transparent)] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md sm:p-8`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_18%,transparent),transparent_68%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                />
                <div className="relative">
                  <div
                    className="flex items-center gap-2 text-[var(--accent)]"
                    aria-label="Fünf von fünf Sternen"
                  >
                    <span aria-hidden className="text-sm tracking-[0.2em]">
                      ★★★★★
                    </span>
                  </div>
                  <blockquote className="mt-5 text-balance text-base leading-relaxed text-[var(--foreground)] sm:text-[17px]">
                    <span
                      aria-hidden
                      className="font-serif text-4xl leading-none text-[color-mix(in_oklab,var(--accent)_55%,var(--muted))]"
                    >
                      “
                    </span>
                    <span className="sr-only">Zitat: </span>
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-8 flex flex-col gap-0.5 border-t border-[var(--border)] pt-6">
                    <span className="font-semibold text-[var(--foreground)]">
                      {item.author}
                    </span>
                    <span className="text-sm text-[var(--muted)]">
                      {item.role}
                      <span aria-hidden> · </span>
                      <span className="text-[var(--foreground)]/90">{item.org}</span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>

        <p className="testimonial-reveal testimonial-reveal-foot mt-12 text-center text-sm text-[var(--muted)] lg:mt-14">
          {section.footnote}
        </p>
      </div>
    </section>
  );
}
