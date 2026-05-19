"use client";

import type { ContactContent, NavContent } from "@/lib/cms/types";
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
  contact: ContactContent;
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

export function LuxuryNavbar({ nav, contact }: LuxuryNavbarProps) {
  const menuId = useId();
  const [activeHash, setActiveHash] = useState("#start");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () =>
      nav.links
        .map((link) => ({
          ...link,
          href: normalizeNavHref(link.href),
        }))
        .filter((link) => link.visible !== false)
        .filter((link) => link.href !== "#technologien"),
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
    const frame = window.requestAnimationFrame(updateActiveFromScroll);
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    return () => {
      window.cancelAnimationFrame(frame);
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

  const fabChannel = contact.channels?.find(
    (channel) =>
      channel.visible &&
      channel.href &&
      (channel.route === "fab" || channel.route === "all"),
  );
  const fabHref = fabChannel?.href || nav.ctaHref || "#kontakt";
  const fabLabel = fabChannel?.label || nav.ctaLabel;

  return (
    <>
      <header className="navbar-desktop-nav pointer-events-none fixed inset-x-0 top-4 z-50 hidden w-full lg:block">
        <div className="navbar-bar navbar-bar--desktop pointer-events-auto mx-auto flex max-w-7xl items-center justify-center px-6 lg:px-8">
          <nav className="navbar-nav-pill" aria-label="Hauptnavigation">
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
        </div>
      </header>

      <button
        type="button"
        className="navbar-menu-toggle navbar-menu-toggle--fixed lg:hidden"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MenuIcon open={menuOpen} />
        <span className="sr-only">{menuOpen ? "Menü schließen" : "Menü öffnen"}</span>
      </button>

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
          <li>
            <Link
              href="#start"
              scroll={false}
              tabIndex={menuOpen ? undefined : -1}
              onClick={(e) => handleSectionClick(e, "#start", true)}
              className="navbar-mobile-link navbar-mobile-link--brand"
            >
              OrzuIT
            </Link>
          </li>
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
        href={fabHref}
        scroll={false}
        onClick={(e) => handleSectionClick(e, fabHref)}
        className="navbar-contact-fab cta-shine"
        aria-label={fabLabel}
        title={fabLabel}
      >
        <ProjectFabIcon />
      </Link>
    </>
  );
}
