"use client";

import { motion, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { CardStackImage } from "@/components/sections/card-stack-image";

type CardStackVisualProps = {
  imageUrl?: string | null;
  imageAlt?: string | null;
  visualClass: string;
  title: string;
  category: string;
  caseLabel?: string;
  badgeText?: string;
  glowBg?: MotionValue<string> | string;
  showWave?: boolean;
  slimIcon?: ReactNode;
  className?: string;
};

export function CardStackVisual({
  imageUrl,
  imageAlt,
  visualClass,
  title,
  category,
  caseLabel = "Case Study",
  badgeText,
  glowBg,
  showWave = true,
  slimIcon,
  className = "",
}: CardStackVisualProps) {
  const imageSrc = imageUrl?.trim() || null;
  const hasImage = Boolean(imageSrc);
  const badge = badgeText ?? category;

  return (
    <motion.div
      className={`portfolio-stack-visual ${visualClass}${hasImage ? " has-image" : ""} ${className}`.trim()}
    >
      {glowBg ? (
        <motion.div
          aria-hidden
          className="portfolio-stack-glow"
          style={typeof glowBg === "string" ? { background: glowBg } : { background: glowBg }}
        />
      ) : null}

      {hasImage && imageSrc ? (
        <CardStackImage src={imageSrc} alt={imageAlt?.trim() || title} />
      ) : (
        <>
          <span className="portfolio-visual-grid" aria-hidden />
          {showWave ? <span className="portfolio-stack-wave" aria-hidden /> : null}
        </>
      )}

      <span className="portfolio-stack-visual-shade" aria-hidden />

      {slimIcon ? (
        slimIcon
      ) : (
        <>
          <span className="portfolio-stack-badge">{badge}</span>
          <span className="portfolio-stack-case-label">{caseLabel}</span>
        </>
      )}
    </motion.div>
  );
}
