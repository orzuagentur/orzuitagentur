-- OrzuIT — Starter-Inhalte (Leistungen, Portfolio, Warum OrzuIT, SEO)

-- Im Supabase SQL Editor ausführen, wenn Tabellen leer sind.



insert into public.services (slug, title_de, description_de, sort_order, published)

values

  (

    's1',

    'Individuelle Software',

    'Web-Apps und interne Tools für wachsende Unternehmen — z. B. Kundenportale, Verwaltung oder Prozessunterstützung. Ergebnis: weniger manuelle Arbeit, klarere Abläufe.',

    1,

    true

  ),

  (

    's2',

    'KI & Automatisierung',

    'Assistenten, Dokumentenverarbeitung und Schnittstellen, die repetitive Aufgaben übernehmen. Für Teams mit viel Routine in Support, Backoffice oder Datenpflege.',

    2,

    true

  ),

  (

    's3',

    'Websites & Webshops',

    'Moderne, schnelle Websites und Shops, die Sie selbst pflegen können. Fokus: verständliche Struktur, gute Performance und saubere Anbindung an CRM oder Buchhaltung.',

    3,

    true

  ),

  (

    's4',

    'Betrieb & Sicherheit',

    'Hosting, Updates, Backups und Monitoring — damit Ihre Lösung im Alltag stabil läuft. Inklusive klarer Zuständigkeiten und dokumentierter Übergabe.',

    4,

    true

  )

on conflict (slug) do nothing;



insert into public.portfolio_entries (slug, title_de, summary_de, category_de, sort_order, published)

values

  (

    'finsight',

    'Reporting-Dashboard',

    'Zentrale Kennzahlen aus Excel, ERP und CRM — mit Rollen, Export und automatischen Hinweisen bei Abweichungen.',

    'Beispiel · Finanzen',

    1,

    true

  ),

  (

    'velo',

    'Prozess-Automatisierung',

    'Wiederkehrende Aufgaben per Workflow und KI entlasten — inklusive Protokollierung und Freigaben im Team.',

    'Beispiel · Operations',

    2,

    true

  ),

  (

    'aura',

    'Unternehmens-Website',

    'Übersichtliche Marketing-Site mit Kontaktformular, CMS und messbarer Ladezeit — bereit für SEO und Erweiterungen.',

    'Beispiel · Web',

    3,

    true

  ),

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



insert into public.testimonials (quote_de, author_de, role_de, org_de, sort_order, published)

select * from (values

  (

    'Wir erklären Optionen, Aufwand und Risiken in normaler Sprache — damit Sie fundiert entscheiden können, ohne ein eigenes IT-Team zu brauchen.',

    'Verständlich statt Fachchinesisch',

    '',

    '',

    1,

    true

  ),

  (

    'Vom Kick-off über Umsetzung bis Übergabe: klare Meilensteine, feste Ansprechpartner und nachvollziehbare Prioritäten statt endloser Abstimmungsrunden.',

    'Ein Ansprechpartner, ein Plan',

    '',

    '',

    2,

    true

  ),

  (

    'Sauberer Code, Dokumentation und Betrieb — damit Ihre Software nicht nur beim Launch gut wirkt, sondern Monate später noch wartbar bleibt.',

    'Lösungen, die im Alltag funktionieren',

    '',

    '',

    3,

    true

  )

) as v(quote_de, author_de, role_de, org_de, sort_order, published)

where not exists (select 1 from public.testimonials limit 1);



insert into public.site_seo (path, title_de, description_de, og_image_url)

values (

  '/',

  'OrzuIT — Software, KI & Web für wachsende Unternehmen',

  'Individuelle Software, KI-Automatisierung und moderne Weblösungen: OrzuIT plant, entwickelt und betreibt digitale Produkte mit klarem Nutzen für Ihr Team.',

  null

)

on conflict (path) do nothing;


