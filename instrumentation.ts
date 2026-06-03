export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { warnMissingProductionEnv } = await import("@/lib/env/server");
    warnMissingProductionEnv();

    // ── Initialize Orzuit ────────────────────────────────────────
    const { initOrzu } = await import("orzuit");
    const apiKey = process.env.ORZUIT_API_KEY;

    if (apiKey) {
      initOrzu({
        apiKey,
      });
    } else {
      console.warn("⚠️ ORZUIT_API_KEY not configured in environment");
    }
  }
}
