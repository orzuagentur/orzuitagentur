import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type ArchitectureItem = {
  label: string;
  tables: string[];
  status: "ready" | "planned";
  note: string;
};

export type ScalingItem = {
  id: string;
  label: string;
  table: string;
  count: number | null;
  status: "foundation" | "active";
};

export const ARCHITECTURE_ITEMS: ArchitectureItem[] = [
  {
    label: "pages, sections, blocks",
    tables: ["pages", "page_sections", "page_blocks"],
    status: "ready",
    note: "Dynamische Seiten und Page Builder sind strukturiert.",
  },
  {
    label: "settings, seo, media",
    tables: ["site_settings", "site_seo", "media_assets"],
    status: "ready",
    note: "Settings, SEO-Control und Medien-Register sind vorbereitet.",
  },
  {
    label: "users, roles, permissions",
    tables: ["profiles", "admin_roles", "permission_rules"],
    status: "ready",
    note: "Admin-Rollen und granulare Rechte haben eigene Tabellen.",
  },
  {
    label: "api_keys, animations, themes, navigation",
    tables: ["api_keys", "animation_presets", "theme_presets", "navigation_items"],
    status: "ready",
    note: "Secrets, Theme, Animationen und Navigation sind modular.",
  },
];

const SCALING_TABLES = [
  ["SCL-1401", "Multi-Site / Mandanten", "sites"],
  ["SCL-1402", "Client-Dashboards", "client_dashboards"],
  ["SCL-1403", "CRM-Anbindung", "crm_connections"],
  ["SCL-1404", "Billing / Stripe Portal", "billing_accounts"],
  ["SCL-1405", "Automation Pipelines", "automation_pipelines"],
  ["SCL-1406", "SaaS-Transformation", "sites"],
] as const;

export async function getScalingItems(): Promise<ScalingItem[]> {
  if (!hasServiceRoleConfig()) {
    return SCALING_TABLES.map(([id, label, table]) => ({
      id,
      label,
      table,
      count: null,
      status: "foundation",
    }));
  }

  const supabase = createServiceRoleClient();
  return Promise.all(
    SCALING_TABLES.map(async ([id, label, table]) => {
      const { count, error } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      if (error) console.error("[getScalingItems]", table, error);
      return {
        id,
        label,
        table,
        count: count ?? null,
        status: (count ?? 0) > 0 ? "active" : "foundation",
      };
    }),
  );
}
