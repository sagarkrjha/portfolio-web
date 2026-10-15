"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProjectCard } from "./project-card";
import { siteConfig } from "@/lib/config";
import type { MergedProject } from "@/lib/services/github";

interface ProjectsSectionProps {
  initialProjects: MergedProject[];
  featuredOnly?: boolean;
}

export const ProjectsSection = ({
  initialProjects,
  featuredOnly = false,
}: ProjectsSectionProps) => {
  const sectionConfig = siteConfig.sections?.projects;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const baseProjects = useMemo(() => {
    if (featuredOnly) {
      // Strictly keep repositories that are pinned on GitHub
      const pinned = initialProjects.filter((p) => p.featured);
      return pinned;
    }
    return initialProjects;
  }, [initialProjects, featuredOnly]);

  // Extract all unique tech tags from base projects
  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    for (const p of baseProjects) {
      for (const t of p.techStack) {
        set.add(t);
      }
    }
    return Array.from(set).slice(0, 10);
  }, [baseProjects]);

  // Filter projects based on search query and selected technology chip
  const filteredProjects = useMemo(() => {
    return baseProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTech = selectedTech
        ? project.techStack.map((t) => t.toLowerCase()).includes(selectedTech.toLowerCase())
        : true;

      return matchesSearch && matchesTech;
    });
  }, [baseProjects, searchQuery, selectedTech]);

  return (
    <section id="projects" className="border-t py-16 sm:py-20">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                {sectionConfig?.number ?? "01"} / Portfolio
              </span>
              <span className="text-muted-foreground/40">•</span>
              <Badge variant="outline" className="text-[11px] font-normal py-0">
                {featuredOnly ? (sectionConfig?.badge ?? "Featured Work") : "All Repositories"}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              {featuredOnly
                ? (sectionConfig?.title ?? "Featured Engineering Projects")
                : "GitHub Repositories"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              {featuredOnly
                ? (sectionConfig?.description ??
                  "Core open-source systems, developer tooling, and highlighted projects built with high performance and clean architecture.")
                : "Complete collection of open-source tools, experiments, and libraries sourced directly from GitHub."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {featuredOnly && (
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-foreground/80 border border-primary/20 bg-muted/30 hover:bg-muted/60 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shadow-xs"
              >
                <span>View All Repos</span>
                <FiArrowUpRight className="size-3.5" />
              </Link>
            )}

            {/* Search Input */}
            <div className="w-full sm:w-56">
              <input
                type="text"
                placeholder="Filter by name or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-background/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          {/* Tech stack filter chips */}
          {allTechnologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedTech === null
                    ? "bg-foreground text-background font-medium"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {allTechnologies.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedTech === tech
                      ? "bg-foreground text-background font-medium"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          {filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No projects found matching &quot;{searchQuery || selectedTech}&quot;.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
