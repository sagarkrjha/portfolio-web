import {
  HeroComponent,
  ProjectsSection,
  SkillsSection,
  GitHubContributionsSection,
} from "@/components/app-components";
import { getPortfolioProjects, deriveProfileFromProjects } from "@/lib/services/github";

export default async function HomePage() {
  const projects = await getPortfolioProjects();
  const metrics = deriveProfileFromProjects(projects);

  return (
    <main className="justify-center items-center bg-background text-foreground">
      <HeroComponent metrics={metrics} />
      <ProjectsSection initialProjects={projects} featuredOnly={true} />
      <SkillsSection />
      <GitHubContributionsSection />
    </main>
  );
}
