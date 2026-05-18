import {
  saveContactBlock,
  saveHeroContent,
  saveNavAndFooter,
  savePortfolioIntro,
  saveServicesIntro,
  saveTechnologiesSection,
  saveWarumIntro,
} from "@/actions/cms/marketing";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import {
  cmsFormWrapClass,
  cmsInputClass as inputClass,
  cmsLabelClass as labelClass,
  cmsSectionCardClass,
} from "@/lib/dashboard/cms-form-styles";
import type { MarketingContent } from "@/lib/cms/types";

export type MarketingFormsProps = {
  marketing: MarketingContent;
};

export function HeroForm({ marketing }: MarketingFormsProps) {
  const h = marketing.hero;
  const sec = (i: number) => h.stats[i];

  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">Hero · #start</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Hauptüberschrift, Untertitel, Buttons und Kennzahlen.
        </p>
        <form action={saveHeroContent} className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="badge">Badge</label>
            <input className={inputClass} id="badge" name="badge" defaultValue={h.badge} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label className={labelClass} htmlFor="titleBefore">Titel (vor Hervorhebung)</label>
              <input className={inputClass} id="titleBefore" name="titleBefore" defaultValue={h.titleBefore} />
            </div>
            <div>
              <label className={labelClass} htmlFor="titleHighlight">Hervorhebung</label>
              <input className={inputClass} id="titleHighlight" name="titleHighlight" defaultValue={h.titleHighlight} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="titleAfter">Titel (nach Hervorhebung)</label>
              <input className={inputClass} id="titleAfter" name="titleAfter" defaultValue={h.titleAfter} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="subtitle">Untertitel</label>
            <textarea className={`${inputClass} min-h-[100px]`} id="subtitle" name="subtitle" defaultValue={h.subtitle} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="primaryCta_label">Primär-CTA Text</label>
              <input className={inputClass} id="primaryCta_label" name="primaryCta_label" defaultValue={h.primaryCta.label} />
            </div>
            <div>
              <label className={labelClass} htmlFor="primaryCta_href">Primär-CTA Link</label>
              <input className={inputClass} id="primaryCta_href" name="primaryCta_href" defaultValue={h.primaryCta.href} />
            </div>
            <div>
              <label className={labelClass} htmlFor="secondaryCta_label">Sekundär-CTA Text</label>
              <input className={inputClass} id="secondaryCta_label" name="secondaryCta_label" defaultValue={h.secondaryCta.label} />
            </div>
            <div>
              <label className={labelClass} htmlFor="secondaryCta_href">Sekundär-CTA Link</label>
              <input className={inputClass} id="secondaryCta_href" name="secondaryCta_href" defaultValue={h.secondaryCta.href} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <fieldset
                key={`stat-${i}`}
                className="rounded-xl border border-[var(--border)] p-4"
              >
                <legend className="px-1 text-xs font-semibold text-[var(--foreground)]">
                  Kennzahl {i + 1}
                </legend>
                <div className="mt-2 grid gap-2">
                  <input className={inputClass} name={`stat${i}_label`} defaultValue={sec(i).label} placeholder="Label" />
                  <input className={inputClass} name={`stat${i}_value`} defaultValue={sec(i).value} placeholder="Wert" />
                  <input className={inputClass} name={`stat${i}_suffix`} defaultValue={sec(i).valueSuffix ?? ""} placeholder="Suffix (optional)" />
                  <input className={inputClass} name={`stat${i}_hint`} defaultValue={sec(i).hint} placeholder="Hinweis" />
                </div>
              </fieldset>
            ))}
          </div>

          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Hero speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}

