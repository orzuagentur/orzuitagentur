export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "contact"; lines: string[] };
