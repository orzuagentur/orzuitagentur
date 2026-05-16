"use client";

import { deleteTestimonialRow } from "@/actions/cms/tables";
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
        `Referenz von „${authorLabel}“ endgültig löschen? Sie verschwindet auch von der Startseite.`,
      )
    ) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteTestimonialRow} onSubmit={onSubmit} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold uppercase tracking-wider text-red-300/90 transition-opacity hover:opacity-90"
      >
        Löschen
      </button>
    </form>
  );
}
