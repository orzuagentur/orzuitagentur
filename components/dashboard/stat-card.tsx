import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[var(--foreground)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
