import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioDetailPage } from "@/components/portfolio/portfolio-detail-page";
import {
  getPortfolioBySlug,
  getPublishedPortfolioSlugs,
} from "@/lib/cms/load-portfolio-detail";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) {
    return { title: "Projekt nicht gefunden" };
  }

  return buildPageMetadata({
    path: `/portfolio/${slug}`,
    title: `${project.title} — Case Study`,
    description: project.summary,
    robots: { index: true, follow: true },
  });
}

export default async function PortfolioProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) notFound();

  return <PortfolioDetailPage project={project} />;
}
