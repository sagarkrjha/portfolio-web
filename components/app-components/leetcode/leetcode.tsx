import Link from "next/link";
import { FiArrowUpRight, FiCheckCircle, FiTarget, FiAward } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";
import type { LeetCodeStats } from "@/lib/services/leetcode";

interface LeetCodeSectionProps {
  stats: LeetCodeStats | null;
}

export const LeetCodeSection = ({ stats }: LeetCodeSectionProps) => {
  const sectionConfig = siteConfig.sections?.leetcode;

  return (
    <section id="leetcode" className="border-t py-16 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
              {sectionConfig?.number ?? "03"} / Algorithms
            </span>
            <span className="text-muted-foreground/40">•</span>
            <Badge variant="outline" className="text-[11px] font-normal py-0">
              {sectionConfig?.badge ?? "LeetCode Stats"}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            {sectionConfig?.title ?? "Competitive Programming & Problem Solving"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            {sectionConfig?.description ??
              "Live metrics, contest rating, and algorithmic mastery across data structures and complex algorithms."}
          </p>
        </div>

        <Link
          href={siteConfig.leetcode.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-foreground/80 border border-primary/20 bg-muted/30 hover:bg-muted/60 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shadow-xs w-fit"
        >
          <span>View LeetCode Profile</span>
          <FiArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FiCheckCircle className="size-4" />
            <span className="text-xs">Total Solved</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{stats?.totalSolved ?? "Active"}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats ? `out of ${stats.totalQuestions}` : "Continuous practice"}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <FiTarget className="size-4" />
            <span className="text-xs font-medium text-foreground">Easy</span>
          </div>
          <p className="text-2xl font-bold text-emerald-500 tracking-tight">
            {stats?.easySolved ?? "—"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Fundamental patterns</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <FiTarget className="size-4" />
            <span className="text-xs font-medium text-foreground">Medium</span>
          </div>
          <p className="text-2xl font-bold text-amber-500 tracking-tight">
            {stats?.mediumSolved ?? "—"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Core interview problems</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <FiAward className="size-4" />
            <span className="text-xs font-medium text-foreground">Hard</span>
          </div>
          <p className="text-2xl font-bold text-red-500 tracking-tight">
            {stats?.hardSolved ?? "—"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Advanced algorithms</p>
        </Card>
      </div>
    </section>
  );
};

export default LeetCodeSection;
