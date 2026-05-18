import { LeistungenIntroForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentLeistungenPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/leistungen">
      {(marketing) => <LeistungenIntroForm marketing={marketing} />}
    </ContentSubPage>
  );
}
