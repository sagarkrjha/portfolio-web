"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface MotionCardProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  enableSpotlight?: boolean;
}

export const MotionCard = ({
  children,
  className,
  enableTilt = false,
  enableSpotlight = true,
  ...props
}: MotionCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      rotateX.set(((y - centerY) / centerY) * -3.5);
      rotateY.set(((x - centerX) / centerX) * 3.5);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (enableTilt) {
      rotateX.set(0);
      rotateY.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "group relative flex flex-col justify-between rounded-none border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-colors hover:border-primary/50 overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Dynamic Aurora Spotlight Glow on Cursor Hover */}
      {enableSpotlight && (
        <div
          className="pointer-events-none absolute -inset-px rounded-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${mouseX.get()}px ${mouseY.get()}px, var(--color-primary, #34d399) 0%, transparent 70%)`,
            opacity: isHovered ? 0.08 : 0,
          }}
        />
      )}

      {/* Top accent glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {children}
    </motion.div>
  );
};

export default MotionCard;
