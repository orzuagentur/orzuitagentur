import { SettingsSectionNav } from "@/components/dashboard/settings-section-nav";

export default function DashboardSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SettingsSectionNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
