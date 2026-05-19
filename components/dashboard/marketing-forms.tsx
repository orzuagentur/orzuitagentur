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
              <label className={labelClass} htmlFor="hero_mediaUrl">Hero Media URL</label>
              <input className={inputClass} id="hero_mediaUrl" name="hero_mediaUrl" defaultValue={h.mediaUrl ?? ""} placeholder="Bild oder Video URL" />
            </div>
            <div>
              <label className={labelClass} htmlFor="hero_mediaAlt">Hero Media Alt</label>
              <input className={inputClass} id="hero_mediaAlt" name="hero_mediaAlt" defaultValue={h.mediaAlt ?? ""} />
            </div>
            <div>
              <label className={labelClass} htmlFor="hero_animationPreset">Hero Animation</label>
              <select className={inputClass} id="hero_animationPreset" name="hero_animationPreset" defaultValue={h.animationPreset ?? "cinematic"}>
                <option value="cinematic">cinematic</option>
                <option value="fade">fade</option>
                <option value="minimal">minimal</option>
                <option value="depth">depth</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="hero_animationIntensity">Hero Motion Intensität</label>
              <select className={inputClass} id="hero_animationIntensity" name="hero_animationIntensity" defaultValue={h.animationIntensity ?? "medium"}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
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
  const socialLinks =
    marketing.footer.socialLinks?.length
      ? marketing.footer.socialLinks
      : [
          { label: "Instagram", href: "", visible: false },
          { label: "LinkedIn", href: "", visible: false },
          { label: "WhatsApp", href: "", visible: false },
          { label: "Telegram", href: "", visible: false },
        ];

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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Navigation
          </p>
          {marketing.nav.links.map((link, i) => (
            <fieldset
              key={`nav-${i}`}
              className="rounded-xl border border-[var(--border)] p-3"
            >
              <legend className="px-1 text-xs font-semibold text-[var(--foreground)]">
                Menüpunkt {i + 1}
              </legend>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_96px_auto]">
              <div>
                <label className={labelClass} htmlFor={`nav_href_${i}`}>Link {i + 1} (href)</label>
                <input
                  className={inputClass}
                  id={`nav_href_${i}`}
                  name={`nav_href_${i}`}
                  defaultValue={link.href}
                  placeholder={link.href.includes("warum") || link.href.includes("orzu") ? "#warum-orzuit" : "#start"}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`nav_label_${i}`}>Label {i + 1}</label>
                <input className={inputClass} id={`nav_label_${i}`} name={`nav_label_${i}`} defaultValue={link.label} />
              </div>
                <div>
                  <label className={labelClass} htmlFor={`nav_sort_${i}`}>
                    Reihenfolge
                  </label>
                  <input
                    className={inputClass}
                    id={`nav_sort_${i}`}
                    name={`nav_sort_${i}`}
                    type="number"
                    defaultValue={link.sortOrder ?? i + 1}
                  />
                </div>
                <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    name={`nav_visible_${i}`}
                    value="true"
                    defaultChecked={link.visible !== false}
                    className="h-4 w-4 rounded border-[var(--border-strong)]"
                  />
                  Sichtbar
                </label>
              </div>
            </fieldset>
          ))}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="nav_ctaLabel">Header/FAB · CTA Text</label>
              <input className={inputClass} id="nav_ctaLabel" name="nav_ctaLabel" defaultValue={marketing.nav.ctaLabel} />
            </div>
            <div>
              <label className={labelClass} htmlFor="nav_ctaHref">Header/FAB · CTA Link</label>
              <input className={inputClass} id="nav_ctaHref" name="nav_ctaHref" defaultValue={marketing.nav.ctaHref ?? "#kontakt"} />
            </div>
          </div>
          <hr className="border-[var(--border)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Footer & globale CTAs
          </p>
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
              <label className={labelClass} htmlFor="footer_ctaHref">Footer · CTA Link</label>
              <input className={inputClass} id="footer_ctaHref" name="footer_ctaHref" defaultValue={marketing.footer.ctaHref ?? "#kontakt"} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
          <hr className="border-[var(--border)]" />
          <div>
            <label className={labelClass} htmlFor="footer_socialHeading">
              Social-Überschrift
            </label>
            <input
              className={inputClass}
              id="footer_socialHeading"
              name="footer_socialHeading"
              defaultValue={marketing.footer.socialHeading ?? "Social"}
            />
          </div>
          {socialLinks.map((link, i) => (
            <fieldset
              key={`social-${i}`}
              className="rounded-xl border border-[var(--border)] p-3"
            >
              <legend className="px-1 text-xs font-semibold text-[var(--foreground)]">
                Social Link {i + 1}
              </legend>
              <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <input
                  className={inputClass}
                  name={`footer_social_label_${i}`}
                  defaultValue={link.label}
                  placeholder="Label, z. B. LinkedIn"
                />
                <input
                  className={inputClass}
                  name={`footer_social_href_${i}`}
                  defaultValue={link.href}
                  placeholder="https://..."
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)] sm:mt-6">
                  <input
                    type="checkbox"
                    name={`footer_social_visible_${i}`}
                    value="true"
                    defaultChecked={link.visible === true}
                    className="h-4 w-4 rounded border-[var(--border-strong)]"
                  />
                  Sichtbar
                </label>
              </div>
            </fieldset>
          ))}
          <hr className="border-[var(--border)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Design Tokens
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <input className={inputClass} name="design_accent" defaultValue={marketing.designSystem.accent} placeholder="Accent #7dd3fc" />
            <input className={inputClass} name="design_accent2" defaultValue={marketing.designSystem.accent2} placeholder="Accent 2" />
            <input className={inputClass} name="design_foreground" defaultValue={marketing.designSystem.foreground} placeholder="Foreground" />
            <input className={inputClass} name="design_background" defaultValue={marketing.designSystem.background} placeholder="Background" />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <select className={inputClass} name="design_typographyScale" defaultValue={marketing.designSystem.typographyScale}>
              <option value="compact">compact</option>
              <option value="comfortable">comfortable</option>
              <option value="large">large</option>
            </select>
            <select className={inputClass} name="design_radius" defaultValue={marketing.designSystem.radius}>
              <option value="sharp">sharp</option>
              <option value="rounded">rounded</option>
              <option value="pill">pill</option>
            </select>
            <select className={inputClass} name="design_spacingPreset" defaultValue={marketing.designSystem.spacingPreset}>
              <option value="compact">compact</option>
              <option value="luxury">luxury</option>
              <option value="spacious">spacious</option>
            </select>
            <select className={inputClass} name="design_sectionPadding" defaultValue={marketing.designSystem.sectionPadding}>
              <option value="small">small</option>
              <option value="large">large</option>
              <option value="cinematic">cinematic</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <select className={inputClass} name="design_shadowPreset" defaultValue={marketing.designSystem.shadowPreset ?? "soft"}>
              <option value="none">shadow: none</option>
              <option value="soft">shadow: soft</option>
              <option value="deep">shadow: deep</option>
              <option value="neon">shadow: neon</option>
            </select>
            <select className={inputClass} name="design_borderPreset" defaultValue={marketing.designSystem.borderPreset ?? "subtle"}>
              <option value="none">border: none</option>
              <option value="subtle">border: subtle</option>
              <option value="strong">border: strong</option>
              <option value="accent">border: accent</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                name="design_glassmorphism"
                defaultChecked={marketing.designSystem.glassmorphism ?? true}
                className="h-4 w-4 rounded border-[var(--border-strong)]"
              />
              Glassmorphism
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <select className={inputClass} name="design_motionPreset" defaultValue={marketing.designSystem.motionPreset ?? "cinematic"}>
              <option value="minimal">motion: minimal</option>
              <option value="smooth">motion: smooth</option>
              <option value="cinematic">motion: cinematic</option>
              <option value="energetic">motion: energetic</option>
            </select>
            <select className={inputClass} name="design_framerPreset" defaultValue={marketing.designSystem.framerPreset ?? "smooth"}>
              <option value="fade">Framer: fade</option>
              <option value="smooth">Framer: smooth</option>
              <option value="spring">Framer: spring</option>
              <option value="depth">Framer: depth</option>
            </select>
            <select className={inputClass} name="design_scrollRevealIntensity" defaultValue={marketing.designSystem.scrollRevealIntensity ?? "medium"}>
              <option value="off">scroll reveal: off</option>
              <option value="low">scroll reveal: low</option>
              <option value="medium">scroll reveal: medium</option>
              <option value="high">scroll reveal: high</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="design_parallaxEnabled" defaultChecked={marketing.designSystem.parallaxEnabled ?? true} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Parallax
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="design_tiltEnabled" defaultChecked={marketing.designSystem.tiltEnabled ?? true} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Tilt
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="design_glowEnabled" defaultChecked={marketing.designSystem.glowEnabled ?? true} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Glow
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="design_reducedMotion" defaultChecked={marketing.designSystem.reducedMotion ?? false} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Reduced Motion
            </label>
          </div>
          <hr className="border-[var(--border)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            App Icons & Medien-Pipeline
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className={inputClass} name="assets_faviconUrl" defaultValue={marketing.siteAssets.faviconUrl} placeholder="Favicon URL" />
            <input className={inputClass} name="assets_appleIconUrl" defaultValue={marketing.siteAssets.appleIconUrl} placeholder="Apple Icon URL" />
            <input className={inputClass} name="assets_ogFallbackImageUrl" defaultValue={marketing.siteAssets.ogFallbackImageUrl} placeholder="OG Fallback Image URL" />
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="media_autoWebp" defaultChecked={marketing.mediaPipeline.autoWebp} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Auto WebP
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="media_autoAvif" defaultChecked={marketing.mediaPipeline.autoAvif} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Auto AVIF
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="media_videoUploads" defaultChecked={marketing.mediaPipeline.videoUploads} className="h-4 w-4 rounded border-[var(--border-strong)]" />
              Video Uploads
            </label>
            <select className={inputClass} name="media_preferredImageFormat" defaultValue={marketing.mediaPipeline.preferredImageFormat}>
              <option value="original">original</option>
              <option value="webp">webp</option>
              <option value="avif">avif</option>
            </select>
            <input className={inputClass} name="media_maxUploadMb" type="number" defaultValue={marketing.mediaPipeline.maxUploadMb} />
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
  const channels =
    marketing.contact.channels?.length
      ? marketing.contact.channels
      : [
          { key: "telegram", label: "Telegram", href: "", icon: "telegram", visible: false, route: "contact" as const },
          { key: "whatsapp", label: "WhatsApp", href: "", icon: "whatsapp", visible: false, route: "fab" as const },
          { key: "instagram", label: "Instagram", href: "", icon: "instagram", visible: false, route: "footer" as const },
          { key: "linkedin", label: "LinkedIn", href: "", icon: "linkedin", visible: false, route: "footer" as const },
          { key: "email", label: "E-Mail", href: `mailto:${marketing.contact.email}`, icon: "mail", visible: true, route: "all" as const },
          { key: "calendly", label: "Termin buchen", href: "", icon: "calendar", visible: false, route: "contact" as const },
        ];

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
            <label className={labelClass} htmlFor="contact_submittingTitle">Senden · Titel</label>
            <input className={inputClass} id="contact_submittingTitle" name="contact_submittingTitle" defaultValue={marketing.contact.submittingTitle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_submittingBody">Senden · Text</label>
            <textarea className={`${inputClass} min-h-[80px]`} id="contact_submittingBody" name="contact_submittingBody" defaultValue={marketing.contact.submittingBody} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_successTitle">Erfolg · Titel</label>
            <input className={inputClass} id="contact_successTitle" name="contact_successTitle" defaultValue={marketing.contact.successTitle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_successBody">Erfolg · Text vor E-Mail-Link</label>
            <textarea className={`${inputClass} min-h-[80px]`} id="contact_successBody" name="contact_successBody" defaultValue={marketing.contact.successBody} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contact_webhookUrl">Lead Webhook URL (Zapier/Make)</label>
            <input className={inputClass} id="contact_webhookUrl" name="contact_webhookUrl" defaultValue={marketing.contact.webhookUrl ?? ""} placeholder="https://hooks.zapier.com/..." />
          </div>
          <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Kontaktkanäle
            </p>
            {channels.map((channel) => (
              <fieldset key={channel.key} className="rounded-xl border border-[var(--border)] p-3">
                <legend className="px-1 text-xs font-semibold text-[var(--foreground)]">
                  {channel.key}
                </legend>
                <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr_1fr_1fr_auto]">
                  <input type="hidden" name={`channel_${channel.key}_key`} value={channel.key} />
                  <input className={inputClass} name={`channel_${channel.key}_label`} defaultValue={channel.label} placeholder="Label" />
                  <input className={inputClass} name={`channel_${channel.key}_href`} defaultValue={channel.href} placeholder="URL / mailto / tel" />
                  <input className={inputClass} name={`channel_${channel.key}_icon`} defaultValue={channel.icon} placeholder="Icon" />
                  <select className={inputClass} name={`channel_${channel.key}_route`} defaultValue={channel.route}>
                    <option value="contact">Contact</option>
                    <option value="fab">FAB</option>
                    <option value="footer">Footer</option>
                    <option value="all">Alle</option>
                  </select>
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)] sm:mt-6">
                    <input type="checkbox" name={`channel_${channel.key}_visible`} defaultChecked={channel.visible} className="h-4 w-4 rounded border-[var(--border-strong)]" />
                    Sichtbar
                  </label>
                </div>
              </fieldset>
            ))}
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
          <textarea
            className={`${inputClass} min-h-[70px]`}
            name="svc_subtitleRight"
            defaultValue={s.subtitleRight}
            placeholder="Text rechts neben der Überschrift (Desktop)"
          />
          <textarea
            className={`${inputClass} min-h-[50px]`}
            name="svc_footnote"
            defaultValue={s.footnote}
            placeholder="Hinweis unter der Karussell"
          />
          <textarea className={`${inputClass} min-h-[60px]`} name="svc_closing" defaultValue={s.closing} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputClass} name="svc_ctaLabel" defaultValue={s.ctaLabel} placeholder="CTA Text" />
            <input className={inputClass} name="svc_ctaHref" defaultValue={s.ctaHref ?? "#kontakt"} placeholder="CTA Link" />
          </div>
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
