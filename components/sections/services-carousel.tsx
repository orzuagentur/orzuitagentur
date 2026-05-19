"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ServiceFlipCard } from "@/components/sections/service-flip-card";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { ServiceCard } from "@/lib/cms/types";

const STACK_ICON: Record<string, string> = {
  "portfolio-visual-finsight": "◈",
  "portfolio-visual-velo": "◎",
  "portfolio-visual-aura": "◇",
  "portfolio-visual-nexus": "⬡",
  "portfolio-visual-vault": "⊡",
  "portfolio-visual-pulse": "◫",
};

const ACCENT_BY_VISUAL: Record<string, { glow: string; cta: string; border: string }> =
  {
    "portfolio-visual-finsight": {
      glow: "rgba(34, 211, 238, 0.48)",
      cta: "var(--accent)",
      border: "rgba(34, 211, 238, 0.55)",
    },
    "portfolio-visual-velo": {
      glow: "rgba(168, 85, 247, 0.45)",
      cta: "var(--accent-2)",
      border: "rgba(168, 85, 247, 0.5)",
    },
    "portfolio-visual-aura": {
      glow: "rgba(129, 140, 248, 0.4)",
      cta: "color-mix(in oklab, var(--accent) 50%, var(--accent-2))",
      border: "rgba(129, 140, 248, 0.45)",
    },
    "portfolio-visual-nexus": {
      glow: "rgba(52, 211, 153, 0.38)",
      cta: "#34d399",
      border: "rgba(52, 211, 153, 0.48)",
    },
    "portfolio-visual-vault": {
      glow: "rgba(251, 191, 36, 0.35)",
      cta: "#fbbf24",
      border: "rgba(251, 191, 36, 0.45)",
    },
    "portfolio-visual-pulse": {
      glow: "rgba(244, 114, 182, 0.38)",
      cta: "#f472b6",
      border: "rgba(244, 114, 182, 0.45)",
    },
  };

const EASE_SOFT = [0.25, 1, 0.4, 1] as const;

const SPRING_LAYOUT = {
  type: "spring" as const,
  stiffness: 82,
  damping: 30,
  mass: 1.2,
  restDelta: 0.001,
  restSpeed: 0.012,
};

function stackTransition(offset: number, reduced: boolean) {
  if (reduced) {
    return { duration: 0.28, ease: EASE_SOFT };
  }

  const depth = Math.min(Math.abs(offset), 4);
  const delay = depth * 0.02;

  return {
    x: { ...SPRING_LAYOUT, delay },
    y: { ...SPRING_LAYOUT, delay },
    z: { ...SPRING_LAYOUT, delay },
    scale: { ...SPRING_LAYOUT, delay },
    rotateY: { ...SPRING_LAYOUT, stiffness: 68, damping: 28, delay },
    opacity: { duration: 0.48, ease: EASE_SOFT, delay: delay * 0.45 },
    filter: { duration: 0.4, ease: EASE_SOFT, delay: delay * 0.35 },
  };
}

/** Cards in the left stack (featured card sits on the right). */
const LEFT_STACK_COUNT = 4;

const HIDDEN_OFFSET = 99;

/** 0 = featured right, 1–4 = left stack, -1 = exit right, 99 = hidden */
function stackOffset(index: number, active: number, count: number) {
  const forward = (index - active + count) % count;
  if (forward === 0) return 0;
  if (forward >= 1 && forward <= LEFT_STACK_COUNT) return forward;
  const prev = (active - 1 + count) % count;
  if (index === prev) return -1;
  return HIDDEN_OFFSET;
}

/** Same total width as portfolio; featured right edge = end of the slim stack. */
const FEATURED_X =
  "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 + var(--portfolio-preview-w) - var(--portfolio-card-w))";

/** Preview left of featured — portfolio `stack-gap`, plus nudge for the stack fan. */
const STACK_1_X =
  "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 - var(--portfolio-card-w) - var(--portfolio-stack-gap) - var(--portfolio-preview-w) + var(--services-stack-nudge, 0px))";

const STACK_2_X =
  "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 - var(--portfolio-card-w) - var(--portfolio-stack-gap) - var(--portfolio-preview-w) - var(--portfolio-stack-inset) + var(--services-stack-nudge, 0px))";

