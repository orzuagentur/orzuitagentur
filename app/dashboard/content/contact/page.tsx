import { ContactForm } from "@/components/dashboard/marketing-forms";
import { ContentSubPage } from "../_shared";

export default function ContentContactPage() {
  return (
    <ContentSubPage pathname="/dashboard/content/contact">
      {(marketing) => <ContactForm marketing={marketing} />}
    </ContentSubPage>
  );
}
