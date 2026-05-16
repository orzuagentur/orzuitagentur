import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type ServiceRow = {
  id: string;
  slug: string;
  title_de: string;
  description_de: string | null;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export async function getServices(): Promise<ServiceRow[]> {
  if (!hasServiceRoleConfig()) return [];
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("services")
    .select("id,slug,title_de,description_de,sort_order,published,updated_at")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getServices]", error);
    return [];
  }
  return (data ?? []) as ServiceRow[];
}