export function NavFooterForm({ marketing }: MarketingFormsProps) {
  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Menü &amp; Footer
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Texte für Start, Portfolio, Projekt anfragen usw. auf der Kundenseite.
        </p>
        <form action={saveNavAndFooter} className="mt-4 space-y-4">
          <p className="text-xs text-[var(--muted)]">Navigationszeilen (Anzahl fix wie in den Defaults)</p>
          {marketing.nav.links.map((link, i) => (
            <div key={`nav-${i}`} className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`nav_href_${i}`}>Link {i + 1} (href)</label>
                <input className={inputClass} id={`nav_href_${i}`} name={`nav_href_${i}`} defaultValue={link.href} />
              </div>
              <div>
                <label className={labelClass} htmlFor={`nav_label_${i}`}>Label {i + 1}</label>
                <input className={inputClass} id={`nav_label_${i}`} name={`nav_label_${i}`} defaultValue={link.label} />
              </div>
            </div>
          ))}
          <div>
            <label className={labelClass} htmlFor="nav_ctaLabel">Header-CTA</label>
            <input className={inputClass} id="nav_ctaLabel" name="nav_ctaLabel" defaultValue={marketing.nav.ctaLabel} />
          </div>
          <hr className="border-[var(--border)]" />
          <div>
            <label className={labelClass} htmlFor="footer_tagline">Footer · Kurztext</label>
            <textarea className={`${inputClass} min-h-[80px]`} id="footer_tagline" name="footer_tagline" defaultValue={marketing.footer.tagline} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="footer_ctaLabel">Footer · CTA</label>
              <input className={inputClass} id="footer_ctaLabel" name="footer_ctaLabel" defaultValue={marketing.footer.ctaLabel} />
            </div>
            <div>
              <label className={labelClass} htmlFor="footer_email">Footer · E-Mail</label>
              <input className={inputClass} id="footer_email" name="footer_email" defaultValue={marketing.footer.email} type="email" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="footer_navHeading">Abschnitt Navigation</label>
              <input className={inputClass} id="footer_navHeading" name="footer_navHeading" defaultValue={marketing.footer.navHeading} />
            </div>
            <div>
              <label className={labelClass} htmlFor="footer_contactHeading">Abschnitt Kontakt</label>
              <input className={inputClass} id="footer_contactHeading" name="footer_contactHeading" defaultValue={marketing.footer.contactHeading} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="footer_contactLead">Kontakt · Lead-Text</label>
            <textarea className={`${inputClass} min-h-[70px]`} id="footer_contactLead" name="footer_contactLead" defaultValue={marketing.footer.contactLead} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="footer_locationLine">Standort-Zeile</label>
              <input className={inputClass} id="footer_locationLine" name="footer_locationLine" defaultValue={marketing.footer.locationLine} />
            </div>
            <div>
              <label className={labelClass} htmlFor="footer_copyrightName">Copyright-Name</label>
              <input className={inputClass} id="footer_copyrightName" name="footer_copyrightName" defaultValue={marketing.footer.copyrightName} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="footer_impressumLabel">Impressum-Label</label>
              <input className={inputClass} id="footer_impressumLabel" name="footer_impressumLabel" defaultValue={marketing.footer.impressumLabel} />
            </div>
            <div>
              <label className={labelClass} htmlFor="footer_privacyLabel">Datenschutz-Label</label>
              <input className={inputClass} id="footer_privacyLabel" name="footer_privacyLabel" defaultValue={marketing.footer.privacyLabel} />
            </div>
          </div>
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Navigation &amp; Footer speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}

