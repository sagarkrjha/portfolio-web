"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiGrid, FiList } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import type { BlogPostMeta } from "@/lib/services/blog";
import { TopicArtwork } from "./topic-artwork";

interface BlogListProps {
  posts: (BlogPostMeta & { slug: string })[];
}

export const BlogList = ({ posts }: BlogListProps) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const showViewToggle = posts.length > 2;

  return (
    <div className="mt-8 space-y-6">
      {/* Header controls — toggle is hidden when not needed or on small screens */}
      {posts.length > 0 && (
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <span className="text-xs text-muted-foreground font-mono">
            Showing {posts.length} technical write-up{posts.length === 1 ? "" : "s"}
          </span>

          {showViewToggle && (
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/40 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <FiGrid className="size-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                <FiList className="size-3.5" />
                <span>List</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Animated Blog Cards Container */}
      <motion.div
        layout
        className={viewMode === "grid" ? "grid gap-5 sm:grid-cols-2" : "space-y-4"}
      >
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 30 },
                duration: 0.35,
                delay: index * 0.04,
              }}
              whileHover={{ y: -4 }}
              className={`group relative flex ${
                viewMode === "grid" ? "flex-col" : "flex-col md:flex-row"
              } rounded-xl border border-border/80 bg-card shadow-xs transition-colors hover:border-primary/50 overflow-hidden`}
            >
              {/* Subtle top edge glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

              {/* Topic-Based Visual Graphic */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "w-full h-36"
                    : "w-full md:w-56 h-36 md:h-auto shrink-0"
                }`}
              >
                <TopicArtwork
                  tags={post.tags}
                  slug={post.slug}
                  className="w-full h-full rounded-t-xl md:rounded-tr-none md:rounded-l-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Body Content */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      {post.title}
                    </Link>
                  </h2>

                  {post.subtitle && (
                    <p className="mt-1.5 text-xs sm:text-sm font-medium text-foreground/80 leading-snug">
                      {post.subtitle}
                    </p>
                  )}

                  <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground group-hover:border-primary/20 border border-transparent transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4 shrink-0"
                  >
                    <span>Read</span>
                    <FiArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {posts.length === 0 && (
        <p className="py-12 text-sm text-muted-foreground text-center">
          No blog posts available yet.
        </p>
      )}
    </div>
  );
};

export default BlogList;
