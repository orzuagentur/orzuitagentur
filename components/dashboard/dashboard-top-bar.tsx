"use client";

import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { getDashboardPageHelp } from "@/lib/dashboard/page-help";
import { getDashboardPageMeta } from "@/lib/dashboard/page-meta";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardTopBar() {
  const pathname = usePathname();
  const meta = getDashboardPageMeta(pathname);
  const help = getDashboardPageHelp(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_88%,transparent)] px-4 py-4 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Admin · OrzuIT
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {meta.label}
          </h1>
          {meta.description ? (
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{meta.description}</p>
          ) : null}
        </div>
        <ThemeToggle />
      </div>
      <div className="mt-4 rounded-2xl border border-[color-mix(in_oklab,var(--accent)_18%,var(--border))] bg-[color-mix(in_oklab,var(--surface-elevated)_72%,transparent)] px-4 py-3 shadow-[0_18px_48px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {help.title}
            </p>
            <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--muted)]">
              {help.body}
            </p>
          </div>
          {help.websiteHref || help.nextHref ? (
            <div className="flex shrink-0 flex-wrap gap-2">
              {help.websiteHref ? (
                <Link
                  href={help.websiteHref}
                  className="inline-flex h-9 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--foreground)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border-strong))]"
                  target={help.websiteHref.startsWith("/") ? undefined : "_blank"}
                  rel={help.websiteHref.startsWith("/") ? undefined : "noopener noreferrer"}
                >
                  {help.websiteLabel ?? "Website ansehen"}
                </Link>
              ) : null}
              {help.nextHref ? (
                <Link
                  href={help.nextHref}
                  className="inline-flex h-9 items-center rounded-full border border-[color-mix(in_oklab,var(--accent)_28%,var(--border-strong))] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 text-xs font-semibold text-[var(--foreground)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border-strong))]"
                >
                  {help.nextLabel ?? "Weiter"}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
