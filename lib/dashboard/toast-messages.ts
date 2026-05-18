export type ToastVariant = "success" | "error";

export const TOAST_MESSAGES: Record<string, { message: string; variant: ToastVariant }> = {
  updated: { message: "Успешно изменено", variant: "success" },
  created: { message: "Успешно добавлено", variant: "success" },
  deleted: { message: "Успешно удалено", variant: "success" },
  saved: { message: "Успешно сохранено", variant: "success" },

  hero_saved: { message: "Hero — успешно сохранено", variant: "success" },
  nav_saved: { message: "Навигация и Footer — успешно сохранено", variant: "success" },
  contact_saved: { message: "Контакт — успешно сохранено", variant: "success" },
  sections_saved: { message: "Секции — успешно сохранено", variant: "success" },
  tech_saved: { message: "Технологии — успешно сохранено", variant: "success" },
  seo_saved: { message: "SEO — успешно сохранено", variant: "success" },
  legal_operator_saved: {
    message: "Anbieterdaten — успешно сохранено",
    variant: "success",
  },
  legal_impressum_saved: {
    message: "Impressum — успешно сохранено",
    variant: "success",
  },
  legal_datenschutz_saved: {
    message: "Datenschutz — успешно сохранено",
    variant: "success",
  },
  legal_reset: {
    message: "Rechtstexte auf Standard zurückgesetzt",
    variant: "success",
  },

  content_seeded: {
    message: "Стандартный контент загружен",
    variant: "success",
  },
  content_already: {
    message: "Контент уже существует",
    variant: "success",
  },
  seed_service_role: {
    message: "Нет SUPABASE_SERVICE_ROLE_KEY",
    variant: "error",
  },
  seed_db: { message: "Ошибка загрузки контента", variant: "error" },

  redeployed: { message: "Redeploy запущен", variant: "success" },
  env_saved: {
    message: "Переменная сохранена. Выполните Redeploy.",
    variant: "success",
  },
  env_deleted: { message: "Переменная удалена", variant: "success" },
  domain_added: { message: "Домен добавлен", variant: "success" },
  domain_removed: { message: "Домен удалён", variant: "success" },
  domain_verified: { message: "DNS проверен", variant: "success" },
  domain_verify_failed: {
    message: "DNS ещё не настроен или проверка не удалась",
    variant: "error",
  },

  not_configured: { message: "Vercel API не настроен", variant: "error" },
  env_validation: { message: "Неверные данные переменной", variant: "error" },
  domain_validation: { message: "Неверный домен", variant: "error" },
  deploy: { message: "Redeploy не удался", variant: "error" },
  env_api: { message: "Ошибка Vercel Env API", variant: "error" },
  env_delete_code: { message: "Неверный или просроченный код", variant: "error" },
  env_delete_expired: {
    message: "Подтверждение истекло. Начните удаление снова.",
    variant: "error",
  },
  domain_api: { message: "Не удалось добавить домен", variant: "error" },
};

/** Maps legacy query flags (?env_saved=1, ?seeded=1, …) to toast keys. */
export function legacyToastKeyFromParams(
  params: URLSearchParams,
): { key: string; variant: ToastVariant } | null {
  if (params.get("toast")) {
    const key = params.get("toast")!;
    const variant =
      params.get("toastType") === "error" ? "error" : "success";
    return { key, variant };
  }

  if (params.get("redeployed")) return { key: "redeployed", variant: "success" };
  if (params.get("env_saved")) return { key: "env_saved", variant: "success" };
  if (params.get("env_deleted")) return { key: "env_deleted", variant: "success" };
  if (params.get("domain_added")) return { key: "domain_added", variant: "success" };

  const err = params.get("error");
  if (err && TOAST_MESSAGES[err]) {
    return { key: err, variant: "error" };
  }

  if (params.get("seeded")) return { key: "content_seeded", variant: "success" };
  if (params.get("seed_info") === "already") {
    return { key: "content_already", variant: "success" };
  }
  if (params.get("seed_error") === "service_role") {
    return { key: "seed_service_role", variant: "error" };
  }
  if (params.get("seed_error") === "db") {
    return { key: "seed_db", variant: "error" };
  }

  return null;
}