export function ContactForm({ marketing }: MarketingFormsProps) {
  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Kontakt · #kontakt
        </h2>
        <form action={saveContactBlock} className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="contact_kicker">Kicker</label>
            <input className={inputClass} id="contact_kicker" name="contact_kicker" defaultValue={marketing.contact.kicker} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_heading">Überschrift</label>
            <input className={inputClass} id="contact_heading" name="contact_heading" defaultValue={marketing.contact.heading} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_intro">Einleitung</label>
            <textarea className={`${inputClass} min-h-[80px]`} id="contact_intro" name="contact_intro" defaultValue={marketing.contact.intro} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_asideTitle">Karten-Titel</label>
            <input className={inputClass} id="contact_asideTitle" name="contact_asideTitle" defaultValue={marketing.contact.asideTitle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_asideText">Karten-Text</label>
            <textarea className={`${inputClass} min-h-[80px]`} id="contact_asideText" name="contact_asideText" defaultValue={marketing.contact.asideText} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_email">E-Mail</label>
            <input className={inputClass} id="contact_email" name="contact_email" type="email" defaultValue={marketing.contact.email} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_responseTime">Antwortzeit-Hinweis</label>
            <input className={inputClass} id="contact_responseTime" name="contact_responseTime" defaultValue={marketing.contact.responseTime} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_privacyNote">Datenschutz-Hinweis</label>
            <textarea className={`${inputClass} min-h-[100px]`} id="contact_privacyNote" name="contact_privacyNote" defaultValue={marketing.contact.privacyNote} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_successTitle">Erfolg · Titel</label>
            <input className={inputClass} id="contact_successTitle" name="contact_successTitle" defaultValue={marketing.contact.successTitle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_successBody">Erfolg · Text vor E-Mail-Link</label>
            <textarea className={`${inputClass} min-h-[80px]`} id="contact_successBody" name="contact_successBody" defaultValue={marketing.contact.successBody} />
          </div>
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Kontakt speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}

export function LeistungenIntroForm({ marketing }: MarketingFormsProps) {
  const s = marketing.servicesSection;
  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Leistungen · #leistungen
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Nur Überschrift und Texte über dem Leistungs-Block — keine einzelnen Karten.
        </p>
        <form action={saveServicesIntro} className="mt-4 space-y-4">
          <input className={inputClass} name="svc_kicker" defaultValue={s.kicker} placeholder="Kicker" />
          <input className={inputClass} name="svc_title" defaultValue={s.title} placeholder="Titel" />
          <textarea className={`${inputClass} min-h-[70px]`} name="svc_subtitle" defaultValue={s.subtitle} />
          <textarea className={`${inputClass} min-h-[60px]`} name="svc_closing" defaultValue={s.closing} />
          <input className={inputClass} name="svc_ctaLabel" defaultValue={s.ctaLabel} />
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Leistungen speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}

export function PortfolioIntroForm({ marketing }: MarketingFormsProps) {
  const p = marketing.portfolioSection;
  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Portfolio · #portfolio
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Nur Intro-Texte — keine Projekt-Einträge (die liegen unter Portfolio im Menü).
        </p>
        <form action={savePortfolioIntro} className="mt-4 space-y-4">
          <input className={inputClass} name="port_kicker" defaultValue={p.kicker} />
          <input className={inputClass} name="port_title" defaultValue={p.title} />
          <textarea className={`${inputClass} min-h-[70px]`} name="port_subtitleRight" defaultValue={p.subtitleRight} />
          <textarea className={`${inputClass} min-h-[50px]`} name="port_footnote" defaultValue={p.footnote} />
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Portfolio speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}

export function WarumIntroForm({ marketing }: MarketingFormsProps) {
  const t = marketing.testimonialsSection;
  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Warum OrzuIT · #warum-orzuit
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Überschriften und Texte — Karten-Inhalte bearbeiten Sie unter Warum OrzuIT im Menü.
        </p>
        <form action={saveWarumIntro} className="mt-4 space-y-4">
          <input className={inputClass} name="test_kicker" defaultValue={t.kicker} />
          <input className={inputClass} name="test_title" defaultValue={t.title} />
          <textarea className={`${inputClass} min-h-[70px]`} name="test_subtitle" defaultValue={t.subtitle} />
          <textarea className={`${inputClass} min-h-[50px]`} name="test_footnote" defaultValue={t.footnote} />
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Warum OrzuIT speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}

export function TechnologiesForm({ marketing }: MarketingFormsProps) {
  return (
    <div className={cmsFormWrapClass}>
      <section className={cmsSectionCardClass}>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Technologien · #technologien
        </h2>
        <form action={saveTechnologiesSection} className="mt-4 space-y-4">
          <input className={inputClass} name="tech_kicker" defaultValue={marketing.technologiesSection.kicker} />
          <input className={inputClass} name="tech_title" defaultValue={marketing.technologiesSection.title} />
          <textarea className={`${inputClass} min-h-[80px]`} name="tech_subtitle" defaultValue={marketing.technologiesSection.subtitle} />
          {[0, 1, 2].map((i) => {
            const st = marketing.technologiesSection.stacks[i];
            return (
              <fieldset key={`tech-${i}`} className="space-y-2 rounded-xl border border-[var(--border)] p-4">
                <legend className="px-1 text-xs font-semibold">Spalte {i + 1}</legend>
                <input className={inputClass} name={`tech_stack_${i}_title`} defaultValue={st.title} />
                <textarea className={`${inputClass} min-h-[60px]`} name={`tech_stack_${i}_desc`} defaultValue={st.description} />
                <input
                  className={inputClass}
                  name={`tech_stack_${i}_items`}
                  defaultValue={st.items.join(", ")}
                  placeholder="Komma-getrennt"
                />
              </fieldset>
            );
          })}
          <div>
            <label className={labelClass} htmlFor="tech_marqueeKicker">Marquee-Kicker</label>
            <input className={inputClass} id="tech_marqueeKicker" name="tech_marqueeKicker" defaultValue={marketing.technologiesSection.marqueeKicker} />
          </div>
          <div>
            <label className={labelClass} htmlFor="tech_marqueeItems">Marquee-Items (kommagetrennt)</label>
            <textarea className={`${inputClass} min-h-[60px]`} id="tech_marqueeItems" name="tech_marqueeItems" defaultValue={marketing.technologiesSection.marqueeItems.join(", ")} />
          </div>
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Technologien speichern
          </DashboardSubmitButton>
        </form>
      </section>
    </div>
  );
}
