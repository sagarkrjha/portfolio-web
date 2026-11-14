import React from "react";
import Link from "next/link";
import { MarkdownRenderer, extractHeadings } from "@/components/blog/markdown-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { formatBlogDate } from "@/lib/utils";

export interface BlogPostMeta {
  slug?: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface BlogPostData {
  meta: BlogPostMeta;
  content: string;
}

interface BlogArticleViewProps {
  post: BlogPostData;
  mode?: "browser" | "os";
  showBackLink?: boolean;
}

export function BlogArticleView({
  post,
  mode = "browser",
  showBackLink = true,
}: BlogArticleViewProps) {
  const headings = extractHeadings(post.content);

  // In standard browser mode, layout is centered with desktop side-by-side sticky TOC and mobile collapsible dropdown
  if (mode === "browser") {
    return (
      <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-12 justify-center">
          {/* Main Article Container */}
          <article className="max-w-3xl w-full">
            <div className="mb-8">
              {showBackLink && (
                <Link
                  href="/blog"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-6"
                >
                  ← Back to all posts
                </Link>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                <time dateTime={post.meta.date}>{formatBlogDate(post.meta.date)}</time>
                <span>•</span>
                <span>{post.meta.readTime}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {post.meta.title}
              </h1>
              {post.meta.subtitle && (
                <p className="mt-3 text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
                  {post.meta.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground border border-border/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Mobile / Tablet Collapsible Outline */}
              <TableOfContents headings={headings} variant="mobile" />
            </div>

            <div className="border-t border-border pt-8 space-y-4">
              <MarkdownRenderer content={post.content} postTitle={post.meta.title} />
            </div>
          </article>

          {/* Desktop Sticky Table of Contents Sidebar */}
          <TableOfContents headings={headings} variant="desktop" />
        </div>
      </div>
    );
  }

  // OS Mode view (rendered inside OS window scroll container)
  return (
    <article className="max-w-3xl mx-auto space-y-8 select-text">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
          <time dateTime={post.meta.date}>{formatBlogDate(post.meta.date)}</time>
          <span>•</span>
          <span>{post.meta.readTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {post.meta.title}
        </h1>
        {post.meta.subtitle && (
          <p className="mt-3 text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
            {post.meta.subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground border border-border/40"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rendered Markdown Body */}
      <div className="border-t border-border pt-8 space-y-4">
        <MarkdownRenderer content={post.content} postTitle={post.meta.title} />
      </div>
    </article>
  );
}
