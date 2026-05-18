import { revalidatePath } from "next/cache";
import {
  SETTINGS_LEGACY_PATHS,
  SETTINGS_SECTION_PATHS,
} from "@/lib/dashboard/settings-sections";

export function revalidateSettingsDashboard() {
  revalidatePath("/");
  for (const path of SETTINGS_SECTION_PATHS) {
    revalidatePath(path);
  }
  for (const path of SETTINGS_LEGACY_PATHS) {
    revalidatePath(path);
  }
}
