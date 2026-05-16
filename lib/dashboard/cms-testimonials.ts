import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type TestimonialRow = {
  id: string;
  quote_de: string;
  author_de: string;
  role_de: string | null;
  org_de: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export async function getTestimonials(): Promise<TestimonialRow[]> {
  if (!hasServiceRoleConfig()) return [];
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "id,quote_de,author_de,role_de,org_de,sort_order,published,created_at",
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getTestimonials]", error);
    return [];
  }
  return (data ?? []) as TestimonialRow[];
}
