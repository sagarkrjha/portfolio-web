"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiExternalLink,
  FiLoader,
  FiAlertCircle,
  FiCode,
  FiEye,
  FiList,
  FiFileText,
  FiFolder,
  FiCopy,
  FiCheck,
  FiDownload,
  FiChevronDown,
} from "react-icons/fi";
import {
  BlogArticleView,
  type BlogPostData,
  type HeadingItem,
  extractHeadings,
} from "@/components/blog";
import { blogConfig } from "@/lib/config";

interface BlogReaderViewProps {
  slug: string;
  isDark?: boolean;
  onSelectArticle?: (slug: string, title: string) => void;
}

export const BlogReaderView = ({ slug: initialSlug, onSelectArticle }: BlogReaderViewProps) => {
  const [currentSlug, setCurrentSlug] = useState(initialSlug);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [showToc, setShowToc] = useState(true);
  const [activeMenu, setActiveMenu] = useState<"file" | "view" | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync internal slug with external prop
  useEffect(() => {
    setCurrentSlug(initialSlug);
  }, [initialSlug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`/api/blog/${currentSlug}`)
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
  }, [currentSlug]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    if (activeMenu) {
      window.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [activeMenu]);

  // Extract table of contents headings
  const headings = useMemo<HeadingItem[]>(() => {
    if (!post?.content) return [];
    return extractHeadings(post.content);
  }, [post?.content]);

  const handleDownloadMarkdown = () => {
    if (!post) return;
    const blob = new Blob([post.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${post.meta.slug || currentSlug}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActiveMenu(null);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/blog/${currentSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setActiveMenu(null);
  };

  const handleSelectPost = (targetSlug: string, targetTitle: string) => {
    setCurrentSlug(targetSlug);
    if (onSelectArticle) {
      onSelectArticle(targetSlug, targetTitle);
    }
    setActiveMenu(null);
  };

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
          href={`/blog/${currentSlug}`}
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
      {/* VS Code / macOS Window App Menu Bar */}
      <div
        ref={menuRef}
        className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40 select-none shrink-0 text-xs font-mono"
      >
        <div className="flex items-center gap-2">
          {/* File Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu((prev) => (prev === "file" ? null : "file"))}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeMenu === "file"
                  ? "bg-primary text-black font-bold"
                  : "hover:bg-muted text-foreground/80 hover:text-foreground"
              }`}
            >
              <span>File</span>
              <FiChevronDown className="size-3 opacity-60" />
            </button>

            {activeMenu === "file" && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-popover/95 backdrop-blur-md border border-border rounded-lg shadow-xl py-1 z-50 text-xs font-sans text-popover-foreground">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-muted-foreground font-semibold border-b border-border/50">
                  Switch Article
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {blogConfig.posts.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => handleSelectPost(item.slug, item.title)}
                      className={`w-full text-left px-3 py-1.5 text-[11px] truncate flex items-center justify-between hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer ${
                        item.slug === currentSlug ? "text-primary font-semibold bg-primary/5" : ""
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.slug === currentSlug && <span className="text-[10px] text-primary shrink-0 ml-2">✓</span>}
                    </button>
                  ))}
                </div>

                <div className="border-t border-border/50 my-1" />

                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <FiDownload className="size-3.5 text-primary" />
                  <span>Download Markdown (.md)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  {copiedLink ? <FiCheck className="size-3.5 text-emerald-400" /> : <FiCopy className="size-3.5" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Article Link"}</span>
                </button>

                <a
                  href={`/blog/${currentSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setActiveMenu(null)}
                  className="w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <FiExternalLink className="size-3.5" />
                  <span>Open in Browser Tab</span>
                </a>
              </div>
            )}
          </div>

          {/* View Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu((prev) => (prev === "view" ? null : "view"))}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeMenu === "view"
                  ? "bg-primary text-black font-bold"
                  : "hover:bg-muted text-foreground/80 hover:text-foreground"
              }`}
            >
              <span>View</span>
              <FiChevronDown className="size-3 opacity-60" />
            </button>

            {activeMenu === "view" && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-popover/95 backdrop-blur-md border border-border rounded-lg shadow-xl py-1 z-50 text-xs font-sans text-popover-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("preview");
                    setActiveMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] flex items-center justify-between hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer ${
                    viewMode === "preview" ? "text-primary font-semibold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FiEye className="size-3.5" />
                    Preview Mode
                  </span>
                  {viewMode === "preview" && <span>✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("raw");
                    setActiveMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] flex items-center justify-between hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer ${
                    viewMode === "raw" ? "text-primary font-semibold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FiCode className="size-3.5" />
                    Source Mode (.md)
                  </span>
                  {viewMode === "raw" && <span>✓</span>}
                </button>

                <div className="border-t border-border/50 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowToc((prev) => !prev);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[11px] flex items-center justify-between hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FiList className="size-3.5" />
                    Toggle Outline Sidebar
                  </span>
                  {showToc && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          <span className="text-border/60">|</span>

          {/* Active Document Tag */}
          <div className="flex items-center gap-1.5 text-muted-foreground truncate max-w-[200px] sm:max-w-[320px]">
            <FiFileText className="size-3 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate text-[11px]">{post.meta.slug || currentSlug}.md</span>
            <span className="text-[10px] opacity-60 shrink-0">({post.meta.readTime})</span>
          </div>
        </div>

        {/* Right Actions: TOC & Preview/Raw Pill Toggle */}
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
              title="Toggle Table of Contents Outline"
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
            href={`/blog/${currentSlug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1 hover:text-primary transition-colors ml-1 text-muted-foreground"
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
