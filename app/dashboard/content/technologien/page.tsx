import { TechnologiesForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentTechnologienPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/technologien">
      {(marketing) => <TechnologiesForm marketing={marketing} />}
    </ContentSubPage>
  );
}
