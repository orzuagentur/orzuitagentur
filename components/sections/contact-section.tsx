"use client";

import { submitLead } from "@/actions/submit-lead";
import type { ContactContent } from "@/lib/cms/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useId,
  useMemo,
  useState,
  useTransition,
} from "react";

type FieldKey =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "serviceInterest"
  | "message"
  | "privacy";

type FormPhase = "form" | "submitting" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-()./]{8,28}$/;

function phoneHasEnoughDigits(value: string) {
  return value.replace(/\D/g, "").length >= 8;
}

function validate(
  data: Record<FieldKey, string>,
  privacyChecked: boolean,
): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();
  const serviceInterest = data.serviceInterest.trim();
  const message = data.message.trim();

  if (name.length < 2) {
    errors.name = "Bitte geben Sie mindestens 2 Zeichen ein.";
  }
  if (!email) {
    errors.email = "E-Mail ist erforderlich.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }
  if (!phone) {
    errors.phone = "Telefonnummer ist erforderlich.";
  } else if (!PHONE_RE.test(phone) || !phoneHasEnoughDigits(phone)) {
    errors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
  }
  if (!serviceInterest) {
    errors.serviceInterest = "Bitte wählen Sie eine Leistung oder ein Thema.";
  }
  if (message.length < 20) {
    errors.message =
      "Bitte beschreiben Sie Ihr Anliegen etwas ausführlicher (mind. 20 Zeichen).";
  }
  if (!privacyChecked) {
    errors.privacy = "Bitte bestätigen Sie die Datenschutzhinweise.";
  }
  return errors;
}

type ContactField3DProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: ReactNode;
};

