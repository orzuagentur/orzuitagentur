"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LuxuryFooter } from "@/components/layout/luxury-footer";
import { LuxuryNavbar } from "@/components/layout/luxury-navbar";
import type { ContactContent, FooterContent, NavContent } from "@/lib/cms/types";

type ConditionalSiteChromeProps = {
  children: ReactNode;
  nav: NavContent;
  footer: FooterContent;
  contact: ContactContent;
};

export function ConditionalSiteChrome({
  children,
  nav,
  footer,
  contact,
}: ConditionalSiteChromeProps) {
  const pathname = usePathname();
  const visibleNavLinks = nav.links.filter(
    (link) =>
      link.visible !== false &&
      link.href.trim().toLowerCase() !== "#technologien",
  );
  const isAdminShell =
    pathname.startsWith("/dashboard") || pathname.startsWith("/auth");

  if (isAdminShell) {
    return <>{children}</>;
  }

  return (
    <>
      <LuxuryNavbar nav={nav} contact={contact} />
      <main className="site-main-with-contact-fab flex flex-1 flex-col">
        {children}
      </main>
      <LuxuryFooter footer={footer} navLinks={visibleNavLinks} contact={contact} />
    </>
  );
}
