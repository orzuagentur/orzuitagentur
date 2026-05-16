import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-[var(--background)]">
        <div className="dashboard-main flex-1">{children}</div>
      </div>
    </div>
  );
}
