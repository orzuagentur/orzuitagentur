import { getRobotsSettings } from "@/lib/dashboard/robots";
import { getSiteUrl } from "@/lib/site/url";

export async function GET() {
  const origin = getSiteUrl().origin;
  const settings = await getRobotsSettings();

  return new Response(settings.body.replace("/sitemap.xml", `${origin}/sitemap.xml`), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
