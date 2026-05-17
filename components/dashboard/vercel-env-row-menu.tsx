"use client";

import {
  confirmDeleteVercelEnvModal,
  issueDeleteVercelEnvCode,
  upsertVercelEnvModal,
} from "@/actions/vercel/env";
import { DashboardModal } from "@/components/dashboard/dashboard-modal";
import { useDashboardToast } from "@/components/dashboard/dashboard-toast-provider";
import { TOAST_MESSAGES } from "@/lib/dashboard/toast-messages";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";
const btnClass =
  "inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]";
const btnDangerClass =
  "inline-flex h-9 items-center justify-center rounded-full border border-red-500/50 bg-red-600/20 px-4 text-xs font-semibold uppercase tracking-wider text-red-100 disabled:opacity-50";

type ModalKind = "edit" | "delete-warning" | "delete-confirm" | null;

type VercelEnvRowMenuProps = {
  envId: string;
  envKey: string;
  envType: string;
  targets: ("production" | "preview" | "development")[];
};

export function VercelEnvRowMenu({
  envId,
  envKey,
  envType,
  targets,
}: VercelEnvRowMenuProps) {
  const router = useRouter();
  const { pushToast } = useDashboardToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [displayCode, setDisplayCode] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const hasProduction = targets.includes("production");
  const hasPreview = targets.includes("preview");
  const hasDevelopment = targets.includes("development");
  const isSensitive = envType === "encrypted" || envType === "secret";

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  function closeAll() {
    setMenuOpen(false);
    setModal(null);
    setDisplayCode(null);
    setConfirmCode("");
    setError(null);
  }

  function openDeleteWarning() {
    setMenuOpen(false);
    setError(null);
    setDisplayCode(null);
    setConfirmCode("");
    setModal("delete-warning");
  }

  function openEdit() {
    setMenuOpen(false);
    setError(null);
    setModal("edit");
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
      setModal("delete-confirm");
    });
  }

  function submitEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertVercelEnvModal(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      closeAll();
      pushToast(TOAST_MESSAGES.env_saved.message, "success");
      router.refresh();
    });
  }

  function submitDelete() {
    if (confirmCode.length !== 10) return;
    setError(null);
    startTransition(async () => {
      const result = await confirmDeleteVercelEnvModal(envId, confirmCode);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      closeAll();
      pushToast(TOAST_MESSAGES.deleted.message, "success");
      router.refresh();
    });
  }

  return (
    <>
      <div ref={menuRef} className="relative inline-flex justify-end">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-lg leading-none text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
          aria-label={`Aktionen für ${envKey}`}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          ⋮
        </button>

        {menuOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_98%,black)] py-1 shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              className="block w-full px-4 py-2.5 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-white/[0.04]"
              onClick={openEdit}
            >
              Bearbeiten
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-4 py-2.5 text-left text-sm text-red-300/90 transition-colors hover:bg-red-500/10"
              onClick={openDeleteWarning}
            >
              Löschen
            </button>
          </div>
        ) : null}
      </div>

      <DashboardModal
        open={modal === "edit"}
        onClose={closeAll}
        title="Variable bearbeiten"
      >
        <form onSubmit={submitEdit} className="space-y-3 text-sm">
          <p className="text-[var(--muted)]">
            Key <span className="font-mono text-[var(--foreground)]">{envKey}</span> —
            neuer Wert überschreibt den Eintrag in Vercel. Danach Redeploy.
          </p>
          <input type="hidden" name="key" value={envKey} />
          <div>
            <label className={labelClass} htmlFor={`edit-value-${envId}`}>
              Neuer Wert
            </label>
            <input
              id={`edit-value-${envId}`}
              name="value"
              type="password"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div className="flex flex-wrap gap-3 text-[var(--foreground)]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sensitive"
                defaultChecked={isSensitive}
                className="h-4 w-4"
              />
              Verschlüsselt
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="targetProduction"
                defaultChecked={hasProduction}
                className="h-4 w-4"
              />
              Production
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="targetPreview"
                defaultChecked={hasPreview}
                className="h-4 w-4"
              />
              Preview
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="targetDevelopment"
                defaultChecked={hasDevelopment}
                className="h-4 w-4"
              />
              Development
            </label>
          </div>
          {error ? (
            <p className="text-xs text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={pending} className={btnClass}>
              {pending ? "Speichern…" : "Speichern"}
            </button>
            <button type="button" onClick={closeAll} className={btnClass}>
              Abbrechen
            </button>
          </div>
        </form>
      </DashboardModal>

      <DashboardModal
        open={modal === "delete-warning"}
        onClose={closeAll}
        title="Schritt 1 — Löschen bestätigen"
        variant="danger"
      >
        <div className="space-y-3 text-sm">
          <p className="text-[var(--muted)]">
            Sie löschen{" "}
            <strong className="font-mono text-[var(--foreground)]">{envKey}</strong> in
            Vercel. Mögliche Folgen:
          </p>
          <ul className="list-inside list-disc space-y-1 text-[var(--muted)]">
            <li>Die App kann nach dem nächsten Aufruf Fehler werfen.</li>
            <li>Supabase, Resend, Telegram oder Admin-Login können ausfallen.</li>
            <li>Ein Redeploy stellt den Wert nicht wieder her.</li>
          </ul>
          {error ? (
            <p className="text-xs text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={pending}
              onClick={loadConfirmationCode}
              className={btnDangerClass}
            >
              {pending ? "Code wird erzeugt…" : "Weiter — Code anzeigen"}
            </button>
            <button type="button" onClick={closeAll} className={btnClass}>
              Abbrechen
            </button>
          </div>
        </div>
      </DashboardModal>

      <DashboardModal
        open={modal === "delete-confirm" && Boolean(displayCode)}
        onClose={closeAll}
        title="Schritt 2 — Sicherheitscode"
        variant="danger"
      >
        <div className="space-y-3 text-sm">
          <p className="text-[var(--muted)]">
            Geben Sie die 10 Ziffern exakt ein. Gültig für 10 Minuten.
          </p>
          {displayCode ? (
            <p
              className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-[var(--accent)]"
              aria-label="Bestätigungscode"
            >
              {displayCode}
            </p>
          ) : null}
          <div>
            <label className={labelClass} htmlFor={`confirm-${envId}`}>
              Code eingeben
            </label>
            <input
              id={`confirm-${envId}`}
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              value={confirmCode}
              onChange={(e) =>
                setConfirmCode(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className={`${inputClass} font-mono text-lg tracking-widest`}
              placeholder="0000000000"
            />
          </div>
          {error ? (
            <p className="text-xs text-red-400/90" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={confirmCode.length !== 10 || pending}
              onClick={submitDelete}
              className={btnDangerClass}
            >
              {pending ? "Löschen…" : "Ich bestätige das Löschen"}
            </button>
            <button type="button" onClick={closeAll} className={btnClass}>
              Abbrechen
            </button>
          </div>
        </div>
      </DashboardModal>
    </>
  );
}
