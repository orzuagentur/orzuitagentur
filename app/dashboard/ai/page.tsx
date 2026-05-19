import { createAiDraft } from "@/actions/cms/ai";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getAiDrafts, type AiDraftKind } from "@/lib/dashboard/ai";
import { getRecentLeads } from "@/lib/dashboard/leads";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";

const aiCards: { kind: AiDraftKind; title: string; description: string }[] = [
  {
    kind: "content",
    title: "AI Content-Entwurf",
    description: "Headlines, Subtitles und CTA-Texte fuer Sektionen vorbereiten.",
  },
  {
    kind: "seo",
    title: "AI SEO",
    description: "Title, Description und OG-Prompt aus Seitenkontext ableiten.",
  },
  {
    kind: "translation",
    title: "AI Uebersetzung",
    description: "DE/EN-Struktur vorbereiten, finale Tonalitaet manuell pruefen.",
  },
  {
    kind: "lead_summary",
    title: "AI Lead-Zusammenfassung",
    description: "Lead-Bedarf, Prioritaet und naechsten Schritt zusammenfassen.",
  },
  {
    kind: "assistant",
    title: "Admin-Assistent",
    description: "Fragen zur Bedienung des Control Centers strukturiert beantworten.",
  },
];

export default async function DashboardAiPage() {
  const [drafts, leads] = await Promise.all([getAiDrafts(), getRecentLeads(5)]);
  const latestLead = leads[0];

  return (
    <>
      <DashboardPageHeader
        title="AI Automation Hub"
        description="Kontrollierte AI-Workflows fuer Content, SEO, Uebersetzung, Leads und Admin-Hilfe. Baseline arbeitet lokal und ist fuer Provider-Anbindung vorbereitet."
      />
      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="grid gap-4 lg:grid-cols-2">
          {aiCards.map((card) => (
            <article
              key={card.kind}
              className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5"
            >
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{card.description}</p>
              <form action={createAiDraft} className="mt-4 space-y-3">
                <input type="hidden" name="kind" value={card.kind} />
                <textarea
                  className={`${inputClass} min-h-[130px]`}
                  name="prompt"
                  placeholder={
                    card.kind === "lead_summary" && latestLead
                      ? `${latestLead.name}: ${latestLead.message}`
                      : "Kontext, Zielgruppe, Tonalitaet und gewuenschtes Ergebnis..."
                  }
                  defaultValue={
                    card.kind === "lead_summary" && latestLead
                      ? `${latestLead.name} (${latestLead.email})\nService: ${latestLead.service_interest ?? "-"}\n${latestLead.message}`
                      : ""
                  }
                />
                <DashboardSubmitButton size="sm" pendingLabel="Erstellt">
                  Entwurf erstellen
                </DashboardSubmitButton>
              </form>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Letzte AI-Entwuerfe
          </h2>
          <div className="mt-4 space-y-3">
            {drafts.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Noch keine Entwuerfe.</p>
            ) : (
              drafts.map((draft) => (
                <article key={draft.id} className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    {draft.kind} · {new Date(draft.created_at).toLocaleString("de-DE")}
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">
                    {draft.output}
                  </pre>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
