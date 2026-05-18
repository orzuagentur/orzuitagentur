import { redirect } from "next/navigation";

export default function DashboardDeployRedirect() {
  redirect("/dashboard/settings/deploy");
}
