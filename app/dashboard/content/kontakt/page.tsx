import { ContactForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentKontaktPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/kontakt">
      {(marketing) => <ContactForm marketing={marketing} />}
    </ContentSubPage>
  );
}
