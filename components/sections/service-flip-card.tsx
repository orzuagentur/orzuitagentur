"use client";

import { useEffect, useId, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { CardStackVisual } from "@/components/sections/card-stack-visual";
import type { ServiceCard } from "@/lib/cms/types";

const FLIP_SPRING = {
  type: "spring" as const,
  stiffness: 76,
  damping: 26,
  mass: 1.1,
};

type ServiceFlipCardProps = {
  service: ServiceCard;
  accent: { glow: string; cta: string; border: string };
  isFlipped: boolean;
  onFlipChange: (flipped: boolean) => void;
};

function bodyParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function FlipBackContent({
  service,
  accent,
  backTitleId,
  paragraphs,
  technologies,
  highlights,
  onFlipChange,
}: {
  service: ServiceCard;
  accent: { glow: string; cta: string; border: string };
  backTitleId: string;
  paragraphs: string[];
  technologies: string[];
  highlights: string[];
  onFlipChange: (flipped: boolean) => void;
}) {
  const visitUrl = service.projectUrl?.trim() || null;

  return (
    <>
      <div className="portfolio-flip-back-head">
        <div>
          <p className="portfolio-flip-back-kicker">{service.category}</p>
          <h3 id={backTitleId} className="portfolio-flip-back-title">
            {service.title}
          </h3>
        </div>
        <button
          type="button"
          className="portfolio-flip-back-close"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFlipChange(false);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          aria-label="Zurück zur Vorderseite"
        >
          ←
        </button>
      </div>

      <div className="portfolio-flip-back-scroll">
        <section className="portfolio-flip-section">
          <h4 className="portfolio-flip-section-title">Leistung</h4>
          <div className="space-y-3">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="portfolio-flip-text">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {highlights.length > 0 ? (
          <section className="portfolio-flip-section">
            <h4 className="portfolio-flip-section-title">Schwerpunkte</h4>
            <ul className="portfolio-flip-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {technologies.length > 0 ? (
          <section className="portfolio-flip-section">
            <h4 className="portfolio-flip-section-title">Technologien</h4>
            <div className="portfolio-flip-tags">
              {technologies.map((tech) => (
                <span key={tech} className="portfolio-flip-tag">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="portfolio-flip-back-foot">
        {visitUrl ? (
          <a
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-flip-cta-primary portfolio-flip-cta-visit"
            style={{ borderColor: accent.border, color: accent.cta }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              window.open(visitUrl, "_blank", "noopener,noreferrer");
            }}
          >
            {service.ctaLabel?.trim() || "Besuchen"}
            <span aria-hidden>↗</span>
          </a>
        ) : (
          <a
            href="#kontakt"
            className="portfolio-flip-cta-primary portfolio-flip-cta-visit"
            style={{ borderColor: accent.border, color: accent.cta }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {service.ctaLabel?.trim() || "Projekt anfragen"}
          </a>
        )}
        <button
          type="button"
          className="portfolio-flip-cta-ghost"
          onClick={(e) => {
            e.stopPropagation();
            onFlipChange(false);
          }}
        >
          Zurück
        </button>
      </div>
    </>
  );
}

export function ServiceFlipCard({
  service,
  accent,
  isFlipped,
  onFlipChange,
}: ServiceFlipCardProps) {
  const reduced = useReducedMotion();
  const backTitleId = useId();
  const glowX = useMotionValue(38);
  const glowY = useMotionValue(36);
  const tiltX = useSpring(0, { stiffness: 120, damping: 32, mass: 1.2 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 32, mass: 1.2 });
  const lift = useSpring(0, { stiffness: 90, damping: 28, mass: 1.35 });

  const glowBg = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, ${accent.glow}, transparent 62%)`;

  const body = service.body ?? service.description;
  const technologies = service.technologies ?? [];
  const highlights = service.highlights ?? [];
  const paragraphs = bodyParagraphs(body);

  useEffect(() => {
    if (isFlipped) {
      tiltX.set(0);
      tiltY.set(0);
      lift.set(0);
    }
  }, [isFlipped, lift, tiltX, tiltY]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || isFlipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    glowX.set(px);
    glowY.set(py);
    tiltY.set((px - 50) * 0.08);
    tiltX.set(-(py - 50) * 0.05);
  };

  const resetTilt = () => {
    glowX.set(38);
    glowY.set(36);
    tiltX.set(0);
    tiltY.set(0);
    lift.set(0);
  };

  const backProps = {
    service,
    accent,
    backTitleId,
    paragraphs,
    technologies,
    highlights,
    onFlipChange,
  };

  if (reduced) {
    return (
      <div className="portfolio-flip-scene portfolio-flip-scene--reduced">
        {!isFlipped ? (
          <div className="portfolio-stack-card-inner">
            <CardStackVisual
              imageUrl={service.imageUrl}
            imageAlt={service.imageAlt}
              visualClass={service.visualClass}
              title={service.title}
              category={service.category}
              caseLabel="Leistung"
              badgeText={service.label}
              showWave={false}
            />
            <div className="portfolio-stack-body">
              <h3 className="portfolio-stack-title">{service.title}</h3>
              <p className="portfolio-stack-desc">{service.description}</p>
              <div className="portfolio-stack-footer">
                <button
                  type="button"
                  className="portfolio-flip-trigger"
                  style={{ "--card-cta": accent.cta } as CSSProperties}
                  onClick={() => onFlipChange(true)}
                >
                  Leistung ansehen
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="portfolio-stack-card-inner portfolio-flip-face--back">
            <FlipBackContent {...backProps} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`portfolio-flip-scene${isFlipped ? " is-flipped" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerEnter={() => {
        if (!isFlipped) lift.set(-4);
      }}
    >
      <motion.div
        className="portfolio-flip-inner"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={FLIP_SPRING}
      >
        <motion.div
          className="portfolio-flip-face portfolio-flip-face--back portfolio-stack-card-inner"
          aria-labelledby={backTitleId}
          role="region"
          aria-hidden={!isFlipped}
          inert={!isFlipped ? true : undefined}
          onPointerDown={isFlipped ? (e) => e.stopPropagation() : undefined}
          onClick={isFlipped ? (e) => e.stopPropagation() : undefined}
        >
          <FlipBackContent {...backProps} />
        </motion.div>

        <motion.div
          className="portfolio-flip-face portfolio-flip-face--front portfolio-stack-card-inner"
          inert={isFlipped ? true : undefined}
          style={{
            rotateX: isFlipped ? 0 : tiltX,
            rotateY: isFlipped ? 0 : tiltY,
            y: isFlipped ? 0 : lift,
            transformStyle: "preserve-3d",
          }}
        >
          <CardStackVisual
            imageUrl={service.imageUrl}
            imageAlt={service.imageAlt}
            visualClass={service.visualClass}
            title={service.title}
            category={service.category}
            caseLabel="Leistung"
            glowBg={glowBg}
          />

          <div className="portfolio-stack-body">
            <h3 className="portfolio-stack-title">{service.title}</h3>
            <p className="portfolio-stack-desc">{service.description}</p>
            <div className="portfolio-stack-footer">
              <button
                type="button"
                className="portfolio-flip-trigger"
                style={{ "--card-cta": accent.cta } as CSSProperties}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onFlipChange(true);
                }}
                aria-expanded={isFlipped}
                aria-controls={backTitleId}
              >
                Leistung ansehen
              </button>
              <span className="portfolio-stack-brand">OrzuIT</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
