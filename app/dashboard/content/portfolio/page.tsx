import { PortfolioIntroForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentPortfolioPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/portfolio">
      {(marketing) => <PortfolioIntroForm marketing={marketing} />}
    </ContentSubPage>
  );
}
