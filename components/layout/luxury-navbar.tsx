"use client";

import { MotionNavLink } from "@/components/motion";
import type { NavContent } from "@/lib/cms/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type LuxuryNavbarProps = {
  nav: NavContent;
};

export function LuxuryNavbar({ nav }: LuxuryNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`navbar-surface sticky top-0 z-50 w-full border-b transition-[backdrop-filter,background-color,box-shadow] duration-500 motion-reduce:transition-none ${
        scrolled
          ? "border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_78%,transparent)] shadow-[0_8px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          : "border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] backdrop-blur-md"
      }`}
    >
      <div className="navbar-glow motion-reduce:hidden pointer-events-none absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-80" />
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="#start"
          className="group relative flex shrink-0 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          onClick={() => setMenuOpen(false)}
        >
          <span
            aria-hidden
            className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--accent)]/25 via-transparent to-[var(--accent-2)]/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          />
          <span className="relative font-mono text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">
            Orzu<span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">IT</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hauptnavigation"
        >
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors duration-300 hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span className="relative z-10">{link.label}</span>
              <span
                aria-hidden
                className="absolute inset-x-2 bottom-1 h-px scale-x-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <MotionNavLink
            href="#kontakt"
            className="cta-shine group relative overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            hoverLift={4}
          >
            <span className="relative z-10">{nav.ctaLabel}</span>
          </MotionNavLink>
        </div>

        <button
          type="button"
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 text-[var(--foreground)] backdrop-blur-sm transition-[border-color,transform] duration-300 hover:border-[var(--border-strong)] lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Navigation</span>
          <span className="flex h-5 w-5 flex-col justify-center gap-1.5">
            <span
              className={`h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                menuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-opacity duration-300 motion-reduce:transition-none ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                menuOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`fixed inset-0 top-[72px] z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`fixed inset-x-0 top-[72px] z-50 max-h-[min(70vh,520px)] overflow-y-auto border-b border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] px-4 py-6 shadow-2xl backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none sm:px-6 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobile Navigation">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-[var(--muted)] transition-[color,background-color] duration-200 hover:bg-white/5 hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <MotionNavLink
              href="#kontakt"
              className="mt-4 rounded-full border border-[var(--border-strong)] bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 px-4 py-3 text-center text-base font-semibold text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              hoverLift={2}
              onClick={() => setMenuOpen(false)}
            >
              {nav.ctaLabel}
            </MotionNavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
