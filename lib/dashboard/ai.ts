import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export const AI_DRAFT_KINDS = [
  "content",
  "seo",
  "translation",
  "lead_summary",
  "assistant",
] as const;

export type AiDraftKind = (typeof AI_DRAFT_KINDS)[number];

export type AiDraftRow = {
  id: string;
  kind: AiDraftKind;
  prompt: string;
  output: string;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
};

export async function getAiDrafts(limit = 30): Promise<AiDraftRow[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("ai_drafts")
    .select("id,kind,prompt,output,metadata,created_by,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getAiDrafts]", error);
    return [];
  }

  return (data ?? []) as AiDraftRow[];
}

export function buildLocalAiDraft(kind: AiDraftKind, prompt: string) {
  const clean = prompt.trim();
  if (kind === "seo") {
    return [
      "SEO Title: OrzuIT - Software, KI und Webloesungen",
      "SEO Description: OrzuIT entwickelt individuelle Software, KI-Automatisierung und moderne Websites fuer wachsende Unternehmen.",
      "OG Prompt: Dark luxury technology cover, glowing blue-violet gradient, clean OrzuIT brand style.",
      "",
      `Kontext: ${clean}`,
    ].join("\n");
  }

  if (kind === "translation") {
    return [
      "DE -> EN Entwurf:",
      clean,
      "",
      "Hinweis: Bitte final menschlich pruefen, Fachbegriffe und Tonalitaet an Marke anpassen.",
    ].join("\n");
  }

  if (kind === "lead_summary") {
    return [
      "Lead-Zusammenfassung:",
      "- Bedarf: aus Nachricht ableiten",
      "- Naechster Schritt: Rueckfrage zu Ziel, Budget und Zeitplan",
      "- Prioritaet: normal, wenn kein dringender Zeitrahmen genannt wurde",
      "",
      clean,
    ].join("\n");
  }

  if (kind === "assistant") {
    return [
      "Admin-Assistent:",
      "1. Ziel klaeren",
      "2. Betroffene CMS-Seite oeffnen",
      "3. Aenderung speichern und Vorschau pruefen",
      "",
      `Antwort auf Anfrage: ${clean}`,
    ].join("\n");
  }

  return [
    "Content-Entwurf:",
    "Headline: Digitale Loesungen, die Ihr Team wirklich entlasten.",
    "Subline: OrzuIT verbindet klare Beratung, moderne Software und kontrollierte KI-Automatisierung.",
    "CTA: Projekt besprechen",
    "",
    `Kontext: ${clean}`,
  ].join("\n");
}
