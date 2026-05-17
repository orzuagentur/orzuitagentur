"use client";

import {
  DASHBOARD_THEME_STORAGE_KEY,
  type DashboardTheme,
  readDashboardTheme,
} from "@/lib/theme/dashboard-theme";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type DashboardThemeContextValue = {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  toggleTheme: () => void;
};

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(
  null,
);

function applyThemeToDocument(theme: DashboardTheme) {
  document.documentElement.setAttribute("data-dashboard-theme", theme);
  try {
    localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) {
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  }
  return ctx;
}

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DashboardTheme>(() => {
    if (typeof window === "undefined") return "dark";
    return readDashboardTheme();
  });

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((next: DashboardTheme) => {
    setThemeState(next);
    applyThemeToDocument(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyThemeToDocument(next);
      return next;
    });
  }, []);

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className="dashboard-theme-root flex min-h-screen flex-col transition-[background-color,color] duration-200 lg:flex-row"
        data-theme={theme}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}
