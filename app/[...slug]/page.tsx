import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPageBuilder } from "@/components/page-builder/public-page-builder";
import { getPublicDynamicPage } from "@/lib/cms/load-page";
import { getPublicPageBuilder } from "@/lib/cms/load-page-builder";
import { buildPageMetadata } from "@/lib/seo/metadata";

type DynamicPageProps = {
  params: Promise<{ slug: string[] }>;
};

function pathFromSlug(slug: string[]) {
  return `/${slug.join("/")}`;
}

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const page = await getPublicDynamicPage(path);
  if (!page) return {};

  return buildPageMetadata({
    path,
    title: page.seo_title || page.title_de,
    description:
      page.seo_description || page.meta_description_de || page.excerpt_de || page.title_de,
    ogImageUrl: page.og_image_url,
    canonicalUrl: page.canonical_url,
    schemaJson: page.schema_json,
    robots: { index: page.robots_index, follow: page.robots_index },
  });
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const page = await getPublicDynamicPage(pathFromSlug(slug));
  if (!page) notFound();
  const builderSections = await getPublicPageBuilder(page.id);

  const paragraphs = (page.body_de || page.excerpt_de || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-40">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        {page.template} · {page.locale.toUpperCase()}
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
        {page.title_de}
      </h1>
      {page.excerpt_de ? (
        <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
          {page.excerpt_de}
        </p>
      ) : null}
      <div className="mt-10 space-y-5 text-base leading-8 text-[var(--foreground)]/88">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <p>Diese Seite ist angelegt und wartet auf Inhalt.</p>
        )}
      </div>
      <PublicPageBuilder sections={builderSections} />
    </main>
  );
}
