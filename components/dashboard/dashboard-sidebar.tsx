"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS } from "@/components/dashboard/nav-config";
import { LogoutButton } from "@/components/dashboard/logout-button";

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar flex w-full shrink-0 flex-col border-b border-[var(--border)] bg-[var(--surface-panel)] px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]"
        >
          Orzu<span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">IT</span>
        </Link>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
          Control Center
        </p>
      </div>

      <nav
        className="flex flex-1 flex-col gap-6 lg:overflow-y-auto"
        aria-label="Dashboard"
      >
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              {group.label}
            </p>
            <p className="mt-0.5 px-3 text-[10px] leading-snug text-[var(--muted)] opacity-80">
              {group.description}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {group.items.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group block rounded-xl border px-3 py-2.5 text-sm transition-[border-color,background-color,color] duration-200 ${
                        active
                          ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--surface-elevated)_90%,black)] text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
                          : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-white/[0.03] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="block font-semibold">{item.label}</span>
                      <span className="mt-0.5 block text-xs font-normal text-[var(--muted)]">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-6 lg:mt-auto">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Zur Website
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
