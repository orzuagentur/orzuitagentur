import type { LegalSiteInfo } from "@/lib/legal/site-legal";
import type { LegalSection } from "@/lib/legal/types";

export function buildImpressumSections(info: LegalSiteInfo): LegalSection[] {
  const operatorLines = [
    info.company,
    ...(info.representative ? [`Vertreten durch: ${info.representative}`] : []),
    ...info.addressLines,
    "Deutschland",
  ];

  const contactLines = [
    `E-Mail: ${info.email}`,
    ...(info.phone ? [`Telefon: ${info.phone}`] : []),
  ];

  const sections: LegalSection[] = [
    {
      id: "tmg",
      title: "Angaben gemäß § 5 TMG",
      blocks: [{ type: "contact", lines: operatorLines }],
    },
    {
      id: "kontakt",
      title: "Kontakt",
      blocks: [{ type: "contact", lines: contactLines }],
    },
  ];

  if (info.registerCourt && info.registerNumber) {
    sections.push({
      id: "register",
      title: "Registereintrag",
      blocks: [
        {
          type: "p",
          text: `Registergericht: ${info.registerCourt}`,
        },
        {
          type: "p",
          text: `Registernummer: ${info.registerNumber}`,
        },
      ],
    });
  }

  if (info.vatId) {
    sections.push({
      id: "vat",
      title: "Umsatzsteuer-ID",
      blocks: [
        {
          type: "p",
          text: `Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: ${info.vatId}`,
        },
      ],
    });
  }

  sections.push(
    {
      id: "mstv",
      title: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      blocks: [
        {
          type: "contact",
          lines: info.representative
            ? [info.representative, ...info.addressLines, "Deutschland"]
            : [info.company, ...info.addressLines, "Deutschland"],
        },
      ],
    },
    {
      id: "eu-odr",
      title: "EU-Streitschlichtung",
      blocks: [
        {
          type: "p",
          text: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse finden Sie oben im Impressum.",
        },
        {
          type: "p",
          text: "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        },
      ],
    },
    {
      id: "haftung-inhalt",
      title: "Haftung für Inhalte",
      blocks: [
        {
          type: "p",
          text: "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
        },
        {
          type: "p",
          text: "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.",
        },
      ],
    },
    {
      id: "haftung-links",
      title: "Haftung für Links",
      blocks: [
        {
          type: "p",
          text: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
        },
      ],
    },
    {
      id: "urheber",
      title: "Urheberrecht",
      blocks: [
        {
          type: "p",
          text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
        },
      ],
    },
  );

  return sections;
}
