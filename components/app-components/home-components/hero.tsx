import Image from "next/image";
import Link from "next/link";

import {
  SiGithub,
  SiLeetcode,
  SiX,
  SiDiscord,
  SiInstagram,
} from "react-icons/si";
import { FiMail, FiLinkedin, FiGlobe, FiDownload, FiExternalLink, FiArrowRight } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { heroConfig, siteConfig } from "@/lib/config";
import cachedData from "@/lib/generated/portfolio-data.json";
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

const HeroComponent = ({ metrics, leetCodeStats }: HeroComponentProps) => {
  const displayRole = metrics?.role || heroConfig.role;
  const displayBio = metrics?.bio || heroConfig.description;
  return (
    <section className="py-6 sm:py-10">
      <div className="relative mt-4">
        <div className="relative aspect-16/5 overflow-hidden rounded-2xl border bg-muted/60 shadow-xs">
          <Image
            src={heroConfig.media.src}
            alt={heroConfig.media.alt}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute -bottom-8 left-6">
          <div className="relative size-20 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md sm:size-24">
            <Image
              src={heroConfig.avatar.src}
              alt={heroConfig.avatar.alt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-14 space-y-4">
        {heroConfig.availability && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>{heroConfig.availability}</span>
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          {heroConfig.greeting}{" "}
          <span className="text-foreground underline decoration-primary/30 decoration-wavy decoration-1 underline-offset-4">
            {heroConfig.name}
          </span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          <strong className="font-semibold text-foreground">
            {displayRole}
          </strong>{" "}
          — {displayBio}
        </p>

        {/* Live Dynamic Status Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="rounded-xl border border-border bg-card/60 p-3.5 shadow-xs transition-colors hover:border-foreground/20">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Active Repositories
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              {metrics ? metrics.totalRepos : (siteConfig.github.repositoryCount ?? 4)}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Live GitHub sync
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 shadow-xs transition-colors hover:border-foreground/20">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Algorithmic Problems
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              {leetCodeStats ? `${leetCodeStats.totalSolved}+` : `${cachedData.leetcode?.totalSolved ?? 710}+`}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              LeetCode solved
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 shadow-xs transition-colors hover:border-foreground/20">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Core Languages
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground truncate block">
              {metrics && metrics.primaryLanguages.length > 0
                ? metrics.primaryLanguages.slice(0, 3).join(", ")
                : (siteConfig.statusCards?.coreLanguagesFallback ?? "C++, TypeScript")}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Systems & Web
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 shadow-xs transition-colors hover:border-foreground/20">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Architecture Focus
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground truncate block">
              {siteConfig.statusCards?.architectureFocus.title ?? "Distributed Tools"}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              {siteConfig.statusCards?.architectureFocus.subtitle ?? "Clean Architecture"}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons and social links row */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-2">
        {heroConfig.actions && heroConfig.actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {heroConfig.actions.map((act) => {
              const Icon =
                act.icon === "resume"
                  ? FiDownload
                  : act.icon === "arrow"
                  ? FiArrowRight
                  : act.external && !act.download
                  ? FiExternalLink
                  : null;

              return (
                <Button
                  key={act.label}
                  asChild
                  size="sm"
                  variant={act.variant ?? "default"}
                  className="text-xs font-medium cursor-pointer"
                >
                  <Link
                    href={act.href}
                    target={act.external ? "_blank" : undefined}
                    rel={act.external ? "noreferrer" : undefined}
                    download={typeof act.download === "string" ? act.download : act.download ? true : undefined}
                  >
                    {Icon ? <Icon className="mr-1.5 size-3.5" /> : null}
                    {act.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1">
          {heroConfig.socials.map((social) => {
            const Icon = socialIcons[social.platform] ?? FiGlobe;

            return (
              <Button
                key={social.platform}
                asChild
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground size-8"
              >
                <Link
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noreferrer" : undefined}
                  aria-label={social.label}
                  title={social.label}
                >
                  {Icon ? <Icon className="size-4" /> : null}
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