"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithPassword, type AuthState } from "@/actions/auth";

const initial: AuthState = { ok: false };

const URL_ERRORS: Record<string, string> = {
  forbidden: "У этого аккаунта нет доступа к админ-панели.",
  no_supabase: "Supabase не настроен. Заполните переменные в .env.local.",
  missing_code: "Ссылка для входа недействительна.",
  no_config: "Supabase не настроен.",
  auth: "Ошибка авторизации. Попробуйте снова.",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(signInWithPassword, initial);

  const urlError = searchParams.get("error");
  const urlMessage = urlError ? URL_ERRORS[urlError] : undefined;
  const next = searchParams.get("next") ?? "/dashboard";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-20">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">
        Вход в админ-панель
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Войдите с email и паролем администратора (Supabase Auth).
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />

        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          placeholder="admin@example.com"
        />

        <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-sm font-semibold text-[var(--foreground)] transition-opacity disabled:opacity-60"
        >
          {pending ? "Вход…" : "Войти"}
        </button>
      </form>

      {(urlMessage || state.message) ? (
        <p
          className={`mt-4 text-sm ${state.ok ? "text-[var(--accent)]" : "text-red-400/90"}`}
          role="status"
        >
          {state.message ?? urlMessage}
        </p>
      ) : null}
    </div>
  );
}
