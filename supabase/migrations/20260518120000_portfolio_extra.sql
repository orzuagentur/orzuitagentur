insert into public.portfolio_entries (slug, title_de, summary_de, category_de, sort_order, published)
values
  (
    'nexus',
    'Nexus Health',
    'Patientenpfade, Terminlogik und KI-Triage in einer DSGVO-konformen Plattform für Kliniknetzwerke.',
    'Gesundheit • KI',
    4,
    true
  ),
  (
    'vault',
    'Vault Ledger',
    'Revisionssichere Audit Trails, Rollenmodelle und Echtzeit-Alerts für regulierte Finanzprozesse.',
    'Compliance • Security',
    5,
    true
  ),
  (
    'pulse',
    'Pulse Retail',
    'Conversion-Dashboards, Lager-Signale und Kampagnen-Automation in einer Headless-Storefront.',
    'E-Commerce • Analytics',
    6,
    true
  )
on conflict (slug) do nothing;
