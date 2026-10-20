import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/services/blog";
import { highlightCode } from "@/lib/prism";
import { Mermaid } from "@/components/ui/mermaid";
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
  // 1. Markdown link: [text](url)
  // 2. Inline code: `...`
  // 3. Inline math: $...$
  // 4. Bold: **...**
  // 5. Italic: *...*
  const tokens = text.split(
    /(\[[^\]]+\]\([^\)]+\)|`[^`]+`|\$(?:[^\$\n]+)\$|\*\*[^*]+\*\*|(?<=\s|^)\*[^*\n]+\*(?=\s|$|[.,:;!?]))/g,
  );

  return tokens.map((token, i) => {
    if (!token) return null;

    // Link: [label](url)
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isInternal = url.startsWith("/");
      if (isInternal) {
        return (
          <Link
            key={i}
            href={url}
            className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
          >
            {renderInlineFormatted(label)}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
        >
          {renderInlineFormatted(label)}
        </a>
      );
    }

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
function renderMarkdownContent(content: string, postTitle?: string) {
  // Split on code blocks and normal paragraphs
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
            const h1Text = trimmed.replace("# ", "").trim();
            // If the H1 in markdown repeats the post's page title, skip rendering it to avoid duplicate titles
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

          // Blockquote or GitHub Alert Callouts (> [!IMPORTANT] ...)
          if (trimmed.startsWith(">")) {
            const rawQuoteLines = trimmed.split("\n").map((l) => l.replace(/^>\s?/, ""));
            const firstLine = rawQuoteLines[0]?.trim() || "";
            const isAlert = firstLine.startsWith("[!");
            
            if (isAlert) {
              const alertTypeMatch = firstLine.match(/^\[!([A-Z]+)\]/i);
              const alertType = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : "NOTE";
              const restLines = [firstLine.replace(/^\[![A-Z]+\]\s*/i, ""), ...rawQuoteLines.slice(1)].filter((l) => l.trim().length > 0);
              
              const alertColors: Record<string, { border: string; bg: string; title: string; text: string }> = {
                NOTE: { border: "border-blue-500/40", bg: "bg-blue-500/10", title: "text-blue-500", text: "Note" },
                IMPORTANT: { border: "border-amber-500/40", bg: "bg-amber-500/10", title: "text-amber-500", text: "Important" },
                WARNING: { border: "border-red-500/40", bg: "bg-red-500/10", title: "text-red-500", text: "Warning" },
                TIP: { border: "border-emerald-500/40", bg: "bg-emerald-500/10", title: "text-emerald-500", text: "Tip" },
                CAUTION: { border: "border-red-600/40", bg: "bg-red-600/10", title: "text-red-600", text: "Caution" },
              };
              
              const conf = alertColors[alertType] || alertColors.NOTE;
              
              return (
                <div key={pIdx} className={`my-4 rounded-lg border ${conf.border} ${conf.bg} p-4 text-sm leading-relaxed`}>
                  <div className={`font-semibold mb-2 text-xs uppercase tracking-wider ${conf.title}`}>
                    {conf.text}
                  </div>
                  <div className="text-foreground/90 space-y-2">
                    {restLines.map((rl, rIdx) => {
                      const trimmedLine = rl.trim();
                      if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
                        return (
                          <div key={rIdx} className="flex items-start gap-2 text-sm text-foreground/90">
                            <span className="text-primary mt-1">•</span>
                            <span>{renderInlineFormatted(trimmedLine.replace(/^[-*]\s+/, ""))}</span>
                          </div>
                        );
                      }
                      return <p key={rIdx}>{renderInlineFormatted(rl)}</p>;
                    })}
                  </div>
                </div>
              );
            }

            return (
              <blockquote key={pIdx} className="my-4 border-l-2 border-primary/60 pl-4 py-1 space-y-2 text-sm sm:text-base text-muted-foreground bg-muted/20 rounded-r-md">
                {rawQuoteLines.map((ql, qIdx) => {
                  const lineTrimmed = ql.trim();
                  if (!lineTrimmed) return null;

                  if (lineTrimmed.startsWith("### ")) {
                    return (
                      <h4 key={qIdx} className="text-base font-semibold text-foreground tracking-tight not-italic">
                        {renderInlineFormatted(lineTrimmed.replace("### ", ""))}
                      </h4>
                    );
                  }

                  if (lineTrimmed.startsWith("* ") || lineTrimmed.startsWith("- ")) {
                    return (
                      <div key={qIdx} className="flex items-start gap-2 text-sm not-italic text-foreground/90 pl-1">
                        <span className="text-primary mt-1">•</span>
                        <span>{renderInlineFormatted(lineTrimmed.replace(/^[-*]\s+/, ""))}</span>
                      </div>
                    );
                  }

                  return (
                    <p key={qIdx} className="italic">
                      {renderInlineFormatted(ql)}
                    </p>
                  );
                })}
              </blockquote>
            );
          }

          // Markdown Table
          if (trimmed.includes("|") && trimmed.split("\n").length >= 2) {
            const tableLines = trimmed.split("\n").filter((l) => l.trim().startsWith("|") && l.trim().endsWith("|"));
            if (tableLines.length >= 2) {
              const parseRowCells = (rowStr: string): string[] => {
                const trimmedRow = rowStr.trim();
                const inner = trimmedRow.startsWith("|") && trimmedRow.endsWith("|")
                  ? trimmedRow.slice(1, -1)
                  : trimmedRow;
                const cells: string[] = [];
                let current = "";
                let inCode = false;
                for (let i = 0; i < inner.length; i++) {
                  const ch = inner[i];
                  if (ch === "`") {
                    inCode = !inCode;
                    current += ch;
                  } else if (ch === "\\" && i + 1 < inner.length && inner[i + 1] === "|") {
                    current += "|";
                    i++;
                  } else if (ch === "|" && !inCode) {
                    cells.push(current.trim());
                    current = "";
                  } else {
                    current += ch;
                  }
                }
                cells.push(current.trim());
                return cells;
              };

              const headerLine = tableLines[0];
              const delimiterLine = tableLines[1];
              if (delimiterLine.includes("---")) {
                const headerCells = parseRowCells(headerLine);
                const bodyLines = tableLines.slice(2);
                
                return (
                  <div key={pIdx} className="my-6 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                        <tr>
                          {headerCells.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-2.5">
                              {renderInlineFormatted(h)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bodyLines.map((row, rIdx) => {
                          const cells = parseRowCells(row);
                          return (
                            <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                              {cells.map((cell, cIdx) => {
                                const subLines = cell.split(/<br\s*\/?>/i);
                                return (
                                  <td key={cIdx} className="px-4 py-2 text-muted-foreground align-top">
                                    {subLines.map((sub, sIdx) => (
                                      <div key={sIdx} className={sIdx > 0 ? "mt-1.5" : ""}>
                                        {renderInlineFormatted(sub.trim())}
                                      </div>
                                    ))}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
            }
          }

          // Process line-by-line for structured content (nested lists, numbered steps, bullets, checkboxes, embedded math)
          const rawLines = trimmed.split("\n");
          const hasListItems = rawLines.some((l) => /^\s*(\*|-|\d+\.|- \[[ xX]\])\s/.test(l));

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
                  const isChecklist = /^\s*[-*]\s\[([ xX])\]\s/.test(line);
                  const isBullet = /^\s*[-*]\s/.test(line);
                  const isNumbered = /^\s*\d+\.\s/.test(line);

                  if (isChecklist) {
                    const checked = /\[[xX]\]/.test(lineTrimmed);
                    const cleanText = lineTrimmed.replace(/^[-*]\s\[([ xX])\]\s+/, "");
                    return (
                      <div key={lIdx} className="flex items-start gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="mt-1 h-3.5 w-3.5 rounded border-border accent-primary pointer-events-none"
                        />
                        <div className="leading-relaxed flex-1">
                          {renderInlineFormatted(cleanText)}
                        </div>
                      </div>
                    );
                  }

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
        {post.meta.subtitle && (
          <p className="mt-3 text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
            {post.meta.subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-8 space-y-4">
        {renderMarkdownContent(post.content, post.meta.title)}
      </div>
    </article>
  );
}
