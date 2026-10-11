"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className = "" }: AnimatedGradientTextProps) {
  const reduce = useReducedMotion();
  return (
    <span className={`text-gradient ${reduce ? "" : "gradient-animate"} ${className}`}>
      {children}
    </span>
  );
}