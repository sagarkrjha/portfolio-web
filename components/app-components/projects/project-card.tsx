import Link from "next/link";
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MergedProject } from "@/lib/services/github";

interface ProjectCardProps {
  project: MergedProject;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="flex flex-col justify-between transition-all hover:border-foreground/30 hover:shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug">{project.title}</CardTitle>
          {project.featured && (
            <Badge
              variant="secondary"
              className="text-[10px] uppercase font-bold tracking-wider shrink-0"
            >
              Featured
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-3 text-xs text-muted-foreground mt-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-[11px] font-normal py-0">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2 border-t mt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {project.stars > 0 && (
            <span className="flex items-center gap-1">
              <FiStar className="size-3.5" />
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
            <Button asChild size="icon" variant="ghost" className="size-7">
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
            <Button asChild size="icon" variant="ghost" className="size-7">
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
    </Card>
  );
};

export default ProjectCard;
