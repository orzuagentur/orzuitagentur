export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { warnMissingProductionEnv } = await import("@/lib/env/server");
    warnMissingProductionEnv();
  }
}
