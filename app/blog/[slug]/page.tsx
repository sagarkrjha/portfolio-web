import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/services/blog";
import { highlightCode } from "@/lib/prism";
import React from "react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.meta.title} | Sagar Kumar Jha`,
    description: post.meta.description,
  };
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

// Helper to format inline code, bold, italics, math, and links without broken symbols
function renderInlineFormatted(text: string): React.ReactNode {
  // Regex:
  // 1. Inline code: `...`
  // 2. Inline math: $...$ (strictly within $$ boundaries)
  // 3. Bold: **...**
  // 4. Italic: *...*
  const tokens = text.split(/(`[^`]+`|\$(?:[^\$\n]+)\$|\*\*[^*]+\*\*|(?<=\s|^)\*[^*\n]+\*(?=\s|$|[.,:;!?]))/g);

  return tokens.map((token, i) => {
    if (!token) return null;

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground font-medium border border-border/50"
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
          className="font-mono text-xs sm:text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-medium border border-border/40 inline-block align-baseline whitespace-nowrap"
        >
          {mathContent}
        </span>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {renderInlineFormatted(token.slice(2, -2))}
        </strong>
      );
    }

    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return (
        <em key={i} className="italic text-foreground">
          {token.slice(1, -1)}
        </em>
      );
    }

    return token;
  });
}

// Custom markdown content renderer with syntax highlighting and rich element support
function renderMarkdownContent(content: string) {
  // Split on code blocks and normal paragraphs
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const firstLineEnd = part.indexOf("\n");
      const lang = part.slice(3, firstLineEnd).trim();
      const code = part.slice(firstLineEnd + 1, -3);

      const { highlightedHtml, language } = highlightCode(code, lang);

      return (
        <pre
          key={index}
          className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-xs sm:text-sm leading-relaxed text-foreground"
        >
          {highlightedHtml ? (
            <code
              className={`language-${language} font-mono`}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Prism output is safe
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <code>{code}</code>
          )}
        </pre>
      );
    }

    // Process normal markdown sections by paragraphs
    const paragraphs = part.split(/\n\n+/);
    return (
      <div key={index} className="space-y-4">
        {paragraphs.map((rawParagraph, pIdx) => {
          const trimmed = rawParagraph.trim();
          if (!trimmed) return null;

          if (trimmed === "---") {
            return <hr key={pIdx} className="my-8 border-border" />;
          }

          if (trimmed.startsWith("# ")) {
            return (
              <h1 key={pIdx} className="text-2xl sm:text-3xl font-bold tracking-tight mt-8 mb-4">
                {renderInlineFormatted(trimmed.replace("# ", ""))}
              </h1>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={pIdx}
                className="text-xl sm:text-2xl font-semibold tracking-tight mt-8 mb-3 border-b border-border pb-2"
              >
                {renderInlineFormatted(trimmed.replace("## ", ""))}
              </h2>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <h3
                key={pIdx}
                className="text-lg sm:text-xl font-semibold tracking-tight mt-6 mb-2 text-foreground"
              >
                {renderInlineFormatted(trimmed.replace("### ", ""))}
              </h3>
            );
          }
          if (trimmed.startsWith("#### ")) {
            return (
              <h4
                key={pIdx}
                className="text-base font-semibold tracking-tight mt-4 mb-1 text-foreground"
              >
                {renderInlineFormatted(trimmed.replace("#### ", ""))}
              </h4>
            );
          }

          // Block math expression ($$...$$)
          if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
            const rawExpr = trimmed.slice(2, -2).trim();
            const formattedExpr = formatMathExpression(rawExpr);
            return (
              <div
                key={pIdx}
                className="my-4 py-3 px-4 rounded-md bg-muted/40 border border-border/40 text-center font-mono text-sm sm:text-base text-foreground overflow-x-auto"
              >
                {formattedExpr}
              </div>
            );
          }

          // Process line-by-line for structured content (nested lists, numbered steps, bullets, embedded math)
          const rawLines = trimmed.split("\n");
          const hasListItems = rawLines.some((l) => /^\s*(\*|-|\d+\.)\s/.test(l));

          if (hasListItems) {
            return (
              <div key={pIdx} className="space-y-2 my-3 text-sm sm:text-base text-muted-foreground">
                {rawLines.map((line, lIdx) => {
                  const lineTrimmed = line.trim();
                  if (!lineTrimmed) return null;

                  // Block math within a list block:
                  if (lineTrimmed.startsWith("$$") && lineTrimmed.endsWith("$$")) {
                    const rawExpr = lineTrimmed.slice(2, -2).trim();
                    const formattedExpr = formatMathExpression(rawExpr);
                    return (
                      <div
                        key={lIdx}
                        className="my-2 py-2 px-3 rounded-md bg-muted/50 border border-border/40 text-center font-mono text-sm sm:text-base text-foreground overflow-x-auto mx-4"
                      >
                        {formattedExpr}
                      </div>
                    );
                  }

                  const isSubItem = /^\s{4,}/.test(line) || /^\t+/.test(line);
                  const isBullet = /^\s*[-*]\s/.test(line);
                  const isNumbered = /^\s*\d+\.\s/.test(line);

                  if (isNumbered) {
                    const cleanText = lineTrimmed.replace(/^\d+\.\s+/, "");
                    return (
                      <div key={lIdx} className="flex items-start gap-2 pt-2 first:pt-0">
                        <span className="font-semibold text-foreground shrink-0 select-none">
                          {lineTrimmed.match(/^\d+\./)?.[0]}
                        </span>
                        <div className="leading-relaxed flex-1">
                          {renderInlineFormatted(cleanText)}
                        </div>
                      </div>
                    );
                  }

                  if (isBullet) {
                    const cleanText = lineTrimmed.replace(/^[-*]\s+/, "");
                    return (
                      <div
                        key={lIdx}
                        className={`flex items-start gap-2 leading-relaxed ${
                          isSubItem ? "pl-8 text-muted-foreground/90" : "pl-4"
                        }`}
                      >
                        <span className="text-primary/70 shrink-0 select-none mt-1">
                          {isSubItem ? "◦" : "•"}
                        </span>
                        <div className="flex-1">{renderInlineFormatted(cleanText)}</div>
                      </div>
                    );
                  }

                  return (
                    <div key={lIdx} className="leading-relaxed pl-8">
                      {renderInlineFormatted(lineTrimmed)}
                    </div>
                  );
                })}
              </div>
            );
          }

          return (
            <p key={pIdx} className="text-sm sm:text-base leading-7 text-muted-foreground">
              {renderInlineFormatted(trimmed)}
            </p>
          );
        })}
      </div>
    );
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-12 max-w-3xl mx-auto px-4 sm:px-0">
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-6"
        >
          ← Back to all posts
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <time dateTime={post.meta.date}>{post.meta.date}</time>
          <span>•</span>
          <span>{post.meta.readTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {post.meta.title}
        </h1>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-8 space-y-4">
        {renderMarkdownContent(post.content)}
      </div>
    </article>
  );
}
