"use server";

import { isAdminEmail } from "@/lib/auth/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export type AuthState = { ok: boolean; message?: string };

function safeDashboardPath(next: FormDataEntryValue | null): string {
  if (typeof next !== "string" || !next.startsWith("/dashboard")) {
    return "/dashboard";
  }
  return next;
}

export async function signInWithPassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Введите корректный email и пароль (мин. 8 символов)." };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message =
        error.message === "Invalid login credentials"
          ? "Неверный email или пароль."
          : error.message;
      return { ok: false, message };
    }

    const userEmail = data.user?.email;
    if (!userEmail) {
      await supabase.auth.signOut();
      return { ok: false, message: "Не удалось получить данные пользователя." };
    }

    if (!isAdminEmail(userEmail)) {
      await supabase.auth.signOut();
      return {
        ok: false,
        message: "У этого аккаунта нет доступа к админ-панели.",
      };
    }

    redirect(safeDashboardPath(formData.get("next")));
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err) {
      const digest = String((err as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw err;
    }
    return {
      ok: false,
      message: "Вход недоступен. Проверьте настройки Supabase в .env.local.",
    };
  }
}
