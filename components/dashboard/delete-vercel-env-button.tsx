"use client";

import { deleteVercelEnv } from "@/actions/vercel/env";
import { FormEvent } from "react";

export function DeleteVercelEnvButton({
  envId,
  envKey,
}: {
  envId: string;
  envKey: string;
}) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (
      !confirm(
        `Umgebungsvariable „${envKey}“ in Vercel wirklich löschen? Ein Redeploy kann nötig sein.`,
      )
    ) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteVercelEnv} onSubmit={onSubmit} className="inline">
      <input type="hidden" name="envId" value={envId} />
      <button
        type="submit"
        className="text-xs font-semibold uppercase tracking-wider text-red-300/80 hover:text-red-200"
      >
        Löschen
      </button>
    </form>
  );
}
