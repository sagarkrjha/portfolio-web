"use client";

import Link from "next/link";
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from "react-icons/fi";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MotionCard } from "@/components/ui/motion-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MergedProject } from "@/lib/services/github";

interface ProjectCardProps {
  project: MergedProject;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <MotionCard className="flex flex-col justify-between">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
          {project.featured && (
            <Badge
              variant="secondary"
              className="text-[10px] uppercase font-bold tracking-wider shrink-0 bg-primary/10 text-primary border border-primary/20"
            >
              Featured
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-3 text-xs text-muted-foreground mt-2 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 py-2">
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-[11px] font-normal py-0 transition-colors group-hover:border-primary/20"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-0 pt-3 flex items-center justify-between border-t border-border/60 mt-4">
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
      </CardFooter>
    </MotionCard>
  );
};

export default ProjectCard;
