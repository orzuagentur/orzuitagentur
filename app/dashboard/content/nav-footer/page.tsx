import { NavFooterForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentNavFooterPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/nav-footer">
      {(marketing) => <NavFooterForm marketing={marketing} />}
    </ContentSubPage>
  );
}
