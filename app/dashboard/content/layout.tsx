import { ContentSectionNav } from "@/components/dashboard/content-section-nav";

export default function DashboardContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ContentSectionNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