const STACK_3_X =
  "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 - var(--portfolio-card-w) - var(--portfolio-stack-gap) - var(--portfolio-preview-w) - var(--portfolio-stack-inset) - var(--portfolio-stack-peek) + var(--services-stack-nudge, 0px))";

const STACK_4_X =
  "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 - var(--portfolio-card-w) - var(--portfolio-stack-gap) - var(--portfolio-preview-w) - var(--portfolio-stack-inset) - var(--portfolio-stack-peek) * 2 + var(--services-stack-nudge, 0px))";

/**
 * Main card right; offsets 1–4 step left (preview + slim stack), same peek/inset as portfolio.
 */
function stackTransform(offset: number, reduced: boolean) {
  if (reduced) {
    return {
      x: offset === 0 ? FEATURED_X : 0,
      y: 0,
      z: 0,
      scale: offset === 0 ? 1 : 0.96,
      rotateY: 0,
      opacity: offset === 0 ? 1 : 0,
      zIndex: 50 - offset,
      filter: "blur(0px)",
    };
  }

  if (offset <= -2 || offset >= 5 || offset === HIDDEN_OFFSET) {
    return {
      x:
        offset < 0
          ? "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 + var(--portfolio-preview-w) + var(--portfolio-stack-gap) * 0.35)"
          : "calc(var(--portfolio-card-w) * -1.05)",
      y: 0,
      z: -88,
      scale: 0.86,
      rotateY: offset < 0 ? -10 : 10,
      opacity: 0,
      zIndex: 5,
      filter: "blur(0px)",
    };
  }

  if (offset === -1) {
    return {
      x: "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2 + var(--portfolio-preview-w) + var(--portfolio-stack-gap) * 0.35)",
      y: 0,
      z: 20,
      scale: 0.98,
      rotateY: -2,
      opacity: 0,
      zIndex: 60,
      filter: "blur(2px)",
    };
  }

  if (offset === 0) {
    return {
      x: FEATURED_X,
      y: 0,
      z: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
      zIndex: 50,
      filter: "blur(0px)",
    };
  }

  if (offset === 1) {
    return {
      x: STACK_1_X,
      y: 0,
      z: -26,
      scale: 0.97,
      rotateY: 7,
      opacity: 1,
      zIndex: 42,
      filter: "blur(0px)",
    };
  }

  if (offset === 2) {
    return {
      x: STACK_2_X,
      y: 0,
      z: -46,
      scale: 0.94,
      rotateY: 9,
      opacity: 1,
      zIndex: 34,
      filter: "blur(0px)",
    };
  }

  if (offset === 3) {
    return {
      x: STACK_3_X,
      y: 0,
      z: -62,
      scale: 0.91,
      rotateY: 10,
      opacity: 1,
      zIndex: 28,
      filter: "blur(0px)",
    };
  }

  return {
    x: STACK_4_X,
    y: 0,
    z: -76,
    scale: 0.88,
    rotateY: 11,
    opacity: 1,
    zIndex: 20,
    filter: "blur(0px)",
  };
}

type ServicesCarouselProps = {
  services: ServiceCard[];
};

