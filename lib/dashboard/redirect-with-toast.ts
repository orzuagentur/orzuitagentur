import { redirect } from "next/navigation";
import type { ToastVariant } from "@/lib/dashboard/toast-messages";

export function redirectWithToast(
  path: string,
  toastKey: string,
  variant: ToastVariant = "success",
): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(
    `${path}${sep}toast=${encodeURIComponent(toastKey)}&toastType=${variant}`,
  );
}
