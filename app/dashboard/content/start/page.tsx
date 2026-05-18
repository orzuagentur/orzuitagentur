import { HeroForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentStartPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/start">
      {(marketing) => <HeroForm marketing={marketing} />}
    </ContentSubPage>
  );
}