export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const count = services.length;

  useEffect(() => {
    setIsFlipped(false);
  }, [active]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + count) % count);
    },
    [count],
  );

  if (count === 0) return null;

  return (
    <div className="portfolio-showcase services-showcase">
      <div
        className="portfolio-showcase-stage"
        style={{
          perspective: reduced ? undefined : "2400px",
          perspectiveOrigin: reduced ? undefined : "20% 50%",
        }}
      >
        <div
          aria-hidden
          className="portfolio-showcase-ambient portfolio-showcase-ambient--cyan services-showcase-ambient--cyan"
        />
        <div
          aria-hidden
          className="portfolio-showcase-ambient portfolio-showcase-ambient--violet services-showcase-ambient--violet"
        />

        <div className="portfolio-showcase-track portfolio-showcase-track--mirror">
          {services.map((service, index) => {
            const offset = stackOffset(index, active, count);
            const tf = stackTransform(offset, !!reduced);
            const accent =
              ACCENT_BY_VISUAL[service.visualClass] ??
              ACCENT_BY_VISUAL["portfolio-visual-finsight"];

            return (
              <ServiceStackCard
                key={service.key}
                service={service}
                offset={offset}
                transform={tf}
                accent={accent}
                isFront={offset === 0}
                reduced={!!reduced}
                isFlipped={isFlipped}
                onFlipChange={setIsFlipped}
                onActivate={() => setActive(index)}
              />
            );
          })}
        </div>
      </div>

      <div className="portfolio-showcase-nav">
        <button
          type="button"
          className="portfolio-showcase-arrow"
          onClick={() => go(-1)}
          aria-label="Vorherige Leistung"
        >
          <span aria-hidden>←</span>
        </button>

        <div className="portfolio-showcase-dots" role="tablist" aria-label="Leistungen">
          {services.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Leistung ${i + 1}: ${s.title}`}
              className={`portfolio-showcase-dot${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="portfolio-showcase-arrow"
          onClick={() => go(1)}
          aria-label="Nächste Leistung"
        >
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

type StackCardProps = {
  service: ServiceCard;
  offset: number;
  transform: ReturnType<typeof stackTransform>;
  accent: { glow: string; cta: string; border: string };
  isFront: boolean;
  reduced: boolean;
  isFlipped: boolean;
  onFlipChange: (flipped: boolean) => void;
  onActivate: () => void;
};

function ServiceStackCard({
  service,
  transform,
  accent,
  isFront,
  offset,
  reduced,
  isFlipped,
  onFlipChange,
  onActivate,
}: StackCardProps) {
  const isFeatured = offset === 0;
  const isPreview = offset === 1 && !reduced;
  const isSlim = offset >= 2 && offset <= LEFT_STACK_COUNT && !reduced;
  const stackIcon =
    STACK_ICON[service.visualClass] ?? STACK_ICON["portfolio-visual-finsight"];
  const cardRef = useRef<HTMLElement>(null);
  const tiltX = useSpring(0, { stiffness: 120, damping: 32, mass: 1.2 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 32, mass: 1.2 });
  const lift = useSpring(0, { stiffness: 90, damping: 28, mass: 1.35 });

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || isFeatured || isFlipped) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    tiltY.set((px - 50) * 0.08);
    tiltX.set(-(py - 50) * 0.05);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    lift.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      layout={false}
      className={[
        "portfolio-stack-card",
        isFeatured ? "is-active is-featured" : "",
        isPreview ? "is-next is-preview" : "",
        isSlim ? `is-deep is-slim is-slim-${offset}` : "",
        isFeatured && isFlipped ? "is-card-flipped" : "",
        offset < 0 ? "is-exiting" : "",
      ].join(" ")}
      style={{
        zIndex: transform.zIndex,
        pointerEvents: isFeatured || isPreview ? "auto" : "none",
        ["--card-accent-border" as string]: accent.border,
      }}
      initial={false}
      animate={{
        x: transform.x,
        y: transform.y,
        z: transform.z,
        scale: transform.scale,
        rotateY: transform.rotateY,
        opacity: transform.opacity,
        filter: transform.filter,
      }}
      transition={stackTransition(offset, reduced)}
      onClick={(e) => {
        if (isFeatured && isFlipped) {
          e.stopPropagation();
          return;
        }
        if (!isFeatured && !isFlipped) onActivate();
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerEnter={() => {
        if (!isFeatured && !reduced) lift.set(-4);
      }}
    >
      {isFeatured ? (
        <ServiceFlipCard
          service={service}
          accent={accent}
          isFlipped={isFlipped}
          onFlipChange={onFlipChange}
        />
      ) : (
        <motion.div
          className="portfolio-stack-card-inner"
          style={
            reduced
              ? undefined
              : {
                  rotateX: tiltX,
                  rotateY: tiltY,
                  y: lift,
                  transformStyle: "preserve-3d",
                }
          }
        >
          <div className={`portfolio-stack-visual ${service.visualClass}`}>
            <span className="portfolio-visual-grid" aria-hidden />
            <span className="portfolio-stack-wave" aria-hidden />
            <span className="portfolio-stack-visual-shade" aria-hidden />
            {isSlim ? (
              <span className="portfolio-stack-icon" aria-hidden>
                {stackIcon}
              </span>
            ) : (
              <span className="portfolio-stack-badge">{service.category}</span>
            )}
          </div>

          {isPreview ? (
            <div className="portfolio-stack-body portfolio-stack-body--preview">
              <h3 className="portfolio-stack-title portfolio-stack-title--preview">
                {service.title}
              </h3>
            </div>
          ) : null}
        </motion.div>
      )}
    </motion.article>
  );
}
