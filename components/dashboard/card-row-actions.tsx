"use client";

import {
  deletePortfolioRow,
  deleteServiceRow,
  duplicatePortfolioRow,
  duplicateServiceRow,
} from "@/actions/cms/tables";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import type { FormEvent } from "react";

type CardRowActionsProps = {
  kind: "service" | "portfolio";
  id: string;
  slug: string;
  title: string;
};

export function CardRowActions({ kind, id, slug, title }: CardRowActionsProps) {
  const deleteAction = kind === "service" ? deleteServiceRow : deletePortfolioRow;
  const duplicateAction =
    kind === "service" ? duplicateServiceRow : duplicatePortfolioRow;

  function confirmDelete(e: FormEvent<HTMLFormElement>) {
    if (
      !confirm(
        `Karte „${title}“ endgültig löschen? Sie verschwindet auch von der Website.`,
      )
    ) {
      e.preventDefault();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={duplicateAction} className="inline">
        <input type="hidden" name="id" value={id} />
        <DashboardSubmitButton
          pendingLabel="Dupliziert"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] transition-[border-color,background-color,color,box-shadow] duration-200"
        >
          Duplizieren
        </DashboardSubmitButton>
      </form>
      <form action={deleteAction} onSubmit={confirmDelete} className="inline">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="slug" value={slug} />
        <DashboardSubmitButton
          pendingLabel="Gelöscht"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold uppercase tracking-wider text-red-300/90 transition-[border-color,background-color,color,box-shadow] duration-200"
        >
          Löschen
        </DashboardSubmitButton>
      </form>
    </div>
  );
}
