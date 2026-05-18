import Link from "next/link";
import type { PortfolioDetail } from "@/lib/cms/types";

type PortfolioDetailPageProps = {
  project: PortfolioDetail;
};

function bodyParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function PortfolioDetailPage({ project }: PortfolioDetailPageProps) {
  const paragraphs = bodyParagraphs(project.body);

  return (
    <div className="relative isolate flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent)]"
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Link
          href="/#portfolio"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          ← Zurück zum Portfolio
        </Link>

        <header className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#08080f]">
          <div
            className={`portfolio-stack-visual relative h-48 sm:h-56 ${project.visualClass}`}
          >
            <span className="portfolio-visual-grid" aria-hidden />
            <span className="portfolio-stack-wave" aria-hidden />
            <span className="portfolio-stack-visual-shade" aria-hidden />
            <span className="portfolio-stack-badge">{project.category}</span>
            <span className="portfolio-stack-case-label">Case Study</span>
          </div>
          <div className="border-t border-[var(--border)] px-5 py-6 sm:px-7 sm:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
              {project.summary}
            </p>
          </div>
        </header>

        <article className="mt-10 space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${project.slug}-p-${index}`}
              className="text-base leading-relaxed text-[var(--muted)]"
            >
              {paragraph}
            </p>
          ))}
        </article>

        <footer className="mt-14 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-8">
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--surface-elevated)_90%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Projekt anfragen
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Startseite
          </Link>
        </footer>
      </div>
    </div>
  );
}
