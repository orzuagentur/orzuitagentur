"use client";

import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { getDashboardPageMeta } from "@/lib/dashboard/page-meta";
import { usePathname } from "next/navigation";

export function DashboardTopBar() {
  const pathname = usePathname();
  const meta = getDashboardPageMeta(pathname);

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
    </header>
  );
}
