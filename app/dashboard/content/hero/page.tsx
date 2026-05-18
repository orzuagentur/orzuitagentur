import { HeroForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentHeroPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/hero">
      {(marketing) => <HeroForm marketing={marketing} />}
    </ContentSubPage>
  );
}
