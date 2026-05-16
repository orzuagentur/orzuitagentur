-- OrzuIT — Starter-Inhalte (Leistungen, Portfolio, Referenzen, Marketing, SEO)
-- Im Supabase SQL Editor ausführen, wenn Tabellen leer sind.

insert into public.services (slug, title_de, description_de, sort_order, published)
values
  (
    's1',
    'Produkt & Plattform',
    'Skalierbare Webanwendungen, APIs und Cloud-Architekturen — von der ersten Architektur bis zum Go-live.',
    1,
    true
  ),
  (
    's2',
    'KI & Automatisierung',
    'Intelligente Workflows, Daten-Pipelines und Assistenten, die sich nahtlos in Ihre Systeme einfügen.',
    2,
    true
  ),
  (
    's3',
    'Design & Experience',
    'Premium Interfaces, Design Systems und Motion — konsistent, barrierebewusst, markenstark.',
    3,
    true
  ),
  (
    's4',
    'Betrieb & Sicherheit',
    'CI/CD, Observability und harte Sicherheitsstandards, damit Ihr Produkt zuverlässig bleibt.',
    4,
    true
  )
on conflict (slug) do nothing;

insert into public.portfolio_entries (slug, title_de, summary_de, category_de, sort_order, published)
values
  (
    'finsight',
    'FinSight Nexus',
    'Rollensichere Steuerzentrale mit Live-Marktdaten, Compliance-Trails und KI-gestützten Anomalie-Hinweisen.',
    'Finanz · Echtzeit',
    1,
    true
  ),
  (
    'velo',
    'VeloCarbon Ops',
    'Digital Twin für Emissionsketten — Sensordaten harmonisieren, KPIs vergleichen, Audit Trails exportieren.',
    'Nachhaltigkeit · IoT',
    2,
    true
  ),
  (
    'aura',
    'Aura Commerce',
    'Headless Storefront mit millisekundenschnellen Seiten, Edge-Personalisierung und Storytelling.',
    'E-Commerce · Experience',
    3,
    true
  )
on conflict (slug) do nothing;

insert into public.testimonials (quote_de, author_de, role_de, org_de, sort_order, published)
select * from (values
  (
    'Die Liefergeschwindigkeit war ungewöhnlich — aber nie auf Kosten von Stabilität. Wir haben endlich einen Stack, der mit unserer Regulatorik mithält.',
    'Elena Vogt',
    'CTO',
    'Nordlicht Capital',
    1,
    true
  ),
  (
    'Vom ersten Wireframe bis zum Livegang: ein durchgängiges Niveau, das sich wie eine Marke anfühlt — nicht wie ein Flickenteppich aus Agenturen.',
    'Jonas Malik',
    'Head of Product',
    'VeloCarbon GmbH',
    2,
    true
  ),
  (
    'Integrationen, Monitoring, Incident-Playbooks — alles dokumentiert und wartbar. Genau das, was Operations braucht, wenn Umsatz auf dem Spiel steht.',
    'Priya N.',
    'Director Operations',
    'Aura Commerce',
    3,
    true
  )
) as v(quote_de, author_de, role_de, org_de, sort_order, published)
where not exists (select 1 from public.testimonials limit 1);

insert into public.site_seo (path, title_de, description_de, og_image_url)
values (
  '/',
  'OrzuIT — Premium IT & KI-Lösungen',
  'Luxuriöse digitale Erlebnisse, zukunftsweisende Software und KI — OrzuIT entwickelt Ihre Vision mit Präzision und Klarheit.',
  null
)
on conflict (path) do nothing;
