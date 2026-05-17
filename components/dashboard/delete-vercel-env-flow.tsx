"use client";

import {
  confirmDeleteVercelEnv,
  issueDeleteVercelEnvCode,
} from "@/actions/vercel/env";
import { useState, useTransition } from "react";

type Step = "idle" | "warning" | "confirm";

export function DeleteVercelEnvFlow({
  envId,
  envKey,
}: {
  envId: string;
  envKey: string;
}) {
  const [step, setStep] = useState<Step>("idle");
  const [displayCode, setDisplayCode] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function reset() {
    setStep("idle");
    setDisplayCode(null);
    setConfirmCode("");
    setError(null);
  }

  function loadConfirmationCode() {
    setError(null);
    startTransition(async () => {
      const result = await issueDeleteVercelEnvCode(envId, envKey);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDisplayCode(result.code);
      setStep("confirm");
    });
  }

  if (step === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStep("warning")}
        className="text-xs font-semibold uppercase tracking-wider text-red-300/80 hover:text-red-200"
      >
        Löschen
      </button>
    );
  }

  return (
    <div className="mt-3 w-full max-w-md rounded-xl border border-red-500/25 bg-red-500/5 p-4 text-sm">
      {step === "warning" ? (
        <div className="space-y-3">
          <p className="font-semibold text-red-200">
            Schritt 1 — Folgen des Löschens
          </p>
          <p className="text-[var(--muted)]">
            Sie löschen <strong className="text-[var(--foreground)]">{envKey}</strong>{" "}
            in Vercel. Mögliche Folgen:
          </p>
          <ul className="list-inside list-disc space-y-1 text-[var(--muted)]">
            <li>Die App kann nach dem nächsten Aufruf Fehler werfen.</li>
            <li>Supabase, Resend, Telegram oder Admin-Login können ausfallen.</li>
            <li>Ein Redeploy allein stellt den Wert nicht wieder her.</li>
            <li>Sie müssen den Key danach manuell neu anlegen.</li>
          </ul>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={pending}
              onClick={loadConfirmationCode}
              className="inline-flex h-9 items-center justify-center rounded-full border border-red-500/40 bg-red-500/15 px-4 text-xs font-semibold uppercase tracking-wider text-red-100"
            >
              {pending ? "Code wird erzeugt…" : "Weiter — Code anzeigen"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
            >
              Abbrechen
            </button>
          </div>
          {error ? (
            <p className="text-xs text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === "confirm" && displayCode ? (
        <form action={confirmDeleteVercelEnv} className="space-y-3">
          <p className="font-semibold text-red-200">
            Schritt 2 — Bestätigungscode
          </p>
          <p className="text-[var(--muted)]">
            Geben Sie die folgenden 10 Ziffern exakt in das Feld ein. Der Code
            ist 10 Minuten gültig.
          </p>
          <p
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-[var(--accent)]"
            aria-label="Bestätigungscode"
          >
            {displayCode}
          </p>
          <input type="hidden" name="envId" value={envId} />
          <div>
            <label
              className="block text-xs font-medium text-[var(--muted)]"
              htmlFor={`confirm-${envId}`}
            >
              Code eingeben
            </label>
            <input
              id={`confirm-${envId}`}
              name="confirmCode"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              required
              autoComplete="off"
              value={confirmCode}
              onChange={(e) =>
                setConfirmCode(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 font-mono text-lg tracking-widest text-[var(--foreground)] outline-none focus:border-red-400/50"
              placeholder="0000000000"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={confirmCode.length !== 10 || pending}
              className="inline-flex h-9 items-center justify-center rounded-full border border-red-500/50 bg-red-600/20 px-4 text-xs font-semibold uppercase tracking-wider text-red-100 disabled:opacity-50"
            >
              Ich bestätige das Löschen
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
            >
              Abbrechen
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
