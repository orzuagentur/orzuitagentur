import { TechnologiesForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentTechnologiesPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/technologies">
      {(marketing) => <TechnologiesForm marketing={marketing} />}
    </ContentSubPage>
  );
}
