# OrzuIT — TASKS

> **Ziel:** Enterprise Website Control Center — volle Kontrolle ohne Code.  
> **Regel:** Erledigte Aufgaben mit `[x]` markieren. Nächste offene Aufgabe zuerst angehen.

---

## Legende

| Präfix | Bereich |
|--------|---------|
| `ADM` | Admin-Architektur & UX |
| `CMS` | Content Management (bestehend + Ausbau) |
| `PGB` | Page Builder & dynamische Seiten |
| `MED` | Medien-Bibliothek |
| `SEO` | SEO Control Center |
| `CNT` | Kontakt & Kanäle |
| `API` | API-Keys & Secrets |
| `SEC` | Sicherheit & Rollen |
| `AI` | AI Automation Hub |
| `ANA` | Analytics |
| `DSN` | Design System global |
| `ANI` | Animationen global |
| `INF` | Infrastruktur & Deploy |

---

## Bereits erledigt (Website & Basis-Admin)

### Öffentliche Website
- [x] Luxury Navbar, Hero, Leistungen, Portfolio, Warum OrzuIT, Kontakt, Footer
- [x] Framer Motion, Scroll, Hover, 3D-inspirierte Karten
- [x] Kontaktformular 3D mit Telefon, Leistung, Status-Karten
- [x] Kartenbilder für Leistungen & Portfolio (Upload + URL)

### Backend & Basis
- [x] Supabase, Schema, Auth, Server Actions
- [x] Resend, Telegram, Leads
- [x] Dashboard-Layout, Leads, Content-Texte, Services, Portfolio, Testimonials
- [x] SEO Startseite, Einstellungen, Integrationen, Deploy, Domains
- [x] Rechtliches (Impressum/Datenschutz)
- [x] CMS: Hero, Sektionstexte, Menü/Footer, Karten, SEO

### Deployment
- [x] GitHub, Env-Vars
- [x] Lighthouse 95+ (laufend)
- [x] Production-Härtung auf Vercel (laufend)

---

## Phase 0 — Admin-Architektur (JETZT)

> Verständliche Struktur: *Was bearbeite ich wo?* — ohne Code.

| ID | Aufgabe | Status |
|----|---------|--------|
| ADM-001 | Roadmap & Phasenplan in TASKS.md | [x] |
| ADM-002 | Modulare Navigation (Gruppen: Website, Einträge, Business, System) | [x] |
| ADM-003 | Content-Hub mit Übersicht aller Startseiten-Bereiche | [x] |
| ADM-004 | Einträge-Hub (Leistungen, Portfolio, Warum) mit klaren Hinweisen | [x] |
| ADM-005 | Einstellungen-Hub mit Checkliste „Was ist konfiguriert?“ | [x] |
| ADM-006 | Kontext-Hilfe auf jeder Admin-Seite („Was ändert sich auf der Website?“) | [x] |
| ADM-007 | Einheitliche Formular-Patterns (Speichern, Toast, Vorschau-Link) | [x] |
| ADM-008 | Admin-Glossar (Begriffe: Sektion vs. Karte vs. Marketing) | [x] |

---

## Phase 1 — Volle Content-Kontrolle (ohne Code)

### 1.1 Texte & globale Elemente
| ID | Aufgabe | Status |
|----|---------|--------|
| CMS-101 | Alle Startseiten-Texte über Content-Hub erreichbar | [x] |
| CMS-102 | Menü: Labels, Links, Reihenfolge, Sichtbarkeit | [x] |
| CMS-103 | Footer: Texte, Links, Copyright, Social-Platzhalter | [x] |
| CMS-104 | Buttons & CTAs zentral pflegbar (Hero, Sektionen, FAB) | [x] |
| CMS-105 | Rechtstexte: Versionierung / letzte Änderung anzeigen | [x] |

### 1.2 Karten & Listen
| ID | Aufgabe | Status |
|----|---------|--------|
| CMS-110 | Leistungen: CRUD, Sortierung, Bild, Veröffentlichen | [x] |
| CMS-111 | Portfolio: CRUD, Sortierung, Bild, Projekt-URL | [x] |
| CMS-112 | Warum OrzuIT: CRUD, Sortierung | [x] |
| CMS-113 | Neue Karte anlegen (ohne SQL) | [x] |
| CMS-114 | Karte löschen mit Bestätigung | [x] |
| CMS-115 | Karte duplizieren | [x] |
| CMS-116 | Drag & Drop Sortierung (Leistungen, Portfolio, Warum) | [x] |

