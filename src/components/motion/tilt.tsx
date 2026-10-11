"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}

export function Tilt({ children, className, max = 6, scale = 1.02 }: TiltProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 26 });
  const sy = useSpring(py, { stiffness: 220, damping: 26 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      whileHover={{ scale }}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") handleMove(e);
      }}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}