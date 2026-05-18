import {
  FloatingShape,
  GradientMesh,
  MotionNavLink,
  MotionReveal,
} from "@/components/motion";
import type { HeroContent } from "@/lib/cms/types";

type CinematicHeroProps = {
  hero: HeroContent;
};

export function CinematicHero({ hero }: CinematicHeroProps) {
  return (
    <section
      id="start"
      aria-labelledby="hero-heading"
      className="home-section-anchor hero-section relative isolate flex min-h-[min(100vh,1200px)] w-full flex-col justify-end overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28"
    >
      <GradientMesh className="motion-gradient-mesh pointer-events-none absolute inset-0 -z-[15] opacity-40" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_90%_55%_at_50%_-25%,color-mix(in_oklab,var(--accent-2)_28%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hero-vignette"
      />

      <div
        aria-hidden
        className="hero-orb hero-orb-a pointer-events-none absolute -left-1/4 top-1/4 -z-10 h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--accent)_38%,transparent),transparent_65%)] blur-3xl opacity-90 sm:left-0 sm:top-20"
      />
      <div
        aria-hidden
        className="hero-orb hero-orb-b pointer-events-none absolute -right-1/4 bottom-0 -z-10 h-[min(65vw,480px)] w-[min(65vw,480px)] rounded-full bg-[radial-gradient(circle_at_70%_60%,color-mix(in_oklab,var(--accent-2)_40%,transparent),transparent_65%)] blur-3xl opacity-85 sm:right-0"
      />

      <FloatingShape className="pointer-events-none absolute right-[8%] top-[28%] -z-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_65%)] blur-2xl opacity-70 md:right-[12%]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent opacity-80"
      />

      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <MotionReveal className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_70%,transparent)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--muted)] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-md sm:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]" />
          </span>
          {hero.badge}
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <h1
            id="hero-heading"
            className="max-w-[18ch] text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--foreground)] sm:max-w-[20ch] sm:text-6xl lg:text-7xl"
          >
            {hero.titleBefore}
            <span className="bg-gradient-to-br from-[var(--foreground)] via-[var(--foreground)] to-[var(--muted)] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
            {hero.titleAfter}
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.14} className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
          <p>{hero.subtitle}</p>
        </MotionReveal>

        <MotionReveal delay={0.2} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <MotionNavLink
            href={hero.primaryCta.href}
            className="cta-shine group relative inline-flex h-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-8 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            hoverLift={4}
          >
            {hero.primaryCta.label}
          </MotionNavLink>
          <MotionNavLink
            href={hero.secondaryCta.href}
            className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--border)] bg-transparent px-8 text-sm font-semibold text-[var(--foreground)] transition-[border-color,background-color,color] duration-300 hover:border-[var(--border-strong)] hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            hoverLift={3}
          >
            {hero.secondaryCta.label}
          </MotionNavLink>
        </MotionReveal>

        <MotionReveal delay={0.26}>
          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-4 border-t border-[var(--border)] pt-10 sm:grid-cols-4 sm:gap-6">
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_55%,transparent)] p-4 backdrop-blur-md"
              >
                <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  {stat.label}
                </dt>
                <dd
                  className={
                    stat.valueSuffix
                      ? "mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--foreground)]"
                      : "mt-1 text-lg font-semibold leading-snug text-[var(--foreground)]"
                  }
                >
                  {stat.valueSuffix ? (
                    <>
                      {stat.value}
                      <span className="text-[var(--muted)]">{stat.valueSuffix}</span>
                    </>
                  ) : (
                    stat.value
                  )}
                </dd>
                <dd className="mt-1 text-xs text-[var(--muted)]">{stat.hint}</dd>
              </div>
            ))}
          </dl>
        </MotionReveal>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block motion-reduce:hidden"
      >
        <span className="hero-scroll-hint flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--muted)]">
          Scroll
          <span className="block h-8 w-px bg-gradient-to-b from-[var(--accent)] to-transparent" />
        </span>
      </div>
    </section>
  );
}
