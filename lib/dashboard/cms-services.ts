import {

  createServiceRoleClient,

  hasServiceRoleConfig,

} from "@/lib/supabase/service";



export type ServiceRow = {

  id: string;

  slug: string;

  title_de: string;

  description_de: string | null;

  body_de: string | null;

  category_de: string | null;

  project_url: string | null;

  image_url: string | null;

  image_alt: string | null;

  icon_name: string | null;

  tags: string[];

  cta_label: string | null;

  animation_preset: string | null;

  enable_3d: boolean;

  video_url: string | null;

  sort_order: number;

  published: boolean;

  updated_at: string;

};



export async function getServices(): Promise<ServiceRow[]> {

  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();

  const withUrl = await supabase

    .from("services")

    .select(

      "id,slug,title_de,description_de,body_de,category_de,project_url,image_url,image_alt,icon_name,tags,cta_label,animation_preset,enable_3d,video_url,sort_order,published,updated_at",

    )

    .order("sort_order", { ascending: true });



  if (!withUrl.error) return (withUrl.data ?? []) as ServiceRow[];



  const fallback = await supabase

    .from("services")

    .select(

      "id,slug,title_de,description_de,body_de,category_de,sort_order,published,updated_at",

    )

    .order("sort_order", { ascending: true });



  if (fallback.error) {

    console.error("[getServices]", fallback.error);

    return [];

  }



  return (fallback.data ?? []).map((row) => ({

    ...(row as Omit<ServiceRow, "project_url" | "image_url" | "image_alt" | "icon_name" | "tags" | "cta_label" | "animation_preset" | "enable_3d" | "video_url">),

    project_url: null,

    image_url: null,

    image_alt: null,

    icon_name: null,

    tags: [],

    cta_label: null,

    animation_preset: null,

    enable_3d: true,

    video_url: null,

  }));

}

