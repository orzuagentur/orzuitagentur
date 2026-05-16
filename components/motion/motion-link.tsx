"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { MouseEventHandler, ReactNode } from "react";

const MotionLink = motion.create(Link);

export type MotionNavLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  hoverLift?: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  scroll?: boolean;
  prefetch?: boolean;
};

export function MotionNavLink({
  href,
  className,
  hoverLift = 3,
  children,
  onClick,
  scroll,
  prefetch,
}: MotionNavLinkProps) {
  const reduce = useReducedMotion();

  return (
    <MotionLink
      href={href}
      className={className}
      prefetch={prefetch}
      scroll={scroll}
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -hoverLift }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {children}
    </MotionLink>
  );
}
