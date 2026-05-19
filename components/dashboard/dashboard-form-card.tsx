import Link from "next/link";
import type { ReactNode } from "react";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";

type DashboardFormCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  previewHref?: string;
  previewLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
};

type DashboardFormActionsProps = {
  submitLabel?: ReactNode;
  pendingLabel?: ReactNode;
  hint?: ReactNode;
};

export function DashboardFormCard({
  eyebrow,
  title,
  description,
  meta,
  previewHref,
  previewLabel = "Vorschau öffnen",
  children,
  footer,
}: DashboardFormCardProps) {
  return (
    <section className="max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)]">
      <div className="border-b border-[var(--border)] px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                {description}
              </p>
            ) : null}
            {meta ? (
              <p className="mt-2 font-mono text-[11px] text-[var(--muted)]">
                {meta}
              </p>
            ) : null}
          </div>
          {previewHref ? (
            <Link
              href={previewHref}
              target={previewHref.startsWith("/") ? undefined : "_blank"}
              rel={previewHref.startsWith("/") ? undefined : "noopener noreferrer"}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--foreground)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border-strong))]"
            >
              {previewLabel}
            </Link>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 px-6 py-5">{children}</div>
      {footer ? (
        <div className="border-t border-[var(--border)] bg-white/[0.015] px-6 py-4">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export function DashboardFormActions({
  submitLabel = "Speichern",
  pendingLabel = "Gespeichert",
  hint = "Speichern aktualisiert die Website nach kurzer Cache-Aktualisierung.",
}: DashboardFormActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-md text-xs leading-relaxed text-[var(--muted)]">
        {hint}
      </p>
      <DashboardSubmitButton size="md" pendingLabel={pendingLabel}>
        {submitLabel}
      </DashboardSubmitButton>
    </div>
  );
}
