import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getLegalContent } from "@/lib/legal/cms";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const legal = await getLegalContent();
  return buildPageMetadata({
    path: "/datenschutz",
    title: legal.datenschutz.title,
    description: legal.datenschutz.metaDescription,
    robots: { index: true, follow: true },
  });
}

export default async function DatenschutzPage() {
  const legal = await getLegalContent();
  const page = legal.datenschutz;

  return (
    <LegalPage
      title={page.title}
      intro={page.intro}
      sections={page.sections}
      updatedLabel={
        page.showUpdatedLabel
          ? `Stand: ${new Date().toLocaleDateString("de-DE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`
          : undefined
      }
    />
  );
}
