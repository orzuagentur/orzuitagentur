import { redirect } from "next/navigation";

export default function DashboardDomainsRedirect() {
  redirect("/dashboard/settings/domains");
}
