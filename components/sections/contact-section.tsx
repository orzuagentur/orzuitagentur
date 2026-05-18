"use client";

import { submitLead } from "@/actions/submit-lead";
import type { ContactContent } from "@/lib/cms/types";
import Link from "next/link";
import { type FormEvent, useId, useMemo, useState, useTransition } from "react";

type FieldKey = "name" | "email" | "company" | "message" | "privacy";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(
  data: Record<FieldKey, string>,
  privacyChecked: boolean,
): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (name.length < 2) {
    errors.name = "Bitte geben Sie mindestens 2 Zeichen ein.";
  }
  if (!email) {
    errors.email = "E-Mail ist erforderlich.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
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

const fieldBaseClass =
  "w-full rounded-xl border bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition-[border-color,box-shadow] duration-300 outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] focus:shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_35%,transparent),0_0_24px_-10px_var(--accent-glow)]";

type ContactSectionProps = {
  contact: ContactContent;
};

export function ContactSection({ contact }: ContactSectionProps) {
  const baseId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const ids = useMemo(
    () => ({
      name: `${baseId}-name`,
      email: `${baseId}-email`,
      company: `${baseId}-company`,
      message: `${baseId}-message`,
      privacy: `${baseId}-privacy`,
    }),
    [baseId],
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(false);
    setServerError(null);
    const data: Record<FieldKey, string> = {
      name,
      email,
      company,
      message,
      privacy: privacy ? "1" : "",
    };
    const next = validate(data, privacy);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    startTransition(async () => {
      const result = await submitLead({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() ? company.trim() : undefined,
        message: message.trim(),
        privacyAccepted: true,
        source: "website",
      });

      if (result.ok) {
        setSubmitted(true);
      } else {
        setServerError(result.error);
      }
    });
  }

  function resetForm() {
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setPrivacy(false);
    setErrors({});
    setSubmitted(false);
    setServerError(null);
  }

  return (
    <section
      id="kontakt"
      aria-labelledby="contact-heading"
      className="home-section-deferred relative isolate overflow-hidden border-t border-[var(--border)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_80%_20%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[color-mix(in_oklab,var(--surface)_40%,black)] to-transparent"
      />
      <div className="contact-orb pointer-events-none absolute -bottom-32 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_20%,transparent),transparent_70%)] blur-3xl opacity-75" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {contact.privacyNote}
            </p>
          </div>

          <div className="contact-reveal contact-reveal-form lg:col-span-7">
            <div className="contact-panel rounded-2xl border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_88%,transparent)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_24px_80px_-48px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
              {submitted ? (
                <div
                  className="flex flex-col gap-4 py-2"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-lg font-semibold text-[var(--foreground)]">
                    {contact.successTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {contact.successBody}
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-medium text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                      {contact.email}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    className="inline-flex h-11 max-w-xs items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)] transition-[border-color,transform] duration-300 hover:border-[var(--border-strong)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:hover:translate-y-0"
                    onClick={resetForm}
                  >
                    Neue Nachricht
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={ids.name} className="text-sm font-medium text-[var(--foreground)]">
                        Name <span className="text-[var(--accent)]">*</span>
                      </label>
                      <input
                        id={ids.name}
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? `${ids.name}-err` : undefined}
                        className={`${fieldBaseClass} border-[var(--border)] ${errors.name ? "border-red-400/60" : ""}`}
                      />
                      {errors.name ? (
                        <p id={`${ids.name}-err`} className="text-xs text-red-400/90" role="alert">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={ids.email} className="text-sm font-medium text-[var(--foreground)]">
                        E-Mail <span className="text-[var(--accent)]">*</span>
                      </label>
                      <input
                        id={ids.email}
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? `${ids.email}-err` : undefined}
                        className={`${fieldBaseClass} border-[var(--border)] ${errors.email ? "border-red-400/60" : ""}`}
                      />
                      {errors.email ? (
                        <p id={`${ids.email}-err`} className="text-xs text-red-400/90" role="alert">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor={ids.company} className="text-sm font-medium text-[var(--foreground)]">
                      Unternehmen
                    </label>
                    <input
                      id={ids.company}
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`${fieldBaseClass} border-[var(--border)]`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor={ids.message} className="text-sm font-medium text-[var(--foreground)]">
                      Nachricht <span className="text-[var(--accent)]">*</span>
                    </label>
                    <textarea
                      id={ids.message}
                      name="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? `${ids.message}-err` : undefined}
                      className={`${fieldBaseClass} min-h-[140px] resize-y border-[var(--border)] ${errors.message ? "border-red-400/60" : ""}`}
                    />
                    {errors.message ? (
                      <p id={`${ids.message}-err`} className="text-xs text-red-400/90" role="alert">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
                      <input
                        id={ids.privacy}
                        name="privacy"
                        type="checkbox"
                        checked={privacy}
                        onChange={(e) => setPrivacy(e.target.checked)}
                        aria-invalid={errors.privacy ? "true" : "false"}
                        aria-describedby={errors.privacy ? `${ids.privacy}-err` : undefined}
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
                      <p id={`${ids.privacy}-err`} className="text-xs text-red-400/90" role="alert">
                        {errors.privacy}
                      </p>
                    ) : null}
                  </div>

                  {serverError ? (
                    <p className="text-sm text-red-400/90" role="alert">
                      {serverError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="cta-shine group relative mt-1 inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-8 text-sm font-semibold text-[var(--foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border-strong))] hover:shadow-[0_0_36px_-12px_var(--accent-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:hover:translate-y-0 sm:w-fit"
                  >
                    {isPending ? "Wird gesendet…" : "Anfrage senden"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
