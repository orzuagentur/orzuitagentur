import { redirect } from "next/navigation";

export default function ContentNavFooterRedirect() {
  redirect("/dashboard/content/menu");
}
