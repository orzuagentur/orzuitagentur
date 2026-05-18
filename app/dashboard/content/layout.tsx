import { ContentSectionNav } from "@/components/dashboard/content-section-nav";

export default function DashboardContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ContentSectionNav />
      {children}
    </>
  );
}