function ContactField3D({
  id,
  label,
  required,
  error,
  errorId,
  children,
}: ContactField3DProps) {
  return (
    <motion.div
      className="contact-field-3d group flex flex-col gap-2"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
        {required ? <span className="text-[var(--accent)]"> *</span> : null}
      </label>
      <motion.div
        className={`contact-field-shell ${error ? "contact-field-shell-invalid" : ""}`}
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <span className="contact-field-depth" aria-hidden />
        <span className="contact-field-sheen" aria-hidden />
        <motion.div className="contact-field-inner">{children}</motion.div>
      </motion.div>
      {error ? (
        <p id={errorId} className="text-xs text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}

const fieldControlClass =
  "contact-field-control w-full border-0 bg-transparent px-4 py-3.5 text-sm outline-none";

type ContactSectionProps = {
  contact: ContactContent;
  serviceOptions: string[];
};

export function ContactSection({ contact, serviceOptions }: ContactSectionProps) {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [phase, setPhase] = useState<FormPhase>("form");
  const [serverError, setServerError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const serviceChoices = useMemo(() => {
    const fromCms = serviceOptions.filter(Boolean);
    const unique = Array.from(new Set(fromCms));
    return [...unique, "Erstberatung / noch unklar", "Sonstiges"];
  }, [serviceOptions]);

  const ids = useMemo(
    () => ({
      name: `${baseId}-name`,
      email: `${baseId}-email`,
      phone: `${baseId}-phone`,
      company: `${baseId}-company`,
      serviceInterest: `${baseId}-service`,
      message: `${baseId}-message`,
      privacy: `${baseId}-privacy`,
    }),
    [baseId],
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const data: Record<FieldKey, string> = {
      name,
      email,
      phone,
      company,
      serviceInterest,
      message,
      privacy: privacy ? "1" : "",
    };
    const next = validate(data, privacy);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPhase("submitting");

    startTransition(async () => {
      const result = await submitLead({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() ? company.trim() : undefined,
        serviceInterest: serviceInterest.trim(),
        message: message.trim(),
        privacyAccepted: true,
        source: "website",
      });

      if (result.ok) {
        setPhase("success");
      } else {
        setPhase("form");
        setServerError(result.error);
      }
    });
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setServiceInterest("");
    setMessage("");
    setPrivacy(false);
    setErrors({});
    setPhase("form");
    setServerError(null);
  }

  const formCardMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 18, rotateX: 8, scale: 0.98 },
        animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
        exit: { opacity: 0, y: -12, rotateX: -6, scale: 0.98 },
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
      };

  const statusCardMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="kontakt"
      aria-labelledby="contact-heading"
      className="home-section-anchor home-section-deferred relative isolate overflow-hidden border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_80%_20%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_60%)]"
        animate={reduceMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[color-mix(in_oklab,var(--surface)_40%,black)] to-transparent"
        animate={reduceMotion ? undefined : { opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="contact-orb pointer-events-none absolute -bottom-32 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_20%,transparent),transparent_70%)] blur-3xl opacity-75" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="contact-reveal contact-reveal-h max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
            {contact.kicker}
          </p>
          <h2
            id="contact-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            {contact.heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
            {contact.intro}
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="contact-reveal contact-reveal-aside flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md sm:p-7">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {contact.asideTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {contact.asideText}
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-5 inline-flex break-all text-sm font-medium text-[var(--accent)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {contact.email}
              </a>
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                {contact.responseTime}
              </p>
              {contact.channels?.some((channel) => channel.visible && (channel.route === "contact" || channel.route === "all")) ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {contact.channels
                    .filter((channel) => channel.visible && channel.href && (channel.route === "contact" || channel.route === "all"))
                    .map((channel) => (
                      <a
                        key={channel.key}
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                        className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)]"
                      >
                        {channel.icon} · {channel.label}
                      </a>
                    ))}
                </div>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {contact.privacyNote}
            </p>
          </div>

          <motion.div className="contact-reveal contact-reveal-form lg:col-span-7">
            <div
              className={`contact-form-scene contact-panel rounded-2xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_88%,transparent)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_24px_80px_-48px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8${phase === "form" ? "" : " contact-panel-status"}`}
            >
              <AnimatePresence mode="wait">
                {phase === "submitting" ? (
                  <motion.div
                    key="submitting"
                    className="contact-status-card contact-status-card-submitting"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    {...statusCardMotion}
                  >
                    <span className="contact-status-card-depth" aria-hidden />
                    <span className="contact-status-card-sheen" aria-hidden />
                    <motion.div
                      className="contact-status-spinner"
                      aria-hidden
                      animate={reduceMotion ? undefined : { rotate: 360 }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <p className="text-lg font-semibold text-[var(--foreground)]">
                      {contact.submittingTitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {contact.submittingBody}
                    </p>
                    <ol className="contact-submit-steps mt-8 space-y-3">
                      <li className="contact-submit-step is-active">
                        <span className="contact-submit-step-dot" aria-hidden />
                        <span>Angaben werden geprüft</span>
                      </li>
                      <li className="contact-submit-step is-active is-pulse">
                        <span className="contact-submit-step-dot" aria-hidden />
                        <span>Anfrage wird an unser Team gesendet</span>
                      </li>
                      <li className="contact-submit-step">
                        <span className="contact-submit-step-dot" aria-hidden />
                        <span>Bestätigung wird vorbereitet</span>
                      </li>
                    </ol>
                  </motion.div>
                ) : phase === "success" ? (
                  <motion.div
                    key="success"
                    className="contact-status-card contact-status-card-success"
                    role="status"
                    aria-live="polite"
                    {...statusCardMotion}
                  >
                    <span className="contact-status-card-depth" aria-hidden />
                    <span className="contact-status-card-sheen" aria-hidden />
                    <div className="contact-success-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                        <path
                          d="M5 12.5l4.2 4.2L19 6.8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-[var(--foreground)]">
                      {contact.successTitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {contact.successBody}
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-medium text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      >
                        {contact.email}
                      </a>
                      .
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                      {contact.responseTime}
                    </p>
                    <button
                      type="button"
                      className="cta-shine mt-8 inline-flex h-11 max-w-xs items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)] transition-[border-color,transform] duration-300 hover:border-[var(--border-strong)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:hover:translate-y-0"
                      onClick={resetForm}
                    >
                      Neue Anfrage
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                    noValidate
                    {...formCardMotion}
                  >
                    <motion.div
                      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.45 }}
                    >
                      <ContactField3D
                        id={ids.name}
                        label="Name"
                        required
                        error={errors.name}
                        errorId={`${ids.name}-err`}
                      >
                        <input
                          id={ids.name}
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-invalid={errors.name ? "true" : "false"}
                          aria-describedby={
                            errors.name ? `${ids.name}-err` : undefined
                          }
                          className={fieldControlClass}
                          placeholder="Vor- und Nachname"
                        />
                      </ContactField3D>

                      <ContactField3D
                        id={ids.email}
                        label="E-Mail"
                        required
                        error={errors.email}
                        errorId={`${ids.email}-err`}
                      >
                        <input
                          id={ids.email}
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          aria-invalid={errors.email ? "true" : "false"}
                          aria-describedby={
                            errors.email ? `${ids.email}-err` : undefined
                          }
                          className={fieldControlClass}
                          placeholder="name@unternehmen.de"
                        />
                      </ContactField3D>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.45 }}
                    >
                      <ContactField3D
                        id={ids.phone}
                        label="Telefon"
                        required
                        error={errors.phone}
                        errorId={`${ids.phone}-err`}
                      >
                        <input
                          id={ids.phone}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          aria-invalid={errors.phone ? "true" : "false"}
                          aria-describedby={
                            errors.phone ? `${ids.phone}-err` : undefined
                          }
                          className={fieldControlClass}
                          placeholder="+49 …"
                        />
                      </ContactField3D>

                      <ContactField3D id={ids.company} label="Unternehmen">
                        <input
                          id={ids.company}
                          name="company"
                          type="text"
                          autoComplete="organization"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className={fieldControlClass}
                          placeholder="Firma (optional)"
                        />
                      </ContactField3D>
                    </motion.div>

                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.14, duration: 0.45 }}
                    >
                      <ContactField3D
                        id={ids.serviceInterest}
                        label="Gewünschte Leistung"
                        required
                        error={errors.serviceInterest}
                        errorId={`${ids.serviceInterest}-err`}
                      >
                        <div className="contact-field-select-wrap">
                          <select
                            id={ids.serviceInterest}
                            name="serviceInterest"
                            value={serviceInterest}
                            onChange={(e) => setServiceInterest(e.target.value)}
                            aria-invalid={errors.serviceInterest ? "true" : "false"}
                            aria-describedby={
                              errors.serviceInterest
                                ? `${ids.serviceInterest}-err`
                                : undefined
                            }
                            className={`${fieldControlClass} cursor-pointer appearance-none pr-10`}
                          >
                            <option value="" disabled>
                              Bitte auswählen …
                            </option>
                            {serviceChoices.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </ContactField3D>
                    </motion.div>

                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.45 }}
                    >
                      <ContactField3D
                        id={ids.message}
                        label="Ihr Anliegen"
                        required
                        error={errors.message}
                        errorId={`${ids.message}-err`}
                      >
                        <textarea
                          id={ids.message}
                          name="message"
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          aria-invalid={errors.message ? "true" : "false"}
                          aria-describedby={
                            errors.message ? `${ids.message}-err` : undefined
                          }
                          className={`${fieldControlClass} min-h-[148px] resize-y`}
                          placeholder="Ziel, Zeitrahmen, Budget-Rahmen oder aktuelle Situation …"
                        />
                      </ContactField3D>
                    </motion.div>

                    <div className="flex flex-col gap-2">
                      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
                        <input
                          id={ids.privacy}
                          name="privacy"
                          type="checkbox"
                          checked={privacy}
                          onChange={(e) => setPrivacy(e.target.checked)}
                          aria-invalid={errors.privacy ? "true" : "false"}
                          aria-describedby={
                            errors.privacy ? `${ids.privacy}-err` : undefined
                          }
                          className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                        />
                        <span>
                          Ich habe die{" "}
                          <Link
                            href="/datenschutz"
                            className="font-medium text-[var(--foreground)] underline decoration-[var(--muted)] underline-offset-4 hover:decoration-[var(--accent)]"
                          >
                            Datenschutzhinweise
                          </Link>{" "}
                          zur Kenntnis genommen.{" "}
                          <span className="text-[var(--accent)]">*</span>
                        </span>
                      </label>
                      {errors.privacy ? (
                        <p
                          id={`${ids.privacy}-err`}
                          className="text-xs text-red-400/90"
                          role="alert"
                        >
                          {errors.privacy}
                        </p>
                      ) : null}
                    </div>

                    {serverError ? (
                      <p className="text-sm text-red-400/90" role="alert">
                        {serverError}
                      </p>
                    ) : null}

                    <motion.button
                      type="submit"
                      className="cta-shine group relative mt-1 inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-8 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border-strong))] hover:shadow-[0_0_36px_-12px_var(--accent-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:hover:translate-y-0 sm:w-fit"
                      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    >
                      Anfrage senden
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
