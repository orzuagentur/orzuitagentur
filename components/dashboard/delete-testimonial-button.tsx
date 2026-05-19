"use client";

import { deleteTestimonialRow } from "@/actions/cms/tables";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { FormEvent } from "react";

type DeleteTestimonialButtonProps = {
  id: string;
  authorLabel: string;
};

export function DeleteTestimonialButton({
  id,
  authorLabel,
}: DeleteTestimonialButtonProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (
      !confirm(
        `Karte „${authorLabel}“ endgültig löschen? Sie verschwindet auch von der Startseite.`,
      )
    ) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteTestimonialRow} onSubmit={onSubmit} className="inline">
      <input type="hidden" name="id" value={id} />
      <DashboardSubmitButton
        pendingLabel="Gelöscht"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold uppercase tracking-wider text-red-300/90 transition-[border-color,background-color,color,box-shadow] duration-200"
      >
        Löschen
      </DashboardSubmitButton>
    </form>
  );
}
