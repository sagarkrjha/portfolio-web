"use client";

import Link from "next/link";
import { FiArrowRight, FiCode, FiCpu, FiDatabase } from "react-icons/fi";
import { SiCplusplus, SiRust } from "react-icons/si";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import type { BlogPostMeta } from "@/lib/services/blog";
import { formatBlogDate } from "@/lib/utils";

interface BlogListProps {
  posts: (BlogPostMeta & { slug: string })[];
}

const getBlogContext = (post: BlogPostMeta) => {
  const tags = post.tags.map((t) => t.toLowerCase());
  const title = post.title.toLowerCase();

  if (tags.includes("rust") || title.includes("rust")) {
    return {
      icon: SiRust,
      tag: "RUST // SYSTEMS",
      gradient: "from-amber-500/10 via-primary/5 to-card",
    };
  }
  if (tags.includes("c++") || title.includes("c++")) {
    return {
      icon: SiCplusplus,
      tag: "C++ // ARCHITECTURE",
      gradient: "from-primary/15 via-primary/5 to-card",
    };
  }
  if (tags.includes("dsa") || tags.includes("algorithms") || title.includes("algorithm")) {
    return {
      icon: FiCpu,
      tag: "ALGORITHMS // DSA",
      gradient: "from-cyan-500/10 via-primary/5 to-card",
    };
  }
  if (tags.includes("database") || tags.includes("storage") || title.includes("file system")) {
    return {
      icon: FiDatabase,
      tag: "SYSTEMS // STORAGE",
      gradient: "from-emerald-500/10 via-primary/5 to-card",
    };
  }
  return {
    icon: FiCode,
    tag: "ENGINEERING",
    gradient: "from-primary/10 via-primary/5 to-card",
  };
};

export const BlogList = ({ posts }: BlogListProps) => {
  return (
    <div className="mt-8 space-y-6">
      {/* Header controls */}
      {posts.length > 0 && (
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <span className="text-xs text-muted-foreground font-mono">
            Showing {posts.length} technical write-up{posts.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {/* Blog Cards Standardized Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => {
          const blogCtx = getBlogContext(post);

          const meta = (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          );

          const footer = (
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">Technical Article</span>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-xs font-mono text-primary font-medium hover:underline group-hover:translate-x-0.5 transition-transform"
              >
                <span>Read write-up</span>
                <FiArrowRight className="size-3" />
              </Link>
            </div>
          );

          return (
            <ShowcaseCard
              key={post.slug}
              title={post.title}
              href={`/blog/${post.slug}`}
              subtitle={post.subtitle}
              description={post.description}
              tags={post.tags.slice(0, 3)}
              icon={blogCtx.icon}
              gradient={blogCtx.gradient}
              headerBadge={{
                text: blogCtx.tag,
                variant: "neutral",
              }}
              meta={meta}
              footer={footer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;
