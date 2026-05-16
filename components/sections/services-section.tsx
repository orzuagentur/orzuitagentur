import {
  MotionNavLink,
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion";
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
      className="relative isolate overflow-hidden border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
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
        <MotionReveal className="max-w-2xl">
          <header>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
              {section.kicker}
            </p>
            <h2
              id="services-heading"
              className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
            >
              {section.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
              {section.subtitle}
            </p>
          </header>
        </MotionReveal>

        <MotionStagger
          as="ul"
          className="mt-14 grid list-none gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6"
        >
          {services.map((service) => (
            <MotionStaggerItem as="li" key={service.key} className="min-w-0">
              <article className="services-card group relative flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_75%,transparent)] p-px shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[color-mix(in_oklab,var(--accent)_18%,transparent)] before:to-[color-mix(in_oklab,var(--accent-2)_14%,transparent)] before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100 motion-reduce:before:transition-none">
                <div className="relative flex h-full flex-col rounded-[calc(1rem-1px)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--accent)]"
                  >
                    {service.label}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {service.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none">
                      →
                    </span>
                    <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                      Mehr im Gespräch
                    </span>
                  </span>
                </div>
              </article>
            </MotionStaggerItem>
          ))}
        </MotionStagger>

        <MotionReveal
          delay={0.12}
          className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-16"
        >
          <p className="max-w-md text-sm text-[var(--muted)]">{section.closing}</p>
          <MotionNavLink
            href="#kontakt"
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
