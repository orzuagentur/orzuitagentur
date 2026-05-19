"use client";

import {
  deletePageBlock,
  deletePageSection,
  duplicatePageBlock,
  duplicatePageSection,
} from "@/actions/cms/page-builder";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import type { FormEvent } from "react";

type BuilderDangerActionsProps = {
  kind: "section" | "block";
  id: string;
  pageId: string;
  title: string;
};

export function BuilderDangerActions({
  kind,
  id,
  pageId,
  title,
}: BuilderDangerActionsProps) {
  const deleteAction = kind === "section" ? deletePageSection : deletePageBlock;
  const duplicateAction =
    kind === "section" ? duplicatePageSection : duplicatePageBlock;

  function onDelete(event: FormEvent<HTMLFormElement>) {
    if (!confirm(`${kind === "section" ? "Sektion" : "Block"} „${title}“ löschen?`)) {
      event.preventDefault();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={duplicateAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="page_id" value={pageId} />
        <DashboardSubmitButton size="sm" pendingLabel="Dupliziert">
          Duplizieren
        </DashboardSubmitButton>
      </form>
      <form action={deleteAction} onSubmit={onDelete}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="page_id" value={pageId} />
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
