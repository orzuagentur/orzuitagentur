"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

type StaggerTag = "div" | "ul";

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
  as?: StaggerTag;
};

export function MotionStagger({ children, className, as = "div" }: MotionStaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as === "ul" ? "ul" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "ul" ? motion.ul : motion.div;

  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

type ItemTag = "div" | "li";

type MotionStaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: ItemTag;
};

export function MotionStaggerItem({ children, className, as = "div" }: MotionStaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as === "li" ? "li" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag className={className} variants={staggerItem}>
      {children}
    </MotionTag>
  );
}
