"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** stagger delay in seconds */
  delay?: number;
  /** vertical travel in px */
  y?: number;
} & Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "transition" | "ref">;

// Subtle "rise-in on scroll" used for below-the-fold sections. Reduced-motion
// renders static; the global <noscript> rule keeps it visible without JS.
export function Reveal({ children, className, delay = 0, y = 20, ...rest }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("reveal-on-scroll", className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
