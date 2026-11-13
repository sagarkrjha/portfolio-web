"use client";

import Image from "next/image";
import Link from "next/link";
import { SiGithub, SiLeetcode, SiX, SiDiscord, SiInstagram } from "react-icons/si";
import {
  FiMail,
  FiLinkedin,
  FiGlobe,
  FiDownload,
  FiArrowRight,
  FiTerminal,
  FiCpu,
  FiLayers,
  FiGitBranch,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroConfig, siteConfig } from "@/lib/config";
import type { DynamicProfileMetrics } from "@/lib/services/github";
import type { LeetCodeStats } from "@/lib/services/leetcode";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: SiGithub,
  leetcode: SiLeetcode,
  linkedin: FiLinkedin,
  twitter: SiX,
  discord: SiDiscord,
  email: FiMail,
  instagram: SiInstagram,
};

interface HeroComponentProps {
  metrics?: DynamicProfileMetrics;
  leetCodeStats?: LeetCodeStats | null;
}

export const HeroComponent = ({ metrics, leetCodeStats }: HeroComponentProps) => {
  const displayRole = metrics?.role || heroConfig.role;
  const displayBio = metrics?.bio || heroConfig.description;

  return (
    <section className="py-6 sm:py-10 space-y-8">
      {/* ─── Architectural Cover & Avatar Canvas ─── */}
      <div className="relative">
        <div className="relative aspect-16/5 overflow-hidden rounded-none border border-border/80 bg-muted/60 shadow-xs">
          <Image
            src={heroConfig.media.src}
            alt={heroConfig.media.alt}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
        </div>

        {/* Profile Avatar with Sharp Brutalist Border */}
        <div className="absolute -bottom-7 sm:-bottom-8 left-5 sm:left-6">
          <div className="relative size-20 sm:size-24 overflow-hidden rounded-none border-2 border-background bg-muted shadow-md">
            <Image
              src={heroConfig.avatar.src}
              alt={heroConfig.avatar.alt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* ─── Profile Details & Concise One-Liner Description ─── */}
      <div className="pt-2 space-y-4">
        {/* Availability Badge */}
        {heroConfig.availability && (
          <div className="inline-flex items-center gap-2 rounded-none border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono font-medium text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span>{heroConfig.availability}</span>
          </div>
        )}

        {/* Name and Designation */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-sans">
            {heroConfig.name}
          </h1>
          <p className="text-sm sm:text-base font-mono font-semibold text-primary">
            {displayRole}
          </p>
        </div>

        {/* Crisp One-Liner Professional Description */}
        <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground font-sans">
          {displayBio}
        </p>

        {/* ─── Redesigned Metrics Grid (Rounded-none, Architectural) ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          <div className="group rounded-none border border-border/80 bg-card p-3.5 shadow-xs transition-all duration-200 hover:border-primary/50">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">Repositories</span>
              <FiGitBranch className="size-3.5 text-primary" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {metrics ? metrics.totalRepos : (siteConfig.github.repositoryCount ?? 9)}
            </div>
            <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
              GitHub Sync
            </span>
          </div>

          <div className="group rounded-none border border-border/80 bg-card p-3.5 shadow-xs transition-all duration-200 hover:border-primary/50">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">Systems</span>
              <FiCpu className="size-3.5 text-primary" />
            </div>
            <div className="text-sm font-semibold tracking-tight text-foreground truncate">
              C++20 &middot; Rust
            </div>
            <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
              Storage &amp; CAS
            </span>
          </div>

          <div className="group rounded-none border border-border/80 bg-card p-3.5 shadow-xs transition-all duration-200 hover:border-primary/50">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">Full-Stack</span>
              <FiLayers className="size-3.5 text-primary" />
            </div>
            <div className="text-sm font-semibold tracking-tight text-foreground truncate">
              TypeScript &middot; React
            </div>
            <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
              Web &amp; Electron
            </span>
          </div>

          <div className="group rounded-none border border-border/80 bg-card p-3.5 shadow-xs transition-all duration-200 hover:border-primary/50">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">LeetCode</span>
              <SiLeetcode className="size-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              2382
            </div>
            <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
              Guardian &middot; Top 0.36%
            </span>
          </div>
        </div>
      </div>

      {/* ─── Actions & Social Links Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            asChild
            size="sm"
            variant="default"
            className="text-xs font-mono font-medium rounded-none cursor-pointer"
          >
            <Link href="/projects">
              Explore Projects
              <FiArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="text-xs font-mono font-medium rounded-none cursor-pointer hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Link href="/resume">
              <FiDownload className="mr-1.5 size-3.5" />
              View Resume
            </Link>
          </Button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-1">
          {heroConfig.socials.map((social) => {
            const Icon = socialIcons[social.platform] ?? FiGlobe;

            return (
              <Button
                key={social.platform}
                asChild
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground size-8 rounded-none"
              >
                <Link
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noreferrer" : undefined}
                  aria-label={social.label}
                  title={social.label}
                >
                  <Icon className="size-4" />
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
