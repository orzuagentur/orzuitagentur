import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

export async function writeAuditLog({
  actorEmail,
  action,
  targetType,
  targetId,
  metadata = {},
}: {
  actorEmail?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!hasServiceRoleConfig()) return;
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor_email: actorEmail ?? null,
    action,
    target_type: targetType,
    target_id: targetId ?? null,
    metadata,
  });
  if (error) console.error("[writeAuditLog]", error);
}

export type AuditLogRow = {
  id: string;
  actor_email: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export async function getAuditLogs(limit = 50): Promise<AuditLogRow[]> {
  if (!hasServiceRoleConfig()) return [];
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,actor_email,action,target_type,target_id,metadata,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getAuditLogs]", error);
    return [];
  }
  return (data ?? []) as AuditLogRow[];
}
