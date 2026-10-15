import { FiCode, FiLayers, FiTool, FiCpu } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";

const categoryIcons = [FiCode, FiLayers, FiTool, FiCpu];

export const SkillsSection = () => {
  const sectionConfig = siteConfig.sections?.skills;

  return (
    <section id="skills" className="border-t py-16 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
              {sectionConfig?.number ?? "02"} / Stack
            </span>
            <span className="text-muted-foreground/40">•</span>
            <Badge variant="outline" className="text-[11px] font-normal py-0">
              {sectionConfig?.badge ?? "Core Competencies"}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            {sectionConfig?.title ?? "Technical Stack & Architecture"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            {sectionConfig?.description ??
              "Core systems programming, frontend architectures, databases, and DevOps automation tooling."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 mt-8">
        {siteConfig.skills.map((category, idx) => {
          const Icon = categoryIcons[idx % categoryIcons.length];

          return (
            <Card key={category.title} className="p-5">
              <CardHeader className="p-0 pb-3 flex flex-row items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md border bg-muted/30 text-foreground">
                  <Icon className="size-3.5" />
                </div>
                <CardTitle className="text-sm font-semibold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-2 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant={skill.featured ? "secondary" : "outline"}
                    className={`text-xs py-0.5 ${skill.featured ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
