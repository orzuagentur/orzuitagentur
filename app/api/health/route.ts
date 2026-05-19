import { NextResponse } from "next/server";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "orzuit",
      timestamp: new Date().toISOString(),
      checks: {
        siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
        supabase: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        ),
        serviceRole: hasServiceRoleConfig(),
        adminEmails: Boolean(process.env.ADMIN_EMAILS),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
