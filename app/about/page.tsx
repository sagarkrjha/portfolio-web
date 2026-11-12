import type { Metadata } from "next";
import { getPortfolioProjects, deriveProfileFromProjects } from "@/lib/services/github";
import { AboutView } from "@/components/app-components/about/about-view";

export const metadata: Metadata = {
  title: "About | Sagar Kumar Jha",
  description:
    "Learn more about Sagar Kumar Jha, software engineering focus, experience journey, skills, and interests.",
};

export default async function AboutPage() {
  const projects = await getPortfolioProjects();
  const metrics = deriveProfileFromProjects(projects);

  return <AboutView metrics={metrics} />;
}
