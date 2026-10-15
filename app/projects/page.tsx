import type { Metadata } from "next";
import { ProjectsSection } from "@/components/app-components";
import { getPortfolioProjects } from "@/lib/services/github";

export const metadata: Metadata = {
  title: "Projects | Sagar Kumar Jha",
  description:
    "All open-source projects, tools, libraries, and experiments sourced directly from GitHub.",
};

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="py-6 sm:py-10">
      <ProjectsSection initialProjects={projects} featuredOnly={false} />
    </div>
  );
}
