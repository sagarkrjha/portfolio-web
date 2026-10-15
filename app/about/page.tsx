import type { Metadata } from "next";
import Link from "next/link";
import { FiCode, FiBriefcase, FiMail, FiLinkedin } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { SiGithub, SiLeetcode, SiX, SiDiscord, SiInstagram } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { siteConfig, aboutConfig } from "@/lib/config";
import { getPortfolioProjects, deriveProfileFromProjects } from "@/lib/services/github";

export const metadata: Metadata = {
  title: "About | Sagar Kumar Jha",
  description:
    "Learn more about Sagar Kumar Jha, software engineering focus, experience journey, skills, and interests.",
};

export default async function AboutPage() {
  const projects = await getPortfolioProjects();
  const metrics = deriveProfileFromProjects(projects);

  return (
    <div className="py-12 px-4 sm:px-0 max-w-3xl mx-auto">
      {/* Intro Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">About Me</Badge>
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
              <Button key={s.platform} asChild size="sm" variant="outline" className="text-xs">
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
      </div>

      <Separator className="my-10" />

      {/* Focus & Engineering */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-6">Core Engineering Focus</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {aboutConfig.focus.map((item) => (
            <div key={item.title} className="p-4 rounded-lg border bg-muted/20">
              <div className="mb-3 flex size-8 items-center justify-center rounded-lg border bg-muted/50">
                <FiCode className="size-4" />
              </div>
              <h3 className="font-medium text-sm">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Technologies */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight mb-6">Technologies & Skills</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {siteConfig.skills.map((category) => (
            <div key={category.title} className="border rounded-lg p-4 bg-muted/10">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((s) => (
                  <Badge
                    key={s.name}
                    variant={s.featured ? "secondary" : "outline"}
                    className="text-xs py-0.5"
                  >
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Journey */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
          <FiBriefcase className="size-4 text-muted-foreground" />
          Experience & Learning Journey
        </h2>
        <div className="space-y-6">
          {siteConfig.experience.map((exp) => (
            <div key={exp.company} className="border-l-2 border-primary/40 pl-4 py-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm font-semibold">
                  {exp.role} · {exp.company}
                </span>
                <span className="text-xs text-muted-foreground">{exp.period}</span>
              </div>
              <ul className="mt-3 text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
              {exp.technologies && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hobbies & Personal Interests */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
          <HiSparkles className="size-4 text-muted-foreground" />
          Hobbies & Personal Interests
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {siteConfig.hobbies.map((hobby) => (
            <div key={hobby.title} className="p-4 rounded-lg border bg-muted/20">
              <h3 className="text-sm font-medium">{hobby.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {hobby.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
