import { FiCode, FiArrowUpRight, FiBriefcase } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { aboutConfig, siteConfig } from "@/lib/config";

const AboutComponent = () => {
  return (
    <section id={aboutConfig.id} className="border-t py-16 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[180px_1fr]">
        <div>
          <Badge variant="outline">{aboutConfig.eyebrow}</Badge>
        </div>

        <div>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            {aboutConfig.title}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {aboutConfig.description}
          </p>

          <Separator className="my-8" />

          {/* Core Areas */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aboutConfig.focus.map((item) => (
              <article key={item.title} className="group">
                <div className="mb-3 flex size-8 items-center justify-center rounded-lg border bg-muted/30">
                  <FiCode className="size-4" />
                </div>

                <div className="flex items-center gap-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>

                  <FiArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>

          {/* Hobbies / Interests */}
          {siteConfig.hobbies && siteConfig.hobbies.length > 0 && (
            <div className="mt-12">
              <h3 className="text-base font-semibold tracking-tight mb-4 flex items-center gap-2">
                <HiSparkles className="size-4 text-muted-foreground" />
                Interests & Focus
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {siteConfig.hobbies.map((hobby) => (
                  <div key={hobby.title} className="p-3.5 rounded-lg border bg-muted/10">
                    <h4 className="text-xs font-semibold">{hobby.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Journey */}
          {siteConfig.experience && siteConfig.experience.length > 0 && (
            <div className="mt-12">
              <h3 className="text-base font-semibold tracking-tight mb-4 flex items-center gap-2">
                <FiBriefcase className="size-4 text-muted-foreground" />
                Experience & Journey
              </h3>
              <div className="space-y-4">
                {siteConfig.experience.map((exp) => (
                  <div key={exp.company} className="border-l-2 border-primary/30 pl-4 py-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-sm font-medium">
                        {exp.role} · {exp.company}
                      </span>
                      <span className="text-xs text-muted-foreground">{exp.period}</span>
                    </div>
                    <ul className="mt-2 text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground"
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
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutComponent;
