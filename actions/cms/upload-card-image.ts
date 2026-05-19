"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

const BUCKET = "cms-media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function str(fd: FormData, key: string, max: number) {
  const v = fd.get(key);
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

function extForMime(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

export async function uploadCardImage(formData: FormData): Promise<void> {
  const returnPath = str(formData, "return_path", 200) || "/dashboard/services";

  try {
    await requireDashboardUser();
    if (!hasServiceRoleConfig()) throw new Error("SERVICE_ROLE");

    const table = str(formData, "table", 40);
    const id = str(formData, "id", 64);
    const slug = str(formData, "slug", 120);
    if (
      !id ||
      !slug ||
      (table !== "services" && table !== "portfolio_entries")
    ) {
      console.warn("[cms:uploadCardImage] Ungültige Parameter.");
      return;
    }

    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      console.warn("[cms:uploadCardImage] Keine Datei.");
      return;
    }
    if (file.size > MAX_BYTES) {
      console.warn("[cms:uploadCardImage] Datei zu groß.");
      return;
    }
    if (!ALLOWED.has(file.type)) {
      console.warn("[cms:uploadCardImage] Ungültiger MIME-Typ.");
      return;
    }

    const folder = table === "services" ? "services" : "portfolio";
    const path = `${folder}/${slug}-${id}.${extForMime(file.type)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = createServiceRoleClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("[cms:uploadCardImage]", uploadError);
      return;
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const imageUrl = publicData.publicUrl;

    const { error: updateError } = await supabase
      .from(table)
      .update({
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("[cms:uploadCardImage:update]", updateError);
      return;
    }

    revalidatePath("/");
    revalidatePath(returnPath);
    if (table === "portfolio_entries") {
      revalidatePath(`/portfolio/${slug}`);
    }
    redirectWithToast(returnPath, "updated");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[cms:uploadCardImage]", e);
  }
}
