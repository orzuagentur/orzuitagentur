import { Suspense, type ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardToastProvider } from "@/components/dashboard/dashboard-toast-provider";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <DashboardToastProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar />
        <div className="flex min-h-screen flex-1 flex-col bg-[var(--background)]">
          <Suspense fallback={null}>
            <DashboardTopBar />
          </Suspense>
          <div className="dashboard-main flex-1">{children}</div>
        </div>
      </div>
    </DashboardToastProvider>
  );
}
