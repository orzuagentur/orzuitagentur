"use client";

import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import type { DashboardTheme } from "@/lib/theme/dashboard-theme";

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M15.5 11.2a5.5 5.5 0 0 1-7.7-7.7 5.5 5.5 0 1 0 7.7 7.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeOption({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
        active
          ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-sm"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useDashboardTheme();

  function pick(next: DashboardTheme) {
    if (theme !== next) setTheme(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Design-Theme"
      className="inline-flex shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5 shadow-sm"
    >
      <ThemeOption
        active={theme === "dark"}
        label="Dunkel"
        icon={<MoonIcon />}
        onClick={() => pick("dark")}
      />
      <ThemeOption
        active={theme === "light"}
        label="Hell"
        icon={<SunIcon />}
        onClick={() => pick("light")}
      />
    </div>
  );
}
