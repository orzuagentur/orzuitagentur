"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * GPU-freundliche Tiefen-Landschaft ohne WebGL: nur Transform/Opacity,
 * Parallax via Scroll — bei reduced motion statische Variante.
 */
export function DepthExperience() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const yFar = useTransform(scrollY, [0, 1200], [0, -60]);
  const yMid = useTransform(scrollY, [0, 1200], [0, 35]);
  const yNear = useTransform(scrollY, [0, 1200], [0, -25]);

  const yFarS = useSpring(yFar, { stiffness: 70, damping: 28, mass: 0.4 });
  const yMidS = useSpring(yMid, { stiffness: 80, damping: 30, mass: 0.35 });
  const yNearS = useSpring(yNear, { stiffness: 90, damping: 32, mass: 0.3 });

  if (reduce) {
    return (
      <div
        className="experience-root pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="experience-layer experience-parallax-layer absolute -left-[15%] top-[12%] h-[min(75vw,640px)] w-[min(75vw,640px)] rounded-full bg-[radial-gradient(circle_at_35%_35%,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_68%)] blur-3xl opacity-75" />
        <div className="experience-layer experience-parallax-layer absolute -right-[10%] bottom-[5%] h-[min(70vw,560px)] w-[min(70vw,560px)] rounded-full bg-[radial-gradient(circle_at_65%_55%,color-mix(in_oklab,var(--accent-2)_28%,transparent),transparent_68%)] blur-3xl opacity-70" />
        <div className="experience-light-sweep pointer-events-none absolute inset-0 opacity-[0.22]" />
        <div className="experience-depth-grid pointer-events-none absolute inset-0 translate-z-gpu opacity-[0.18]" />
        <div className="experience-vignette pointer-events-none absolute inset-0" />
      </div>
    );
  }

  return (
    <div
      className="experience-root pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        style={{ y: yFarS }}
        className="experience-layer experience-parallax-layer absolute -left-[15%] top-[12%] h-[min(75vw,640px)] w-[min(75vw,640px)] rounded-full bg-[radial-gradient(circle_at_35%_35%,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_68%)] blur-3xl opacity-75 will-change-transform"
      />
      <motion.div
        style={{ y: yMidS }}
        className="experience-layer experience-parallax-layer absolute -right-[10%] bottom-[5%] h-[min(70vw,560px)] w-[min(70vw,560px)] rounded-full bg-[radial-gradient(circle_at_65%_55%,color-mix(in_oklab,var(--accent-2)_28%,transparent),transparent_68%)] blur-3xl opacity-70 will-change-transform"
      />
      <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2">
        <motion.div
          style={{ y: yNearS }}
          className="experience-layer experience-parallax-layer h-[280px] w-[min(92vw,480px)] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,white_8%,transparent)_0%,transparent_65%)] blur-2xl opacity-50 will-change-transform"
        />
      </div>

      <div className="experience-light-sweep pointer-events-none absolute inset-0 opacity-[0.28]" />

      <div className="experience-depth-grid pointer-events-none absolute inset-0 translate-z-gpu opacity-[0.18]" />

      <div className="experience-vignette pointer-events-none absolute inset-0" />
    </div>
  );
}
