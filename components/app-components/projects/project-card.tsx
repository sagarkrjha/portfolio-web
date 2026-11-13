"use client";

import Link from "next/link";
import {
  FiGithub,
  FiExternalLink,
  FiStar,
  FiGitBranch,
  FiTerminal,
  FiCpu,
  FiDatabase,
  FiCode,
} from "react-icons/fi";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { Button } from "@/components/ui/button";
import type { MergedProject } from "@/lib/services/github";

interface ProjectCardProps {
  project: MergedProject;
}

const getRepoContext = (project: MergedProject) => {
  const name = project.name.toLowerCase();
  const stack = project.techStack.map((s) => s.toLowerCase());

  if (name.includes("db") || name.includes("storage") || stack.includes("c++")) {
    return {
      icon: FiDatabase,
      tag: "SYSTEMS // STORAGE",
      gradient: "from-primary/15 via-card to-background",
    };
  }
  if (name.includes("git") || name.includes("vcs") || stack.includes("rust")) {
    return {
      icon: FiCpu,
      tag: "LOW-LEVEL // ENGINE",
      gradient: "from-primary/20 via-card to-background",
    };
  }
  if (name.includes("act") || name.includes("tool") || stack.includes("go")) {
    return {
      icon: FiTerminal,
      tag: "CLI // TOOLING",
      gradient: "from-primary/10 via-card to-background",
    };
  }
  return {
    icon: FiCode,
    tag: "SOURCE // REPO",
    gradient: "from-primary/10 via-card to-background",
  };
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const repoContext = getRepoContext(project);

  const isWebHosted =
    project.liveUrl &&
    !project.liveUrl.includes("github.com") &&
    (project.liveUrl.startsWith("http://") || project.liveUrl.startsWith("https://"));

  const imageUrl = isWebHosted
    ? `/api/screenshot?url=${encodeURIComponent(project.liveUrl!)}`
    : undefined;

  const footer = (
    <>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {project.stars > 0 && (
          <span className="flex items-center gap-1">
            <FiStar className="size-3.5 text-amber-500/80" />
            {project.stars}
          </span>
        )}
        {project.forks > 0 && (
          <span className="flex items-center gap-1">
            <FiGitBranch className="size-3.5" />
            {project.forks}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {project.githubUrl && (
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="size-7 hover:text-primary transition-colors cursor-pointer"
          >
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`GitHub repo for ${project.title}`}
            >
              <FiGithub className="size-3.5" />
            </Link>
          </Button>
        )}
        {project.liveUrl && (
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="size-7 hover:text-primary transition-colors cursor-pointer"
          >
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Live demo for ${project.title}`}
            >
              <FiExternalLink className="size-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </>
  );

  return (
    <ShowcaseCard
      title={project.title}
      href={project.liveUrl || project.githubUrl}
      description={project.description}
      tags={project.techStack}
      imageUrl={imageUrl}
      icon={repoContext.icon}
      gradient={repoContext.gradient}
      headerBadge={{
        text: isWebHosted ? "LIVE" : "SOURCE",
        variant: isWebHosted ? "live" : "source",
      }}
      footer={footer}
      external
    />
  );
};

export default ProjectCard;
