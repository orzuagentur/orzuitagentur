"use client";

import { motion, useReducedMotion } from "framer-motion";

type GradientMeshProps = {
  className?: string;
};

export function GradientMesh({ className }: GradientMeshProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div aria-hidden className={className} />;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{
        backgroundPosition: ["0% 40%", "100% 60%", "50% 30%", "0% 40%"],
        opacity: [0.35, 0.55, 0.42, 0.35],
      }}
      transition={{
        duration: 22,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
