"use client";

import type { LegalBlock, LegalSection } from "@/lib/legal/types";
import { useCallback, useEffect, useState } from "react";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";
const btnClass =
  "rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]";

type LegalSectionsEditorProps = {
  name: string;
  initialSections: LegalSection[];
};

function newSection(index: number): LegalSection {
  return {
    id: `abschnitt-${index + 1}`,
    title: "Neuer Abschnitt",
    blocks: [{ type: "p", text: "" }],
  };
}

function BlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: LegalBlock;
  onChange: (block: LegalBlock) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
          {block.type === "p"
            ? "Absatz"
            : block.type === "ul"
              ? "Liste"
              : "Adressblock"}
        </span>
        <button type="button" className={btnClass} onClick={onRemove}>
          Block entfernen
        </button>
      </div>

      {block.type === "p" ? (
        <textarea
          className={`${inputClass} mt-3 min-h-[88px]`}
          value={block.text}
          onChange={(e) => onChange({ type: "p", text: e.target.value })}
          placeholder="Absatztext…"
        />
      ) : null}

      {block.type === "ul" ? (
        <textarea
          className={`${inputClass} mt-3 min-h-[88px]`}
          value={block.items.join("\n")}
          onChange={(e) =>
            onChange({
              type: "ul",
              items: e.target.value.split("\n").map((s) => s.trimEnd()),
            })
          }
          placeholder="Ein Listeneintrag pro Zeile"
        />
      ) : null}

      {block.type === "contact" ? (
        <textarea
          className={`${inputClass} mt-3 min-h-[72px]`}
          value={block.lines.join("\n")}
          onChange={(e) =>
            onChange({
              type: "contact",
              lines: e.target.value.split("\n").map((s) => s.trimEnd()),
            })
          }
          placeholder="Eine Zeile pro Adresszeile"
        />
      ) : null}
    </div>
  );
}

export function LegalSectionsEditor({ name, initialSections }: LegalSectionsEditorProps) {
  const [sections, setSections] = useState<LegalSection[]>(initialSections);
  const [json, setJson] = useState(() => JSON.stringify(initialSections));

  const sync = useCallback((next: LegalSection[]) => {
    setSections(next);
    setJson(JSON.stringify(next));
  }, []);

  useEffect(() => {
    setSections(initialSections);
    setJson(JSON.stringify(initialSections));
  }, [initialSections]);

  const updateSection = (index: number, patch: Partial<LegalSection>) => {
    sync(
      sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  };

  const removeSection = (index: number) => {
    sync(sections.filter((_, i) => i !== index));
  };

  const addSection = () => {
    sync([...sections, newSection(sections.length)]);
  };

  const addBlock = (sectionIndex: number, type: LegalBlock["type"]) => {
    const block: LegalBlock =
      type === "p"
        ? { type: "p", text: "" }
        : type === "ul"
          ? { type: "ul", items: [""] }
          : { type: "contact", lines: [""] };
    sync(
      sections.map((s, i) =>
        i === sectionIndex ? { ...s, blocks: [...s.blocks, block] } : s,
      ),
    );
  };

  const updateBlock = (
    sectionIndex: number,
    blockIndex: number,
    block: LegalBlock,
  ) => {
    sync(
      sections.map((s, i) => {
        if (i !== sectionIndex) return s;
        const blocks = [...s.blocks];
        blocks[blockIndex] = block;
        return { ...s, blocks };
      }),
    );
  };

  const removeBlock = (sectionIndex: number, blockIndex: number) => {
    sync(
      sections.map((s, i) => {
        if (i !== sectionIndex) return s;
        return { ...s, blocks: s.blocks.filter((_, bi) => bi !== blockIndex) };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={json} readOnly />

      {sections.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">Noch keine Abschnitte.</p>
      ) : null}

      {sections.map((section, si) => (
        <article
          key={`${section.id}-${si}`}
          className="rounded-2xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_70%,transparent)] p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Abschnitts-ID (Anker)</label>
                <input
                  className={inputClass}
                  value={section.id}
                  onChange={(e) =>
                    updateSection(si, {
                      id: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Überschrift</label>
                <input
                  className={inputClass}
                  value={section.title}
                  onChange={(e) => updateSection(si, { title: e.target.value })}
                />
              </div>
            </div>
            <button
              type="button"
              className={`${btnClass} text-red-400/90 hover:border-red-500/30`}
              onClick={() => removeSection(si)}
            >
              Abschnitt löschen
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {section.blocks.map((block, bi) => (
              <BlockEditor
                key={`${section.id}-block-${bi}`}
                block={block}
                onChange={(b) => updateBlock(si, bi, b)}
                onRemove={() => removeBlock(si, bi)}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={btnClass} onClick={() => addBlock(si, "p")}>
              + Absatz
            </button>
            <button type="button" className={btnClass} onClick={() => addBlock(si, "ul")}>
              + Liste
            </button>
            <button
              type="button"
              className={btnClass}
              onClick={() => addBlock(si, "contact")}
            >
              + Adressblock
            </button>
          </div>
        </article>
      ))}

      <button type="button" className={`${btnClass} w-full sm:w-auto`} onClick={addSection}>
        + Abschnitt hinzufügen
      </button>
    </div>
  );
}
