"use client";

import Link from "next/link";
import {
  FiCode,
  FiBriefcase,
  FiMail,
  FiLinkedin,
  FiCpu,
  FiDatabase,
  FiTerminal,
  FiLayers,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { SiGithub, SiLeetcode, SiX, SiDiscord, SiInstagram } from "react-icons/si";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/motion-card";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { siteConfig, aboutConfig } from "@/lib/config";
import type { DynamicProfileMetrics } from "@/lib/services/github";

interface AboutViewProps {
  metrics: DynamicProfileMetrics;
}

const getFocusArtwork = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("systems")) {
    return {
      icon: FiCpu,
      tag: "SYSTEMS ARCHITECTURE",
      gradient: "from-primary/15 via-card to-background",
    };
  }
  if (lower.includes("storage") || lower.includes("tools")) {
    return {
      icon: FiDatabase,
      tag: "STORAGE & CAS",
      gradient: "from-emerald-500/10 via-card to-background",
    };
  }
  if (lower.includes("stack") || lower.includes("architecture")) {
    return {
      icon: FiLayers,
      tag: "FULL-STACK ECOSYSTEM",
      gradient: "from-cyan-500/10 via-card to-background",
    };
  }
  return {
    icon: FiTerminal,
    tag: "ALGORITHMS & CP",
    gradient: "from-primary/10 via-card to-background",
  };
};

export const AboutView = ({ metrics }: AboutViewProps) => {
  return (
    <div className="py-10 max-w-3xl mx-auto space-y-12">
      {/* Intro Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="rounded-none">About</Badge>
          <span className="text-xs text-muted-foreground font-mono">{metrics.role}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{aboutConfig.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{metrics.bio}</p>

        {/* Social / Professional links */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {siteConfig.socialLinks.map((s) => {
            const iconMap = {
              github: SiGithub,
              leetcode: SiLeetcode,
              linkedin: FiLinkedin,
              twitter: SiX,
              email: FiMail,
              discord: SiDiscord,
              instagram: SiInstagram,
            };
            const Icon = iconMap[s.platform] ?? FiCode;

            return (
              <Button
                key={s.platform}
                asChild
                size="sm"
                variant="outline"
                className="text-xs rounded-none hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                <Link
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer" : undefined}
                >
                  <Icon className="mr-1.5 size-4" />
                  {s.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </motion.div>

      <Separator />

      {/* Focus & Engineering: Standardized ShowcaseCard */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold tracking-tight mb-6">Core Focus</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {aboutConfig.focus.map((item) => {
            const artwork = getFocusArtwork(item.title);

            return (
              <ShowcaseCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={artwork.icon}
                gradient={artwork.gradient}
                headerBadge={{
                  text: artwork.tag,
                  variant: "neutral",
                }}
              />
            );
          })}
        </div>
      </motion.section>

      {/* Technical Stack: Clean categorized layout */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold tracking-tight mb-6">Technical Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {siteConfig.skills.map((category) => (
            <MotionCard key={category.title} className="p-5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((s) => (
                  <Badge
                    key={s.name}
                    variant={s.featured ? "secondary" : "outline"}
                    className={`text-xs py-0.5 rounded-none transition-colors ${
                      s.featured
                        ? "font-medium bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground group-hover:border-primary/20"
                    }`}
                  >
                    {s.name}
                  </Badge>
                ))}
              </div>
            </MotionCard>
          ))}
        </div>
      </motion.section>

      {/* Experience Journey */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
          <FiBriefcase className="size-4 text-muted-foreground" />
          Experience
        </h2>
        <div className="space-y-4">
          {siteConfig.experience.map((exp) => (
            <MotionCard key={exp.company} className="p-5 border-l-4 border-l-primary/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {exp.role} · {exp.company}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{exp.period}</span>
              </div>
              <ul className="mt-3 text-xs text-muted-foreground space-y-2 list-disc list-inside">
                {exp.description.map((desc, i) => (
                  <li key={i} className="leading-relaxed">{desc}</li>
                ))}
              </ul>
              {exp.technologies && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/40">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded-none text-muted-foreground group-hover:border-primary/20 border border-transparent transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </MotionCard>
          ))}
        </div>
      </motion.section>

      {/* Interests & Focus */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
          <HiSparkles className="size-4 text-muted-foreground" />
          Interests & Focus
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {siteConfig.hobbies.map((hobby) => (
            <MotionCard key={hobby.title} className="p-4.5">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                {hobby.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {hobby.description}
              </p>
            </MotionCard>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AboutView;
