export function getVercelSettings() {
  return {
    token: process.env.VERCEL_ACCESS_TOKEN?.trim(),
    projectId: process.env.VERCEL_PROJECT_ID?.trim(),
    teamId: process.env.VERCEL_TEAM_ID?.trim() || undefined,
    deployHook: process.env.VERCEL_DEPLOY_HOOK_URL?.trim(),
  };
}

export function isVercelApiReady(): boolean {
  const { token, projectId } = getVercelSettings();
  return Boolean(token && projectId);
}

export function isVercelRedeployReady(): boolean {
  const { deployHook } = getVercelSettings();
  return Boolean(deployHook || isVercelApiReady());
}
