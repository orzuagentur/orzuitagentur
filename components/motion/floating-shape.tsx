"use client";

import { motion, useReducedMotion } from "framer-motion";

type FloatingShapeProps = {
  className?: string;
};

export function FloatingShape({ className }: FloatingShapeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div aria-hidden className={className} />;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{
        y: [0, -14, 0],
        rotate: [0, 3, 0],
      }}
      transition={{
        duration: 11,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
