import Link from "next/link";
import type { LegalSection } from "@/lib/legal/types";

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  updatedLabel?: string;
};

function BlockRenderer({ block }: { block: LegalSection["blocks"][number] }) {
  if (block.type === "p") {
    return <p className="text-sm leading-relaxed text-[var(--muted)]">{block.text}</p>;
  }
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <address className="not-italic text-sm leading-relaxed text-[var(--muted)]">
      {block.lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </address>
  );
}

export function LegalPage({ title, intro, sections, updatedLabel }: LegalPageProps) {
  return (
    <div className="relative isolate flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent)]"
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          ← Zur Startseite
        </Link>

        <header className="mt-8 border-b border-[var(--border)] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Rechtliches
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{intro}</p>
          {updatedLabel ? (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
              {updatedLabel}
            </p>
          ) : null}
        </header>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, i) => (
                  <BlockRenderer key={`${section.id}-${i}`} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-14 flex flex-wrap gap-4 border-t border-[var(--border)] pt-8 text-sm">
          <Link
            href="/impressum"
            className="text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            Datenschutz
          </Link>
          <Link
            href="/#kontakt"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Kontakt
          </Link>
        </footer>
      </div>
    </div>
  );
}
