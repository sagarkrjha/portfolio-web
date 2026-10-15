"use client";

import { useEffect, useState, cloneElement } from "react";
import { useTheme } from "next-themes";
import { GitHubCalendar } from "react-github-calendar";
import Link from "next/link";
import { FiArrowUpRight, FiGitCommit, FiFolder } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";

interface GitHubContributionsSectionProps {
  username?: string;
}

export const GitHubContributionsSection = ({
  username = siteConfig.github.username,
}: GitHubContributionsSectionProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sectionConfig = siteConfig.sections?.contributions;

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorScheme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <section id="contributions" className="border-t py-16 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
              {sectionConfig?.number ?? "04"} / Contributions
            </span>
            <span className="text-muted-foreground/40">•</span>
            <Badge variant="outline" className="text-[11px] font-normal py-0">
              {sectionConfig?.badge ?? "Open Source Activity"}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            {sectionConfig?.title ?? "GitHub Contributions & Activity"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            {sectionConfig?.description ??
              "Consistent daily contributions, open-source commits, and active project development across GitHub."}
          </p>
        </div>

        <Link
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-foreground/80 border border-primary/20 bg-muted/30 hover:bg-muted/60 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shadow-xs w-fit"
        >
          <SiGithub className="size-3.5" />
          <span>View GitHub Profile</span>
          <FiArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-8">
        <Card className="p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted/40">
                <FiGitCommit className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">github.com/{username}</p>
                <p className="text-[11px] text-muted-foreground">
                  Contribution graph in the last year
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FiFolder className="size-3.5" />
                <span>{siteConfig.github.repositoryCount ?? 4} Public Repos</span>
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto py-2 flex justify-center items-center">
            {mounted ? (
              <GitHubCalendar
                username={username}
                colorScheme={colorScheme}
                theme={{
                  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                  dark: ["#27272a", "#0e4429", "#006d32", "#26a641", "#39d353"],
                }}
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                showTotalCount={true}
                renderBlock={(block, activity) =>
                  cloneElement(block, {
                    title: `${activity.count} contribution${activity.count === 1 ? "" : "s"} on ${activity.date}`,
                    children: (
                      <title>{`${activity.count} contribution${activity.count === 1 ? "" : "s"} on ${activity.date}`}</title>
                    ),
                  })
                }
                labels={{
                  totalCount: "{{count}} contributions in the last year",
                }}
              />
            ) : (
              <div className="h-32 w-full animate-pulse rounded bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
                Loading GitHub contributions calendar...
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default GitHubContributionsSection;
