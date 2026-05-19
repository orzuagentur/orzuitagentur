import { isAdminEmail, isDashboardAdmin } from "@/lib/auth/roles";
import { hasSupabasePublicConfig } from "@/lib/env/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  if (!hasSupabasePublicConfig()) {
    if (pathname.startsWith("/dashboard")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set("error", "no_supabase");
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/auth")) {
    const { data: redirectRule } = await supabase
      .from("redirect_rules")
      .select("target_url,status_code")
      .eq("source_path", pathname.replace(/\/$/, "") || "/")
      .eq("enabled", true)
      .maybeSingle();

    if (redirectRule?.target_url) {
      const redirectUrl = new URL(redirectRule.target_url, request.url);
      return NextResponse.redirect(
        redirectUrl,
        redirectRule.status_code === 302 ? 302 : 301,
      );
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/auth/login";

  if (isDashboard) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (!(await isDashboardAdmin(user.email))) {
      const denied = request.nextUrl.clone();
      denied.pathname = "/auth/login";
      denied.searchParams.set("error", "forbidden");
      return NextResponse.redirect(denied);
    }
  }

  if (isLogin && user && isAdminEmail(user.email)) {
    const dashboard = request.nextUrl.clone();
    dashboard.pathname = "/dashboard";
    dashboard.search = "";
    return NextResponse.redirect(dashboard);
  }

  return response;
}
