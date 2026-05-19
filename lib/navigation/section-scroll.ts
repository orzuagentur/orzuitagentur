/** Homepage section ids used for in-page navigation. */
export const SITE_SECTION_IDS = [
  "start",
  "leistungen",
  "portfolio",
  "technologien",
  "warum-orzuit",
  "kontakt",
] as const;

const SECTION_ID_SET = new Set<string>(SITE_SECTION_IDS);

/** Map common CMS typos / renames to the real section id. */
const HREF_ALIASES: Record<string, (typeof SITE_SECTION_IDS)[number]> = {
  orzuit: "warum-orzuit",
  "orzu-it": "warum-orzuit",
  "orzuit-it": "warum-orzuit",
  "warum-orzuit-it": "warum-orzuit",
  warumorzuit: "warum-orzuit",
  "warum-orzuit": "warum-orzuit",
  why: "warum-orzuit",
};

export function normalizeNavHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed.startsWith("#")) return trimmed;

  const raw = trimmed.slice(1).trim().toLowerCase();
  if (!raw) return "#start";

  const aliased = HREF_ALIASES[raw] ?? raw.replace(/\s+/g, "-");
  if (SECTION_ID_SET.has(aliased)) return `#${aliased}`;

  if (raw.includes("orzu") || raw.includes("warum")) {
    return "#warum-orzuit";
  }

  return trimmed;
}

export function getNavScrollOffset(): number {
  if (typeof document === "undefined") return 92;
  const header = document.querySelector("header.navbar-surface");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  if (headerHeight > 0) return headerHeight + 16;

  const mobileMenu = document.querySelector(".navbar-menu-toggle--fixed");
  if (mobileMenu) {
    const { bottom } = mobileMenu.getBoundingClientRect();
    return bottom + 12;
  }

  return 56;
}

export function scrollToSectionId(
  id: string,
  behavior: ScrollBehavior = "smooth",
): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - getNavScrollOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  window.history.replaceState(null, "", `#${id}`);
  return true;
}

export function pickActiveSectionId(
  sectionIds: readonly string[],
  offset = getNavScrollOffset(),
): string {
  if (sectionIds.length === 0) return "start";

  let active = sectionIds[0];
  const probe = offset + 48;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probe) {
      active = id;
    }
  }

  return active;
}
