"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";
import { PortfolioFlipCard } from "@/components/sections/portfolio-flip-card";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { PortfolioCard } from "@/lib/cms/types";

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

/** Soft landing, quick travel — overdamped spring, short fades. */
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

/** Cards in the right stack (excluding the featured card on the left). */
const RIGHT_STACK_COUNT = 4;

const HIDDEN_OFFSET = 99;

/** 0 = featured, 1-4 = right stack, 99 = hidden */
function stackOffset(index: number, active: number, count: number) {
  const forward = (index - active + count) % count;
  if (forward === 0) return 0;
  if (forward >= 1 && forward <= RIGHT_STACK_COUNT) return forward;
  return HIDDEN_OFFSET;
}

function stackTransform(offset: number, reduced: boolean) {
  if (reduced) {
    return {
      x: 0,
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
          ? "calc(var(--portfolio-card-w) * -1.05)"
          : "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 3.5)",
      y: 0,
      z: -88,
      scale: 0.86,
      rotateY: -10,
      opacity: 0,
      zIndex: 5,
      filter: "blur(0px)",
    };
  }

  if (offset === -1) {
    return {
      x: "calc(var(--portfolio-card-w) * -0.88)",
      y: 0,
      z: 20,
      scale: 0.98,
      rotateY: 2,
      opacity: 0,
      zIndex: 60,
      filter: "blur(2px)",
    };
  }

  if (offset === 0) {
    return {
      x: 0,
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
      x: "var(--portfolio-stack-anchor)",
      y: 0,
      z: -26,
      scale: 0.97,
      rotateY: -7,
      opacity: 1,
      zIndex: 42,
      filter: "blur(0px)",
    };
  }

  if (offset === 2) {
    return {
      x: "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset))",
      y: 0,
      z: -46,
      scale: 0.94,
      rotateY: -9,
      opacity: 1,
      zIndex: 34,
      filter: "blur(0px)",
    };
  }

  if (offset === 3) {
    return {
      x: "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek))",
      y: 0,
      z: -62,
      scale: 0.91,
      rotateY: -10,
      opacity: 1,
      zIndex: 28,
      filter: "blur(0px)",
    };
  }

  return {
    x: "calc(var(--portfolio-stack-anchor) + var(--portfolio-stack-inset) + var(--portfolio-stack-peek) * 2)",
    y: 0,
    z: -76,
    scale: 0.88,
    rotateY: -11,
    opacity: 1,
    zIndex: 20,
    filter: "blur(0px)",
  };
}

type PortfolioCarouselProps = {
  projects: PortfolioCard[];
};

export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const count = projects.length;

  const changeActive = useCallback((next: number) => {
    setIsFlipped(false);
    setActive(next);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIsFlipped(false);
      setActive((i) => (i + dir + count) % count);
    },
    [count],
  );

  if (count === 0) return null;

  return (
    <div className="portfolio-showcase">
      <div
        className="portfolio-showcase-stage"
        style={{
          perspective: reduced ? undefined : "2400px",
          perspectiveOrigin: reduced ? undefined : "20% 50%",
        }}
      >
        <div
          aria-hidden
          className="portfolio-showcase-ambient portfolio-showcase-ambient--cyan"
        />
        <div
          aria-hidden
          className="portfolio-showcase-ambient portfolio-showcase-ambient--violet"
        />

        <div className="portfolio-showcase-track">
          {projects.map((project, index) => {
            const offset = stackOffset(index, active, count);
            const tf = stackTransform(offset, !!reduced);
            const accent =
              ACCENT_BY_VISUAL[project.visualClass] ??
              ACCENT_BY_VISUAL["portfolio-visual-finsight"];

            return (
              <PortfolioStackCard
                key={project.key}
                project={project}
                offset={offset}
                transform={tf}
                accent={accent}
                reduced={!!reduced}
                isFlipped={isFlipped}
                onFlipChange={setIsFlipped}
                onActivate={() => changeActive(index)}
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
          aria-label="Vorheriges Projekt"
        >
          <span aria-hidden>←</span>
        </button>

        <div className="portfolio-showcase-dots" role="tablist" aria-label="Portfolio">
          {projects.map((p, i) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Projekt ${i + 1}: ${p.title}`}
              className={`portfolio-showcase-dot${i === active ? " is-active" : ""}`}
              onClick={() => changeActive(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="portfolio-showcase-arrow"
          onClick={() => go(1)}
          aria-label="Nächstes Projekt"
        >
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

type StackCardProps = {
  project: PortfolioCard;
  offset: number;
  transform: ReturnType<typeof stackTransform>;
  accent: { glow: string; cta: string; border: string };
  reduced: boolean;
  isFlipped: boolean;
  onFlipChange: (flipped: boolean) => void;
  onActivate: () => void;
};

function PortfolioStackCard({
  project,
  transform,
  accent,
  offset,
  reduced,
  isFlipped,
  onFlipChange,
  onActivate,
}: StackCardProps) {
  const isFeatured = offset === 0;
  const isPreview = offset === 1 && !reduced;
  const isSlim = offset >= 2 && offset <= RIGHT_STACK_COUNT && !reduced;
  const stackIcon =
    STACK_ICON[project.visualClass] ?? STACK_ICON["portfolio-visual-finsight"];
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
        <PortfolioFlipCard
          project={project}
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
          <div className={`portfolio-stack-visual ${project.visualClass}`}>
          <span className="portfolio-visual-grid" aria-hidden />
          <span className="portfolio-stack-wave" aria-hidden />
          <span className="portfolio-stack-visual-shade" aria-hidden />
          {isSlim ? (
            <span className="portfolio-stack-icon" aria-hidden>
              {stackIcon}
            </span>
          ) : (
            <span className="portfolio-stack-badge">{project.category}</span>
          )}
        </div>

          {isPreview ? (
            <div className="portfolio-stack-body portfolio-stack-body--preview">
              <h3 className="portfolio-stack-title portfolio-stack-title--preview">
                {project.title}
              </h3>
            </div>
          ) : null}
        </motion.div>
      )}
    </motion.article>
  );
}
