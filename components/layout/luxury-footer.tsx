import { MotionNavLink } from "@/components/motion";
import type { FooterContent, NavContent } from "@/lib/cms/types";
import Link from "next/link";

type LuxuryFooterProps = {
  footer: FooterContent;
  /** Meist identisch zu `nav.links` — wird für die Fußzeilen-Navigation verwendet */
  navLinks: NavContent["links"];
};

export function LuxuryFooter({ footer, navLinks }: LuxuryFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="footer-surface relative isolate mt-auto overflow-hidden border-t border-[var(--border-strong)]"
      aria-labelledby="footer-heading"
    >
      <div
        aria-hidden
        className="footer-glow pointer-events-none absolute inset-x-0 bottom-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/35 to-transparent opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_80%_at_50%_120%,color-mix(in_oklab,var(--accent-2)_12%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="footer-orb pointer-events-none absolute -right-24 bottom-0 -z-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_72%)] blur-3xl opacity-70"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="footer-reveal footer-reveal-brand lg:col-span-5">
            <p id="footer-heading" className="sr-only">
              Fußzeile OrzuIT
            </p>
            <Link
              href="#start"
              className="inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">
                Orzu<span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">IT</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {footer.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MotionNavLink
                href="#kontakt"
                className="cta-shine relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                hoverLift={4}
              >
                {footer.ctaLabel}
              </MotionNavLink>
            </div>
          </div>

          <nav
            className="footer-reveal footer-reveal-nav lg:col-span-4"
            aria-label="Fußzeilen-Navigation"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              {footer.navHeading}
            </p>
            <ul className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors duration-300 hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span className="h-px w-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-reveal footer-reveal-contact lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              {footer.contactHeading}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
              {footer.contactLead}
            </p>
            <a
              href={`mailto:${footer.email}`}
              className="mt-4 inline-flex break-all text-sm font-medium text-[var(--accent)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {footer.email}
            </a>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
              {footer.locationLine}
            </p>
          </div>
        </div>

        <div className="footer-reveal footer-reveal-meta mt-14 flex flex-col gap-4 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
            © {year} {footer.copyrightName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <span
              className="cursor-help border-b border-dotted border-[var(--border-strong)] text-[var(--foreground)]/90"
              title="Seite folgt mit rechtlicher Ausarbeitung"
            >
              {footer.impressumLabel}
            </span>
            <span
              className="cursor-help border-b border-dotted border-[var(--border-strong)] text-[var(--foreground)]/90"
              title="Seite folgt mit rechtlicher Ausarbeitung"
            >
              {footer.privacyLabel}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