### 1.3 Medien
| ID | Aufgabe | Status |
|----|---------|--------|
| MED-101 | Zentrale Medien-Bibliothek (Liste aller Uploads) | [x] |
| MED-102 | Bild pro Karte (bereits) → in Bibliothek integrieren | [x] |
| MED-103 | Alt-Text & Titel pro Bild | [x] |
| MED-104 | Automatische WebP/AVIF-Konvertierung | [x] |
| MED-105 | Video-Upload & Einbettung | [x] |
| MED-106 | SVG-Upload | [x] |

---

## Phase 2 — Dynamisches Seiten-System

| ID | Aufgabe | Status |
|----|---------|--------|
| PGB-201 | Tabelle `pages` (slug, title, status, template, locale) | [x] |
| PGB-202 | Seite anlegen / löschen / duplizieren | [x] |
| PGB-203 | Draft / Published / geplant (scheduled) | [x] |
| PGB-204 | Route- & Slug-Editor mit Validierung | [x] |
| PGB-205 | Verschachtelte Seiten (Parent/Child) | [x] |
| PGB-206 | Mehrsprachigkeit (de/en) — Struktur | [x] |
| PGB-207 | Seiten-Templates (Landing, Legal, Blank) | [x] |

---

## Phase 3 — Page Builder (Blöcke)

| ID | Aufgabe | Status |
|----|---------|--------|
| PGB-301 | Schema: `sections` + `blocks` pro Seite | [x] |
| PGB-302 | Block-Typen: Hero, Features, Services, Portfolio, Testimonials, FAQ, Pricing, CTA, Stats, Team, AI, Contact, Timeline | [x] |
| PGB-303 | Custom HTML / Markdown / React-Block (Sandbox) | [x] |
| PGB-304 | Blöcke: Reihenfolge, duplizieren, löschen, ein/aus | [x] |
| PGB-305 | Block-Layout: Padding, Margin, Hintergrund, Gradient | [x] |
| PGB-306 | Responsive: Mobile / Tablet / Desktop pro Block | [x] |
| PGB-307 | Animation pro Block (Preset, Intensität, Scroll) | [x] |
| PGB-308 | Live-Vorschau / Split-Editor | [x] |

---

## Phase 4 — Komponenten-Level Editor

| ID | Aufgabe | Status |
|----|---------|--------|
| CMS-401 | Hero: alle Felder + Medien + Animation | [x] |
| CMS-402 | Leistungs-Karte: Icon, Tags, 3D, CTA | [x] |
| CMS-403 | Portfolio-Karte: Case-Study, Besuchen-Link | [x] |
| CMS-404 | Globale Farben & Typografie (Design Tokens) | [x] |
| CMS-405 | Spacing & Layout-Presets global | [x] |
| CMS-406 | Favicon & App-Icons Upload | [x] |

---

## Phase 5 — Kontakt-System erweitert

| ID | Aufgabe | Status |
|----|---------|--------|
| CNT-501 | Kanäle: Telegram, WhatsApp, Instagram, LinkedIn, E-Mail, Calendly | [x] |
| CNT-502 | Labels, Icons, Sichtbarkeit pro Kanal | [x] |
| CNT-503 | Routing (FAB vs. Footer vs. Kontaktsektion) | [x] |
| CNT-504 | Webhooks bei Lead (Zapier/Make-ready) | [x] |

---

## Phase 6 — API & Secrets (secure)

| ID | Aufgabe | Status |
|----|---------|--------|
| API-601 | UI für Secrets (maskiert, nie Klartext nach Speichern) | [x] |
| API-602 | Verschlüsselte Speicherung in DB (`api_keys`) | [x] |
| API-603 | OpenAI, Anthropic, Telegram, SMTP, Resend, Stripe, Supabase, GitHub, Vercel, Cloudflare | [x] |
| API-604 | Audit-Log: wer hat wann geändert | [x] |
| API-605 | Key-Rotation & Env-Sync Hinweis | [x] |

---

## Phase 7 — Sicherheit & Rollen

| ID | Aufgabe | Status |
|----|---------|--------|
| SEC-701 | Rollen: Owner, Admin, Editor, Designer, AI Operator, Viewer | [x] |
| SEC-702 | Granulare Rechte (pro Seite, pro Modul) | [x] |
| SEC-703 | Custom Admin-Route / Alias | [x] |
| SEC-704 | 2FA | [x] |
| SEC-705 | Session- & Geräte-Verwaltung | [x] |
| SEC-706 | IP- / Geo-Restriction (optional) | [x] |
| SEC-707 | Rate Limit & Bot-Schutz Admin | [x] |

