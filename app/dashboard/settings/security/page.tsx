import { saveAdminRole, saveSecuritySetting } from "@/actions/cms/security";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  ADMIN_PERMISSIONS,
  ADMIN_ROLES,
  getAdminRoleRows,
  getSecuritySettings,
} from "@/lib/dashboard/security";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

function valueOf(settings: Awaited<ReturnType<typeof getSecuritySettings>>, key: string) {
  return settings.find((item) => item.key === key)?.value ?? {};
}

function textValue(value: Record<string, unknown>, key: string) {
  const raw = value[key];
  if (Array.isArray(raw)) return raw.join(", ");
  return typeof raw === "string" || typeof raw === "number" ? String(raw) : "";
}

function boolValue(value: Record<string, unknown>, key: string) {
  return value[key] === true;
}

export default async function DashboardSecurityPage() {
  const [roles, settings] = await Promise.all([
    getAdminRoleRows(),
    getSecuritySettings(),
  ]);

  return (
    <>
      <DashboardPageHeader
        title="Sicherheit & Rollen"
        description="Rollen, Rechte, 2FA, Admin-Alias, Sessions, IP/Geo und Rate-Limit als kontrollierbare Baseline."
      />
      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_72%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Admin-Rolle hinzufügen / aktualisieren
          </h2>
          <RoleForm />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.id}
              className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5"
            >
              <p className="font-semibold text-[var(--foreground)]">{role.email}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {role.role} · {role.active ? "aktiv" : "deaktiviert"} · 2FA{" "}
                {role.two_factor_required ? "pflicht" : "optional"}
              </p>
              <RoleForm role={role} />
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <SecuritySettingCard
            title="Custom Admin-Route / Alias"
            settingKey="admin_route"
            value={valueOf(settings, "admin_route")}
            fields={["alias"]}
            checks={["enabled"]}
          />
          <SecuritySettingCard
            title="2FA"
            settingKey="two_factor"
            value={valueOf(settings, "two_factor")}
            fields={["issuer"]}
            checks={["required"]}
          />
          <SecuritySettingCard
            title="Session & Geräte"
            settingKey="session_policy"
            value={valueOf(settings, "session_policy")}
            fields={["maxAgeHours"]}
            checks={["showDeviceList"]}
          />
          <SecuritySettingCard
            title="IP / Geo Restriction"
            settingKey="ip_geo"
            value={valueOf(settings, "ip_geo")}
            fields={["allowlist", "blockedCountries"]}
            checks={["enabled"]}
          />
          <SecuritySettingCard
            title="Rate Limit & Bot-Schutz"
            settingKey="rate_limit"
            value={valueOf(settings, "rate_limit")}
            fields={["requestsPerMinute"]}
            checks={["enabled", "botProtection"]}
          />
        </section>
      </div>
    </>
  );
}

function RoleForm({
  role,
}: {
  role?: Awaited<ReturnType<typeof getAdminRoleRows>>[number];
}) {
  return (
    <form action={saveAdminRole} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputClass}
          name="email"
          type="email"
          defaultValue={role?.email ?? ""}
          placeholder="admin@orzuit.de"
        />
        <select className={inputClass} name="role" defaultValue={role?.role ?? "viewer"}>
          {ADMIN_ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Permissions</label>
        <input
          className={inputClass}
          name="permissions"
          defaultValue={role?.permissions.join(", ") ?? ADMIN_PERMISSIONS.join(", ")}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            name="two_factor_required"
            defaultChecked={role?.two_factor_required ?? false}
          />
          2FA erforderlich
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input type="checkbox" name="active" defaultChecked={role?.active ?? true} />
          Aktiv
        </label>
      </div>
      <DashboardSubmitButton size="sm" pendingLabel="Gespeichert">
        Rolle speichern
      </DashboardSubmitButton>
    </form>
  );
}

function SecuritySettingCard({
  title,
  settingKey,
  value,
  fields,
  checks,
}: {
  title: string;
  settingKey: string;
  value: Record<string, unknown>;
  fields: string[];
  checks: string[];
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
      <form action={saveSecuritySetting} className="mt-4 space-y-3">
        <input type="hidden" name="key" value={settingKey} />
        {fields.map((field) => (
          <div key={field}>
            <label className={labelClass}>{field}</label>
            <input className={inputClass} name={field} defaultValue={textValue(value, field)} />
          </div>
        ))}
        <div className="flex flex-wrap gap-4">
          {checks.map((check) => (
            <label key={check} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name={check} defaultChecked={boolValue(value, check)} />
              {check}
            </label>
          ))}
        </div>
        <DashboardSubmitButton size="sm" pendingLabel="Gespeichert">
          Einstellung speichern
        </DashboardSubmitButton>
      </form>
    </article>
  );
}
