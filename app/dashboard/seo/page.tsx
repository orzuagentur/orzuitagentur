import { redirect } from "next/navigation";

export default function DashboardSeoRedirect() {
  redirect("/dashboard/settings/seo");
}
