import type { LegalSiteInfo } from "@/lib/legal/site-legal";
import type { LegalSection } from "@/lib/legal/types";
import { getCanonicalUrl } from "@/lib/site/url";

export function buildDatenschutzSections(info: LegalSiteInfo): LegalSection[] {
  const siteUrl = getCanonicalUrl("/");

  return [
    {
      id: "verantwortlicher",
      title: "1. Verantwortlicher",
      blocks: [
        {
          type: "p",
          text: `Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:`,
        },
        {
          type: "contact",
          lines: [
            info.company,
            ...(info.representative ? [info.representative] : []),
            ...info.addressLines,
            "Deutschland",
            `E-Mail: ${info.email}`,
            ...(info.phone ? [`Telefon: ${info.phone}`] : []),
          ],
        },
      ],
    },
    {
      id: "ueberblick",
      title: "2. Überblick der Datenverarbeitung",
      blocks: [
        {
          type: "p",
          text: "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website, zur Kommunikation mit Ihnen oder zur Erfüllung gesetzlicher Pflichten erforderlich ist.",
        },
        {
          type: "ul",
          items: [
            "Besuch der Website (technisch notwendige Daten, Analytics)",
            "Kontaktformular (Anfrage, Speicherung, Benachrichtigung)",
            "Admin-Bereich (geschützter Zugang für autorisierte Nutzer)",
          ],
        },
      ],
    },
    {
      id: "hosting",
      title: "3. Hosting und Content Delivery",
      blocks: [
        {
          type: "p",
          text: `Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite werden Verbindungsdaten (z. B. IP-Adresse, Zeitpunkt, User-Agent, angeforderte URL) verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren und effizienten Bereitstellung).`,
        },
        {
          type: "p",
          text: "Weitere Informationen: https://vercel.com/legal/privacy-policy",
        },
      ],
    },
    {
      id: "analytics",
      title: "4. Webanalyse (Vercel Analytics & Speed Insights)",
      blocks: [
        {
          type: "p",
          text: "Wir nutzen Vercel Analytics und Vercel Speed Insights, um die Nutzung der Website statistisch auszuwerten und die Performance zu verbessern. Dabei können u. a. Seitenaufrufe, Referrer, Gerätetyp und Ladezeiten verarbeitet werden.",
        },
        {
          type: "p",
          text: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung unseres Angebots). Sie können der Verarbeitung durch Setzen eines Do-Not-Track-Signals im Browser oder durch Blockieren von Skripten widersprechen, soweit technisch möglich.",
        },
      ],
    },
    {
      id: "kontaktformular",
      title: "5. Kontaktformular",
      blocks: [
        {
          type: "p",
          text: "Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir die von Ihnen eingegebenen Daten (z. B. Name, E-Mail, Unternehmen, Nachricht) sowie den Zeitpunkt der Übermittlung.",
        },
        {
          type: "ul",
          items: [
            "Zweck: Bearbeitung Ihrer Anfrage und Kommunikation mit Ihnen",
            "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen)",
            "Speicherung: Datenbank (Supabase), sofern serverseitig konfiguriert",
            "E-Mail-Benachrichtigung: Resend (Team und ggf. Bestätigung an Sie)",
            "Optional: Telegram-Benachrichtigung an unser Team",
          ],
        },
        {
          type: "p",
          text: "Die Angabe im Kontaktformular ist freiwillig; ohne die erforderlichen Felder können wir Ihre Anfrage jedoch nicht bearbeiten. Die Datenschutzerklärung müssen Sie vor dem Absenden bestätigen.",
        },
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies und lokale Speicherung",
      blocks: [
        {
          type: "p",
          text: "Wir verwenden technisch notwendige Cookies bzw. lokale Speicherung für den geschützten Admin-Bereich (Supabase Auth-Session). Im öffentlichen Bereich setzen wir keine Marketing-Cookies ein.",
        },
        {
          type: "p",
          text: "Vercel Analytics kann Cookies oder vergleichbare Technologien einsetzen. Details entnehmen Sie der Datenschutzerklärung von Vercel.",
        },
      ],
    },
    {
      id: "speicherdauer",
      title: "7. Speicherdauer",
      blocks: [
        {
          type: "p",
          text: "Kontaktanfragen speichern wir, solange dies zur Bearbeitung erforderlich ist und gesetzliche Aufbewahrungsfristen nicht entgegenstehen. Server-Logdaten beim Hosting-Anbieter werden nach dessen Richtlinien gelöscht.",
        },
      ],
    },
    {
      id: "rechte",
      title: "8. Ihre Rechte",
      blocks: [
        {
          type: "p",
          text: "Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:",
        },
        {
          type: "ul",
          items: [
            "Auskunft (Art. 15 DSGVO)",
            "Berichtigung (Art. 16 DSGVO)",
            "Löschung (Art. 17 DSGVO)",
            "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
            "Datenübertragbarkeit (Art. 20 DSGVO)",
            "Widerspruch (Art. 21 DSGVO)",
            "Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)",
          ],
        },
        {
          type: "p",
          text: `Zur Ausübung Ihrer Rechte wenden Sie sich an: ${info.email}. Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.`,
        },
      ],
    },
    {
      id: "sicherheit",
      title: "9. Datensicherheit",
      blocks: [
        {
          type: "p",
          text: "Diese Website nutzt TLS-Verschlüsselung (HTTPS). Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre Daten vor Verlust, Missbrauch und unberechtigtem Zugriff zu schützen.",
        },
      ],
    },
    {
      id: "aenderungen",
      title: "10. Aktualität",
      blocks: [
        {
          type: "p",
          text: `Stand: ${new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}. Wir passen diese Datenschutzerklärung an, wenn sich unsere Website, Dienste oder rechtliche Anforderungen ändern. Maßgeblich ist die jeweils auf ${siteUrl} veröffentlichte Fassung.`,
        },
      ],
    },
  ];
}
