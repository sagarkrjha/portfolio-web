"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FiExternalLink,
  FiLoader,
  FiAlertCircle,
  FiCode,
  FiEye,
  FiList,
  FiFileText,
} from "react-icons/fi";
import {
  BlogArticleView,
  type BlogPostData,
  type HeadingItem,
  extractHeadings,
} from "@/components/blog";

interface BlogReaderViewProps {
  slug: string;
  isDark?: boolean;
}

export const BlogReaderView = ({ slug }: BlogReaderViewProps) => {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [showToc, setShowToc] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article could not be loaded");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setPost(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load article");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  // Extract table of contents headings
  const headings = useMemo<HeadingItem[]>(() => {
    if (!post?.content) return [];
    return extractHeadings(post.content);
  }, [post?.content]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[380px] space-y-3 font-mono text-xs opacity-75">
        <FiLoader className="size-6 animate-spin text-primary" />
        <p>Loading article & compiling markdown AST...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[380px] p-6 text-center space-y-3">
        <FiAlertCircle className="size-8 text-amber-500" />
        <h3 className="font-semibold text-sm">Failed to open article</h3>
        <p className="text-xs opacity-75 max-w-sm">{error || "Article not found"}</p>
        <a
          href={`/blog/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-primary text-black font-semibold hover:opacity-90 transition-opacity"
        >
          <span>Open in standard browser</span>
          <FiExternalLink className="size-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full select-text">
      {/* VS Code like Editor / Markdown Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 select-none shrink-0 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2 truncate">
          <FiFileText className="size-3.5 text-primary" />
          <span className="font-semibold text-foreground truncate">{post.meta.slug || slug}.md</span>
          <span className="text-[10px] opacity-60">({post.meta.readTime})</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Outline / Table of Contents */}
          {headings.length > 0 && (
            <button
              type="button"
              onClick={() => setShowToc((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.8 rounded text-[11px] transition-colors cursor-pointer border ${
                showToc
                  ? "bg-primary/20 text-primary border-primary/40 font-semibold"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
              }`}
              title="Toggle Table of Contents"
            >
              <FiList className="size-3" />
              <span>Outline ({headings.length})</span>
            </button>
          )}

          {/* Toggle Markdown Preview vs Raw Source */}
          <div className="flex items-center rounded border border-border overflow-hidden text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-0.8 transition-colors cursor-pointer ${
                viewMode === "preview"
                  ? "bg-primary text-black font-bold"
                  : "hover:bg-muted opacity-70"
              }`}
            >
              <FiEye className="size-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`flex items-center gap-1 px-2.5 py-0.8 transition-colors cursor-pointer ${
                viewMode === "raw"
                  ? "bg-primary text-black font-bold"
                  : "hover:bg-muted opacity-70"
              }`}
            >
              <FiCode className="size-3" />
              <span>Source</span>
            </button>
          </div>

          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1 hover:text-primary transition-colors ml-1"
            title="Open in new external browser tab"
          >
            <FiExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Main Content Area: Split View when Outline is active */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents sidebar */}
        {showToc && headings.length > 0 && viewMode === "preview" && (
          <aside className="w-56 shrink-0 border-r border-border p-3 overflow-y-auto space-y-1 text-xs select-none bg-muted/20">
            <span className="text-[10px] font-mono uppercase font-bold text-primary block mb-2 px-1">
              Table of Contents
            </span>
            {headings.map((h, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  const el = document.getElementById(h.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`w-full text-left truncate py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-[11px] ${
                  h.level === 3 ? "pl-4 opacity-80" : "font-medium"
                }`}
                title={h.text}
              >
                {h.text}
              </button>
            ))}
          </aside>
        )}

        {/* Article Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          {viewMode === "raw" ? (
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text opacity-90">
              {post.content}
            </pre>
          ) : (
            <BlogArticleView post={post} mode="os" showBackLink={false} />
          )}
        </div>
      </div>
    </div>
  );
};
