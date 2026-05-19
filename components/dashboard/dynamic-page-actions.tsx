"use client";

import {
  deleteDynamicPage,
  duplicateDynamicPage,
} from "@/actions/cms/pages";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import type { FormEvent } from "react";

export function DynamicPageActions({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!confirm(`Seite „${title}“ endgültig löschen?`)) {
      event.preventDefault();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={duplicateDynamicPage}>
        <input type="hidden" name="id" value={id} />
        <DashboardSubmitButton
          size="sm"
          pendingLabel="Dupliziert"
          className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]"
        >
          Duplizieren
        </DashboardSubmitButton>
      </form>
      <form action={deleteDynamicPage} onSubmit={confirmDelete}>
        <input type="hidden" name="id" value={id} />
        <DashboardSubmitButton
          size="sm"
          pendingLabel="Gelöscht"
          className="inline-flex h-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold uppercase tracking-wider text-red-300/90"
        >
          Löschen
        </DashboardSubmitButton>
      </form>
    </div>
  );
}
