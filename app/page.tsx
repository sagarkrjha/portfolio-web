import {
  HeroComponent,
  ProjectsSection,
  SkillsSection,
  LeetCodeSection,
  GitHubContributionsSection,
} from "@/components/app-components";
import { getPortfolioProjects, deriveProfileFromProjects } from "@/lib/services/github";
import { getLeetCodeStats } from "@/lib/services/leetcode";

export default async function HomePage() {
  const [projects, leetCodeStats] = await Promise.all([getPortfolioProjects(), getLeetCodeStats()]);

  const metrics = deriveProfileFromProjects(projects);

  return (
    <main className="justify-center items-center bg-background text-foreground">
      <HeroComponent metrics={metrics} leetCodeStats={leetCodeStats} />
      <ProjectsSection initialProjects={projects} featuredOnly={true} />
      <SkillsSection />
      <LeetCodeSection stats={leetCodeStats} />
      <GitHubContributionsSection />
    </main>
  );
}
