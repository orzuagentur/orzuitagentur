import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Kept for page metadata; title is shown in DashboardTopBar. */
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function DashboardPageHeader({
  description,
  actions,
}: PageHeaderProps) {
  if (!description && !actions) return null;

  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)] px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-10">
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {description}
        </p>
      ) : (
        <div />
      )}
      {actions ? <div className="flex shrink-0 gap-3">{actions}</div> : null}
    </div>
  );
}
