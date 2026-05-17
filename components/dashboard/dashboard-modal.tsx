"use client";

import { type ReactNode, useEffect } from "react";

type DashboardModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: "default" | "danger";
};

export function DashboardModal({
  open,
  onClose,
  title,
  children,
  variant = "default",
}: DashboardModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Dialog schließen"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-modal-title"
        className={`relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] ${
          variant === "danger"
            ? "border-red-500/30 bg-[color-mix(in_oklab,var(--surface-elevated)_96%,#1a0505)]"
            : "border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_96%,black)]"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="dashboard-modal-title"
            className={`text-lg font-semibold ${variant === "danger" ? "text-red-100" : "text-[var(--foreground)]"}`}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
