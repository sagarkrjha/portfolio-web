"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FiExternalLink, FiFolder, FiGlobe } from "react-icons/fi";
import { MotionCard } from "@/components/ui/motion-card";
import { Badge } from "@/components/ui/badge";

export interface ShowcaseCardProps {
  /** Main card heading */
  title: string;
  /** Primary link for clicking the title or card */
  href?: string;
  /** Subtitle or secondary tagline */
  subtitle?: string;
  /** Body description */
  description?: string;
  /** Badges / tech stack tags */
  tags?: string[];
  /** Visual header: custom image URL (screenshot or thumbnail) */
  imageUrl?: string;
  /** Fallback or custom icon for the header visual */
  icon?: IconType;
  /** Badge inside visual header (e.g., "LIVE", "SOURCE", "SYSTEMS") */
  headerBadge?: {
    text: string;
    variant?: "live" | "source" | "neutral";
  };
  /** Meta info displayed above title (e.g., date, read time) */
  meta?: React.ReactNode;
  /** Optional custom footer actions (buttons, star count, read-more link) */
  footer?: React.ReactNode;
  /** External link flag for new tab */
  external?: boolean;
  /** Custom gradient for the header banner */
  gradient?: string;
  /** Additional custom class names */
  className?: string;
}

export const ShowcaseCard = ({
  title,
  href,
  subtitle,
  description,
  tags = [],
  imageUrl,
  icon: IconComponent,
  headerBadge,
  meta,
  footer,
  external = false,
  gradient = "from-primary/15 via-card to-background",
  className = "",
}: ShowcaseCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(imageUrl && !imageError);

  const TitleWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!href) return <>{children}</>;
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="focus:outline-none hover:underline"
      >
        {children}
      </Link>
    );
  };

  return (
    <MotionCard
      className={`flex flex-col justify-between overflow-hidden p-0 group ${className}`}
    >
      {/* ─── Standardized Visual Header Banner ─── */}
      <div className="relative w-full aspect-video overflow-hidden border-b border-border/80 bg-muted/40 flex items-center justify-center select-none">
        {hasImage ? (
          <div className="relative w-full h-full overflow-hidden bg-card">
            {/* Smooth Placeholder underneath image while loading */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${
                imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-foreground">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary">
                  <FiGlobe className="size-5 animate-pulse" />
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground font-semibold">
                  Loading Preview...
                </span>
              </div>
            </div>

            {/* High-Res Image Screenshot */}
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`relative z-10 w-full h-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Hover overlay if actionable */}
            {href && (
              <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="absolute inset-0 z-20 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 text-xs font-mono font-medium text-foreground"
              >
                <span>{external ? "Visit Link" : "View Details"}</span>
                <FiExternalLink className="size-3 text-primary" />
              </Link>
            )}
          </div>
        ) : (
          /* Standardized Themed Placeholder Artwork */
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center relative p-4 overflow-hidden`}
          >
            {/* Subtle architectural tech grid */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Centered Graphic Emblem */}
            <div className="relative flex flex-col items-center gap-2 text-foreground group-hover:scale-105 transition-transform duration-300">
              {IconComponent && (
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/25 shadow-sm text-primary">
                  <IconComponent className="size-6" />
                </div>
              )}
              {headerBadge?.text && (
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground font-semibold">
                  {headerBadge.text}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top-Right Header Status Tag */}
        {headerBadge && (
          <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
            {headerBadge.variant === "live" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 backdrop-blur-md border border-border text-[10px] font-mono font-semibold text-primary shadow-xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            ) : headerBadge.variant === "source" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/90 backdrop-blur-md border border-border text-[10px] font-mono text-muted-foreground shadow-xs">
                <FiFolder className="size-2.5 text-primary" />
                SOURCE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/90 backdrop-blur-md border border-border text-[10px] font-mono text-muted-foreground shadow-xs">
                {headerBadge.text}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ─── Standardized Content Body ─── */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Optional Meta Row */}
          {meta && <div className="mb-2">{meta}</div>}

          {/* Title & Subtitle */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
            <TitleWrapper>{title}</TitleWrapper>
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs font-mono text-muted-foreground font-medium">
              {subtitle}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
        </div>

        {/* Tags List */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[11px] font-mono py-0 text-muted-foreground group-hover:border-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* ─── Standardized Footer Row ─── */}
        {footer && (
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
            {footer}
          </div>
        )}
      </div>
    </MotionCard>
  );
};

export default ShowcaseCard;