---

## Phase 8 — SEO Control Center

| ID | Aufgabe | Status |
|----|---------|--------|
| SEO-801 | SEO pro Seite (nicht nur Startseite) | [x] |
| SEO-802 | OG-Image Generator / Upload | [x] |
| SEO-803 | Schema.org Editor | [x] |
| SEO-804 | Canonical URLs | [x] |
| SEO-805 | Indexierung pro Seite | [x] |
| SEO-806 | robots.txt Editor | [x] |
| SEO-807 | Redirects-Manager (301/302) | [x] |
| SEO-808 | Sitemap-Steuerung | [x] |

---

## Phase 9 — AI Automation Hub

| ID | Aufgabe | Status |
|----|---------|--------|
| AI-901 | AI Content-Entwürfe für Sektionen | [x] |
| AI-902 | AI SEO (Title, Description, OG) | [x] |
| AI-903 | AI Übersetzungen | [x] |
| AI-904 | AI Lead-Zusammenfassung | [x] |
| AI-905 | AI Assistent im Admin (Chat) | [x] |

---

## Phase 10 — Analytics Dashboard

| ID | Aufgabe | Status |
|----|---------|--------|
| ANA-1001 | Traffic & Conversion Übersicht | [x] |
| ANA-1002 | CTA-Klicks & Scroll-Tiefe | [x] |
| ANA-1003 | Lead-Funnel | [x] |
| ANA-1004 | Core Web Vitals Anzeige | [x] |
| ANA-1005 | Heatmap-Integration (optional) | [x] |

---

## Phase 11 — Design System global

| ID | Aufgabe | Status |
|----|---------|--------|
| DSN-1101 | Typografie (Fonts, Größen) im Admin | [x] |
| DSN-1102 | Farben & Akzente | [x] |
| DSN-1103 | Schatten, Borders, Glassmorphism | [x] |
| DSN-1104 | Motion-Presets global | [x] |
| DSN-1105 | Theme-Vorschau Live | [x] |

---

## Phase 12 — Animation System (global steuerbar)

| ID | Aufgabe | Status |
|----|---------|--------|
| ANI-1201 | Framer-Motion-Presets wählen | [x] |
| ANI-1202 | Parallax / Tilt / Glow global ein/aus | [x] |
| ANI-1203 | Reduced-Motion respektieren (Admin-Schalter) | [x] |
| ANI-1204 | Scroll-Reveal Intensität | [x] |

---

## Phase 13 — Datenbank-Architektur (Ziel)

| Tabelle | Status |
|---------|--------|
| pages, sections, blocks | [x] |
| settings, seo, media | [x] |
| users, roles, permissions | [x] |
| api_keys, animations, themes, navigation | [x] |

---

## Phase 14 — Skalierung (Zukunft)

| ID | Aufgabe | Status |
|----|---------|--------|
| SCL-1401 | Multi-Site / Mandanten | [x] |
| SCL-1402 | Client-Dashboards | [x] |
| SCL-1403 | CRM-Anbindung | [x] |
| SCL-1404 | Billing / Stripe Portal | [x] |
| SCL-1405 | Automation Pipelines | [x] |
| SCL-1406 | SaaS-Transformation | [x] |

---

## Nächster Schritt (Agent)

1. ~~ADM-001 … ADM-008, CMS-101 … CMS-116, CMS-401 … CMS-406, MED-101 … MED-106, PGB-201 … PGB-308, CNT-501 … CNT-504, API-601 … API-605, SEC-701 … SEC-707, SEO-801 … SEO-808, AI-901 … AI-905, ANA-1001 … ANA-1005, DSN-1101 … DSN-1105, ANI-1201 … ANI-1204, Phase 13, SCL-1401 … SCL-1406~~ erledigt  
2. ~~Lighthouse 95+ und Production-Härtung auf Vercel~~ code-seitig vorbereitet  
3. Nächster sinnvoller Schritt: Migrationen in Supabase anwenden und Admin-Flows im Browser testen.  
4. Danach: Vercel Deploy prüfen und Lighthouse gegen die Live-Domain laufen lassen.

---

*Letzte Aktualisierung: Lighthouse- und Production-Härtung sind code-seitig vorbereitet; finale Werte müssen nach Supabase-Migration und Vercel-Deploy live geprüft werden.*
