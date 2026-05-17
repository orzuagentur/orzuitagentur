import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardThemeScript } from "@/components/dashboard/dashboard-theme-script";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardAuthError,
  requireDashboardUser,
} from "@/lib/auth/dashboard-user";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireDashboardUser();
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    throw e;
  }

  return (
    <>
      <DashboardThemeScript />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
