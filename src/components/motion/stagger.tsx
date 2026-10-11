"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface StaggerProps {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
}

export function Stagger({ children, className, step = 0.07, delay = 0 }: StaggerProps) {
  const reduce = useReducedMotion();
  const container: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: {
          transition: { staggerChildren: step, delayChildren: delay },
        },
      };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const item: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EASE },
        },
      };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}