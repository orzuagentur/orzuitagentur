import { WarumIntroForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentWarumPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/warum">
      {(marketing) => <WarumIntroForm marketing={marketing} />}
    </ContentSubPage>
  );
}
