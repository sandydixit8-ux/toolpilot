"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface FloatingProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export function Floating({ children, className, amplitude = 10, duration = 6, delay = 0 }: FloatingProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} aria-hidden>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}