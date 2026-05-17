import { DASHBOARD_THEME_STORAGE_KEY } from "@/lib/theme/dashboard-theme";

const inlineScript = `
(function () {
  try {
    var t = localStorage.getItem(${JSON.stringify(DASHBOARD_THEME_STORAGE_KEY)});
    document.documentElement.setAttribute(
      "data-dashboard-theme",
      t === "light" ? "light" : "dark"
    );
  } catch (e) {
    document.documentElement.setAttribute("data-dashboard-theme", "dark");
  }
})();
`.trim();

export function DashboardThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: inlineScript }}
      suppressHydrationWarning
    />
  );
}
