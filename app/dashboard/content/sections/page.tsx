import { SectionIntrosForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentSectionsPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/sections">
      {(marketing) => <SectionIntrosForm marketing={marketing} />}
    </ContentSubPage>
  );
}
