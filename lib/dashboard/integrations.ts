export function getIntegrationFlags() {
  return {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseService: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
    resendTo: Boolean(process.env.LEAD_NOTIFY_EMAIL),
    telegram: Boolean(
      process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
    ),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    adminEmails: Boolean(process.env.ADMIN_EMAILS),
    vercelApi: Boolean(
      process.env.VERCEL_ACCESS_TOKEN && process.env.VERCEL_PROJECT_ID,
    ),
    vercelHook: Boolean(process.env.VERCEL_DEPLOY_HOOK_URL),
  };
}
