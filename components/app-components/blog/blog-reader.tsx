"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiClock, FiCalendar, FiTag, FiExternalLink, FiLoader, FiAlertCircle } from "react-icons/fi";
import { highlightCode } from "@/lib/prism";
import { Mermaid } from "@/components/ui/mermaid";

interface BlogPostData {
  meta: {
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    date: string;
    readTime: string;
    tags: string[];
  };
  content: string;
}

interface BlogReaderViewProps {
  slug: string;
  isDark: boolean;
}

// Format LaTeX math expressions cleanly into readable text and symbols
function formatMathExpression(expr: string): string {
  return expr
    .replace(/\\Delta/g, "Δ")
    .replace(/\\in/g, "∈")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\ll/g, "≪")
    .replace(/\\gg/g, "≫")
    .replace(/\\dots/g, "…")
    .replace(/\\cdots/g, "⋯")
    .replace(/\\to/g, "→")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, " · ")
    .replace(/\\{/g, "{")
    .replace(/\\}/g, "}")
    .replace(/_\{([^}]+)\}/g, "_$1")
    .replace(/\^\{([^}]+)\}/g, "^$1");
}

function renderInlineFormatted(text: string): React.ReactNode {
  const tokens = text.split(
    /(\[[^\]]+\]\([^\)]+\)|`[^`]+`|\$(?:[^\$\n]+)\$|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|(?<=\s|^)\*[^*\n]+?\*(?=\s|$|[.,:;!?]))/g,
  );

  return tokens.map((token, i) => {
    if (!token) return null;

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 font-medium hover:opacity-80 transition-opacity"
        >
          {renderInlineFormatted(label)}
        </a>
      );
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 font-mono text-xs font-medium border border-black/10 dark:border-white/10"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    if (token.startsWith("$") && token.endsWith("$") && token.length > 2) {
      const mathContent = formatMathExpression(token.slice(1, -1));
      return (
        <span
          key={i}
          className="font-mono text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded font-medium border border-black/10 dark:border-white/10 inline-block align-baseline whitespace-nowrap"
        >
          {mathContent}
        </span>
      );
    }

    if (token.startsWith("***") && token.endsWith("***") && token.length > 6) {
      return (
        <strong key={i} className="font-semibold italic">
          {renderInlineFormatted(token.slice(3, -3))}
        </strong>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {renderInlineFormatted(token.slice(2, -2))}
        </strong>
      );
    }

    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return <em key={i} className="italic">{token.slice(1, -1)}</em>;
    }

    return token;
  });
}

function renderMarkdownContent(content: string, postTitle?: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const firstLineEnd = part.indexOf("\n");
      const lang = part.slice(3, firstLineEnd).trim();
      const code = part.slice(firstLineEnd + 1, -3);

      if (lang === "mermaid") {
        return <Mermaid key={index} chart={code} />;
      }

      const { highlightedHtml, language } = highlightCode(code, lang);

      return (
        <pre
          key={index}
          className="my-5 overflow-x-auto rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/50 p-4 font-mono text-xs sm:text-sm leading-relaxed"
        >
          {highlightedHtml ? (
            <code
              className={`language-${language} font-mono`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <code>{code}</code>
          )}
        </pre>
      );
    }

    const paragraphs = part.split(/\n\n+/);
    return (
      <div key={index} className="space-y-4">
        {paragraphs.map((rawParagraph, pIdx) => {
          const trimmed = rawParagraph.trim();
          if (!trimmed) return null;

          if (trimmed === "---") {
            return <hr key={pIdx} className="my-8 border-black/10 dark:border-white/10" />;
          }

          if (trimmed.startsWith("# ")) {
            const h1Text = trimmed.replace("# ", "").trim();
            if (postTitle) {
              const cleanH1 = h1Text.replace(/[`*]/g, "").trim().toLowerCase();
              const cleanTitle = postTitle.replace(/[`*]/g, "").trim().toLowerCase();
              if (cleanH1 === cleanTitle || cleanH1.includes(cleanTitle) || cleanTitle.includes(cleanH1)) {
                return null;
              }
            }
            return (
              <h1 key={pIdx} className="text-2xl sm:text-3xl font-bold tracking-tight mt-8 mb-4">
                {renderInlineFormatted(h1Text)}
              </h1>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={pIdx}
                className="text-xl sm:text-2xl font-semibold tracking-tight mt-8 mb-3 border-b border-black/10 dark:border-white/10 pb-2"
              >
                {renderInlineFormatted(trimmed.replace("## ", ""))}
              </h2>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <h3
                key={pIdx}
                className="text-lg sm:text-xl font-semibold tracking-tight mt-6 mb-2"
              >
                {renderInlineFormatted(trimmed.replace("### ", ""))}
              </h3>
            );
          }
          if (trimmed.startsWith("#### ")) {
            return (
              <h4
                key={pIdx}
                className="text-base font-semibold tracking-tight mt-4 mb-1"
              >
                {renderInlineFormatted(trimmed.replace("#### ", ""))}
              </h4>
            );
          }

          if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
            const rawExpr = trimmed.slice(2, -2).trim();
            const formattedExpr = formatMathExpression(rawExpr);
            return (
              <div
                key={pIdx}
                className="my-4 py-3 px-4 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center font-mono text-sm sm:text-base overflow-x-auto"
              >
                {formattedExpr}
              </div>
            );
          }

          // Alerts or quotes
          if (trimmed.startsWith(">")) {
            const rawQuoteLines = trimmed.split("\n").map((l) => l.replace(/^>\s?/, ""));
            const firstLine = rawQuoteLines[0]?.trim() || "";
            const isAlert = firstLine.startsWith("[!");

            if (isAlert) {
              const alertTypeMatch = firstLine.match(/^\[!([A-Z]+)\]/i);
              const alertType = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : "NOTE";
              const restLines = [firstLine.replace(/^\[![A-Z]+\]\s*/i, ""), ...rawQuoteLines.slice(1)].filter(
                (l) => l.trim().length > 0,
              );

              return (
                <div
                  key={pIdx}
                  className="my-4 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm leading-relaxed"
                >
                  <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-primary">
                    {alertType}
                  </div>
                  <div className="space-y-2 opacity-90">
                    {restLines.map((rl, rIdx) => (
                      <p key={rIdx}>{renderInlineFormatted(rl)}</p>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <blockquote
                key={pIdx}
                className="my-4 border-l-2 border-primary/60 pl-4 py-1 space-y-2 text-sm sm:text-base italic opacity-80 bg-black/5 dark:bg-white/5 rounded-r-md"
              >
                {rawQuoteLines.map((ql, qIdx) => (
                  <p key={qIdx}>{renderInlineFormatted(ql)}</p>
                ))}
              </blockquote>
            );
          }

          return (
            <p key={pIdx} className="text-sm sm:text-base leading-7 opacity-90">
              {renderInlineFormatted(trimmed)}
            </p>
          );
        })}
      </div>
    );
  });
}

export const BlogReaderView = ({ slug, isDark }: BlogReaderViewProps) => {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[380px] space-y-3 font-mono text-xs opacity-75">
        <FiLoader className="size-6 animate-spin text-primary" />
        <p>Loading article content...</p>
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
    <article className="p-6 sm:p-10 max-w-3xl mx-auto space-y-8 select-text">
      {/* Article Header */}
      <div className="space-y-4 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs opacity-75">
          <span className="flex items-center gap-1">
            <FiCalendar className="size-3 text-primary" />
            {post.meta.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FiClock className="size-3 text-primary" />
            {post.meta.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {post.meta.title}
        </h1>

        {post.meta.subtitle && (
          <p className="text-sm sm:text-base opacity-80 leading-relaxed font-normal">
            {post.meta.subtitle}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {post.meta.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-[11px] font-mono border border-primary/30 bg-primary/10 text-primary font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Article Body */}
      <div className="space-y-5 leading-relaxed text-sm sm:text-base">
        {renderMarkdownContent(post.content, post.meta.title)}
      </div>
    </article>
  );
};
