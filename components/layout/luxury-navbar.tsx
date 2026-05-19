"use client";

import { MotionNavLink } from "@/components/motion";
import type { NavContent } from "@/lib/cms/types";
import {
  normalizeNavHref,
  pickActiveSectionId,
  scrollToSectionId,
} from "@/lib/navigation/section-scroll";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type MouseEvent,
} from "react";

type LuxuryNavbarProps = {
  nav: NavContent;
};

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectFabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 13h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LuxuryNavbar({ nav }: LuxuryNavbarProps) {
  const menuId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("#start");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () =>
      nav.links.map((link) => ({
        ...link,
        href: normalizeNavHref(link.href),
      })),
    [nav.links],
  );

  const sectionIds = useMemo(
    () =>
      navLinks
        .map((link) => (link.href.startsWith("#") ? link.href.slice(1) : ""))
        .filter(Boolean),
    [navLinks],
  );

  const updateActiveFromScroll = useCallback(() => {
    if (sectionIds.length === 0) return;
    const id = pickActiveSectionId(sectionIds);
    setActiveHash(`#${id}`);
  }, [sectionIds]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, [updateActiveFromScroll]);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = normalizeNavHref(hash).slice(1);
    const timer = window.setTimeout(() => {
      if (scrollToSectionId(id, "auto")) {
        setActiveHash(`#${id}`);
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [sectionIds]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    closeMenu = false,
  ) => {
    if (!href.startsWith("#")) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollToSectionId(id, reduced ? "auto" : "smooth");
    setActiveHash(`#${id}`);
    if (closeMenu) setMenuOpen(false);
  };

  const headerClass = scrolled
    ? "border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_78%,transparent)] shadow-[0_8px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl"
    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] backdrop-blur-md";

  return (
    <>
      <header
        className={`navbar-surface sticky top-0 z-50 w-full border-b transition-[backdrop-filter,background-color,box-shadow] duration-500 motion-reduce:transition-none ${headerClass}`}
      >
        <div
          aria-hidden
          className="navbar-glow pointer-events-none absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-80 motion-reduce:hidden"
        />
        <div className="navbar-bar mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:grid lg:h-[72px] lg:px-8 lg:py-0">
          <Link
            href="#start"
            scroll={false}
            onClick={(e) => handleSectionClick(e, "#start", menuOpen)}
            className="navbar-logo group relative flex w-fit shrink-0 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            <span
              aria-hidden
              className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--accent)]/25 via-transparent to-[var(--accent-2)]/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
            />
            <span className="relative font-mono text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">
              Orzu
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                IT
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="navbar-menu-toggle lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
            <span className="sr-only">{menuOpen ? "Menü schließen" : "Menü öffnen"}</span>
          </button>

          <nav
            className="navbar-nav-pill hidden lg:inline-flex"
            aria-label="Hauptnavigation"
          >
            {navLinks.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  scroll={false}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  className={`navbar-nav-pill-link${isActive ? " is-active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <MotionNavLink
            href="#kontakt"
            scroll={false}
            onClick={(e) => handleSectionClick(e, "#kontakt")}
            className="navbar-cta cta-shine group relative hidden shrink-0 overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] lg:inline-flex lg:items-center lg:justify-center"
            hoverLift={4}
          >
            <span className="relative z-10">{nav.ctaLabel}</span>
          </MotionNavLink>
        </div>
      </header>

      <div
        className={`navbar-mobile-backdrop lg:hidden${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        id={menuId}
        className={`navbar-mobile-panel lg:hidden${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile Navigation"
        aria-hidden={!menuOpen}
      >
        <ul className="navbar-mobile-list">
          {navLinks.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  scroll={false}
                  aria-current={isActive ? "location" : undefined}
                  tabIndex={menuOpen ? undefined : -1}
                  onClick={(e) => handleSectionClick(e, link.href, true)}
                  className={`navbar-mobile-link${isActive ? " is-active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href="#kontakt"
        scroll={false}
        onClick={(e) => handleSectionClick(e, "#kontakt")}
        className="navbar-mobile-fab cta-shine lg:hidden"
        aria-label={nav.ctaLabel}
        title={nav.ctaLabel}
      >
        <ProjectFabIcon />
      </Link>
    </>
  );
}
