import { NavFooterForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentMenuPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/menu">
      {(marketing) => <NavFooterForm marketing={marketing} />}
    </ContentSubPage>
  );
}
